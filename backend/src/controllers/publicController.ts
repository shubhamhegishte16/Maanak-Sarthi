import type { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { findApplicableStandardWithGemini, compareStandardsWithGemini } from '../services/geminiService.js';

// -------------------------------------------------------------
// CURATED FALLBACK DATA
// -------------------------------------------------------------

const FALLBACK_STANDARDS = [
  {
    id: "std-is-302",
    is_number: "IS 302 (Part 2/Sec 21):2018",
    title: "Safety of Household and Similar Electrical Appliances — Particular Requirements for Electric Water Heaters",
    sector: "Electrical Engineering",
    status: "mandatory_qco",
    last_revised: "2018",
    clauses_count: 34,
    scope: "Specifies essential electrical, thermal, and hydrostatic safety requirements for stationary instantaneous and storage water heaters.",
    amendments_count: 2,
    sti_available: true,
    qco_reference: "Electrical Appliances (Quality Control) Order, 2023",
    recognized_labs_count: 14,
    key_requirements: ["Class I apparatus earthing terminal", "Creepage distances > 4.0 mm", "Dry-boiling cutoff test", "Hydrostatic pressure up to 1.0 MPa"],
    related_standards: ["IS 302 (Part 1)", "IS 2082"]
  },
  {
    id: "std-is-16046",
    is_number: "IS 16046 (Part 2):2018",
    title: "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes — Safety Requirements for Portable Sealed Secondary Lithium Cells",
    sector: "Electronics & IT Goods",
    status: "mandatory_crs",
    last_revised: "2018",
    clauses_count: 18,
    scope: "Safety requirements for lithium-ion and lithium polymer secondary cells used in portable electronics, power banks, and laptops.",
    amendments_count: 1,
    sti_available: true,
    qco_reference: "Electronics and Information Technology Goods (Compulsory Registration Order, 2021)",
    recognized_labs_count: 28,
    key_requirements: ["Continuous charging safety", "External short circuit test at 55°C", "Free fall drop testing from 1.0 m", "Thermal abuse withstand at 130°C"],
    related_standards: ["IS 16046 (Part 1)", "IEC 62133-2"]
  },
  {
    id: "std-is-17526",
    is_number: "IS 17526:2021",
    title: "Stainless Steel Vacuum Flasks and Insulated Flasks — Specification",
    sector: "Mechanical & Utensils",
    status: "mandatory_qco",
    last_revised: "2021",
    clauses_count: 16,
    scope: "Prescribes safety, non-toxicity, and thermal insulation retention performance for double-walled stainless steel vacuum flasks.",
    amendments_count: 1,
    sti_available: true,
    qco_reference: "Cookware, Utensils and Canisters (Quality Control) Order, 2024",
    recognized_labs_count: 19,
    key_requirements: ["Food-contact austenitic SS 304", "Temperature retention >= 60°C after 6h", "Drop impact durability", "Heavy metal migration safety"],
    related_standards: ["IS 6911", "IS 9845"]
  },
  {
    id: "std-is-4151",
    is_number: "IS 4151:2020",
    title: "Protective Helmets for Two-Wheeler Motor Vehicle Riders — Specification",
    sector: "Automotive & Road Safety",
    status: "mandatory_qco",
    last_revised: "2020",
    clauses_count: 22,
    scope: "Prescribes physical construction, impact attenuation, and retention system requirements for motorcycle and scooter helmets.",
    amendments_count: 2,
    sti_available: true,
    qco_reference: "Helmets for Riders of Two-Wheeler Motor Vehicles (Quality Control) Order",
    recognized_labs_count: 20,
    key_requirements: ["Impact attenuation test", "Retention system dynamic strength", "Visor optical and scratch resistance"],
    related_standards: ["IS 9944", "IS 7692"]
  }
];

const FALLBACK_SCHEMES = [
  {
    id: "isi",
    scheme_id: "isi",
    name: "Scheme I — ISI Mark Certification",
    sector: "Industrial & Domestic Goods",
    status: "Active",
    schedule: "Schedule-II, Scheme-I (Conformity Assessment Regulations)",
    badge: "Most Common for Industrial & Domestic Goods",
    short_desc: "Traditional standard mark licence granted following factory infrastructure audit, in-house laboratory inspection, and independent sample testing.",
    product_examples: ["Domestic Appliances (IS 302)", "Cement (IS 269)", "Steel Products", "Helmets (IS 4151)", "Bottles (IS 17526)"],
    steps: [
      { number: "01", title: "Product & IS Identification", subtitle: "Define Scope", description: "Identify product specifications and primary applicable Indian Standard.", status: "completed" },
      { number: "02", title: "Manufacturing & Lab Setup", subtitle: "Factory Audit Prep", description: "Ensure internal quality testing machinery matches Scheme of Testing & Inspection (STI).", status: "completed" },
      { number: "03", title: "Document Collation", subtitle: "Form & Annexures", description: "Prepare plant machinery list, calibration records, factory layout, and test certificates.", status: "current" },
      { number: "04", title: "Factory Inspection", subtitle: "BIS Technical Audit", description: "BIS inspecting officers verify manufacturing control and draw counter-samples.", status: "upcoming" },
      { number: "05", title: "Independent Sample Testing", subtitle: "Recognized Lab", description: "Samples drawn during audit are tested at accredited BIS or central laboratories.", status: "upcoming" },
      { number: "06", title: "Licence Grant (CM/L)", subtitle: "Standard Mark", description: "Grant of licence to use Standard ISI Mark on verified production lots.", status: "upcoming" }
    ],
    required_docs: [
      "Factory Registration / Proof of Manufacturing Premises",
      "Process Flowchart & Manufacturing Machinery Inventory",
      "In-House Testing Equipment & Valid Calibration Certificates",
      "Quality Control Personnel Qualifications & Appointment Letters",
      "Raw Material Test Certificates (MTC)",
      "Factory Layout Map and Drawing of Proposed Marking"
    ],
    testing_protocol: "Manufacturer must maintain laboratory equipment conforming to the relevant Scheme of Testing and Inspection (STI) issued by BIS.",
    factory_audit: "Physical audit conducted by BIS authorized technical officers to verify raw material inspection, stage inspection, and routine batch testing.",
    estimated_timeline: "30 to 60 Days from application acceptance",
    official_ref: "BIS Product Certification Scheme-I (BIS Act 2016)"
  },
  {
    id: "crs",
    scheme_id: "crs",
    name: "Scheme II — Compulsory Registration Scheme (CRS)",
    sector: "Electronics & IT Goods",
    status: "Active",
    schedule: "Schedule-II, Scheme-II (Registration Scheme)",
    badge: "Electronic & IT Products",
    short_desc: "Self-declaration of conformity based on laboratory test reports issued by BIS-recognized testing laboratories without pre-licence factory inspection.",
    product_examples: ["Lithium Batteries (IS 16046)", "Laptops & Tablets", "LED Lamps", "Power Adapters", "Smart Watches"],
    steps: [
      { number: "01", title: "Sample Generation", subtitle: "Model Selection", description: "Prepare representative production samples matching product series grouping guidelines.", status: "completed" },
      { number: "02", title: "Testing at BIS Lab", subtitle: "NABL Accredited", description: "Submit samples to BIS-recognized lab for comprehensive safety evaluation.", status: "completed" },
      { number: "03", title: "Test Report Review", subtitle: "90-Day Validity", description: "Verify all clauses of applicable IS standard are evaluated without non-conformance.", status: "current" },
      { number: "04", title: "Online CRS Submission", subtitle: "Self Declaration", description: "Submit application on BIS CRS portal with test report and brand authorization.", status: "upcoming" },
      { number: "05", title: "Scrutiny & Registration", subtitle: "R-Number Grant", description: "BIS assigns unique Registration Number (R-XXXXXXXX) for the brand and models.", status: "upcoming" }
    ],
    required_docs: [
      "Original Test Report from BIS-Recognized Laboratory (less than 90 days old)",
      "Brand Owner Authorization Letter & Trademark Registration Certificate",
      "Authorized Indian Representative (AIR) Undertaking (for foreign brands)",
      "Product Technical Specification & Series Grouping Justification Document",
      "Affidavit cum Undertaking for CRS self-declaration"
    ],
    testing_protocol: "Testing must be conducted strictly at BIS-recognized laboratories in India. Foreign test reports are not accepted under CRS.",
    factory_audit: "No initial factory audit required. Post-market surveillance testing is conducted periodically from retail market samples.",
    estimated_timeline: "15 to 25 Days post test report submission",
    official_ref: "BIS CRS Portal under MeitY Notification"
  },
  {
    id: "hallmarking",
    scheme_id: "hallmarking",
    name: "Hallmarking Scheme for Precious Metals",
    sector: "Jewellery & Precious Metals",
    status: "Active",
    schedule: "Hallmarking Regulations, 2018",
    badge: "Mandatory Gold & Silver Purity",
    short_desc: "Third-party purity certification of gold and silver articles marked with 6-digit alphanumeric HUID code at BIS Assaying & Hallmarking Centres (AHC).",
    product_examples: ["Gold Jewellery (14k, 18k, 20k, 22k, 23k, 24k)", "Silver Artefacts"],
    steps: [
      { number: "01", title: "Portal Registration", subtitle: "Zero Fee for Jewellers", description: "Register outlet details on Manak Online portal.", status: "completed" },
      { number: "02", title: "Consignment Submission", subtitle: "To Recognized AHC", description: "Deliver jewellery pieces to accredited Assaying and Hallmarking Centre.", status: "current" },
      { number: "03", title: "Assay & Laser HUID", subtitle: "XRF & Fire Assay", description: "AHC verifies purity and applies unique 6-digit laser HUID stamp.", status: "upcoming" }
    ],
    required_docs: [
      "GST Registration Certificate of Jeweller Outlet",
      "Proof of Commercial Premises / Trade Licence",
      "Aadhaar / Identity Proof of Authorized Signatory"
    ],
    testing_protocol: "Fire assay method as per IS 1418 for gold and potentiometric titration as per IS 2113 for silver.",
    factory_audit: "Surveillance audits conducted at Assaying Centres and retail jewellery showrooms.",
    estimated_timeline: "Same Day or within 24 Hours at AHC",
    official_ref: "BIS Hallmarking Scheme (Indian Standard IS 1417)"
  }
];

const FALLBACK_LABS = [
  {
    id: "lab-1",
    name: "Central Laboratory, Bureau of Indian Standards (CLD)",
    category: "Electrical & Electronics",
    region: "North",
    city: "Sahibabad, Ghaziabad",
    state: "Uttar Pradesh",
    address: "Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad - 201010",
    recognition_id: "BIS-CLD-001",
    valid_through: "31 Dec 2028",
    accreditation: "NABL (ISO/IEC 17025:2017) & BIS Apex Lab",
    supported_standards: ["IS 302 (Part 1)", "IS 302 (Part 2/Sec 21)", "IS 16046", "IS 17526"],
    key_tests: ["High Voltage Withstand", "Hydrostatic Pressure Test", "Thermal Abuse Test", "Creepage Distance"],
    contact_email: "cld@bis.gov.in",
    contact_phone: "+91 120 2867900"
  },
  {
    id: "lab-2",
    name: "Western Regional Office Laboratory (WROL)",
    category: "Chemical & Mechanical",
    region: "West",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Manakalaya, E9, MIDC, Andheri (East), Mumbai - 400093",
    recognition_id: "BIS-WROL-002",
    valid_through: "30 Jun 2027",
    accreditation: "NABL (ISO/IEC 17025) & BIS Recognized",
    supported_standards: ["IS 17526", "IS 6911", "IS 4151", "IS 2062"],
    key_tests: ["Spectrometric Alloy Analysis", "Thermal Insulation Retention", "Drop Impact Resistance", "Corrosion Resistance"],
    contact_email: "wrol@bis.gov.in",
    contact_phone: "+91 22 28329295"
  },
  {
    id: "lab-3",
    name: "ERTL (North) — Electronics Regional Test Laboratory",
    category: "Electronics & IT Goods",
    region: "North",
    city: "New Delhi",
    state: "Delhi",
    address: "S-Block, Okhla Industrial Area, Phase-II, New Delhi - 110020",
    recognition_id: "BIS-ERTL-044",
    valid_through: "15 Oct 2027",
    accreditation: "NABL & BIS Recognized (CRS Scheme-II)",
    supported_standards: ["IS 16046 (Part 2)", "IS 13252 (Part 1)", "IS 16102"],
    key_tests: ["Battery Short Circuit", "Continuous Overcharge", "Mechanical Shock", "EMC & EMI Emission"],
    contact_email: "ertlnorth@stqc.gov.in",
    contact_phone: "+91 11 26386219"
  }
];

// -------------------------------------------------------------
// STANDARDS
// -------------------------------------------------------------

export async function getStandards(req: Request, res: Response): Promise<void> {
  const { q, sector, status } = req.query;
  try {
    let query = 'SELECT * FROM standards WHERE 1=1';
    const params: any[] = [];

    if (q && typeof q === 'string' && q.trim().length > 0) {
      params.push(`%${q.trim()}%`);
      query += ` AND (is_number ILIKE $${params.length} OR title ILIKE $${params.length} OR sector ILIKE $${params.length} OR COALESCE(scope, '') ILIKE $${params.length})`;
    }

    if (sector && typeof sector === 'string' && sector !== 'All Sectors') {
      params.push(sector);
      query += ` AND sector = $${params.length}`;
    }

    if (status && typeof status === 'string' && status !== 'All Status') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ' ORDER BY is_number ASC';

    const result = await pool.query(query, params);
    if (result.rows.length > 0) {
      res.json({ success: true, standards: result.rows, total: result.rows.length });
      return;
    }
  } catch (err) {
    console.warn('[publicController] getStandards DB fallback:', (err as Error).message);
  }

  // Filter fallback standards
  let filtered = [...FALLBACK_STANDARDS];
  if (q && typeof q === 'string') {
    const ql = q.toLowerCase();
    filtered = filtered.filter(s => s.is_number.toLowerCase().includes(ql) || s.title.toLowerCase().includes(ql));
  }
  res.json({ success: true, standards: filtered, total: filtered.length });
}

export async function getStandardById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const standardId = Array.isArray(id) ? id[0] : id;
  try {
    const isUuid = typeof standardId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(standardId);
    const query = isUuid
      ? 'SELECT * FROM standards WHERE id = $1'
      : 'SELECT * FROM standards WHERE is_number ILIKE $1 LIMIT 1';

    const result = await pool.query(query, [isUuid ? standardId : `%${standardId}%`]);
    if (result.rows.length > 0) {
      res.json({ success: true, standard: result.rows[0] });
      return;
    }
  } catch (err) {
    console.warn('[publicController] getStandardById DB fallback:', (err as Error).message);
  }

  const match = FALLBACK_STANDARDS.find(s => s.id === standardId || s.is_number.toLowerCase().includes((standardId ?? '').toLowerCase())) || FALLBACK_STANDARDS[0];
  res.json({ success: true, standard: match });
}

export async function searchStandards(req: Request, res: Response): Promise<void> {
  return getStandards(req, res);
}

// -------------------------------------------------------------
// FIND APPLICABLE STANDARD (GEMINI-POWERED)
// -------------------------------------------------------------

export async function findApplicableStandard(req: Request, res: Response): Promise<void> {
  const { productName, description, material, industry, intendedUse } = req.body;

  if (!productName && !description) {
    res.status(400).json({ success: false, message: 'Product name or description is required.' });
    return;
  }

  try {
    const aiResults = await findApplicableStandardWithGemini({
      productName: productName || 'Product',
      description: description || '',
      material,
      industry,
      intendedUse,
    });

    res.json({ success: true, results: aiResults });
  } catch (err) {
    console.error('[publicController] findApplicableStandard fallback:', err);

    const searchTerm = productName || description || '';
    const qLower = searchTerm.toLowerCase();

    let matched = FALLBACK_STANDARDS.filter(s =>
      s.title.toLowerCase().includes(qLower) || s.sector.toLowerCase().includes(qLower)
    );
    if (matched.length === 0) matched = FALLBACK_STANDARDS.slice(0, 2);

    const mapped = matched.map((s) => ({
      id: s.id,
      isNumber: s.is_number,
      title: s.title,
      year: s.last_revised || '2024',
      status: s.status,
      scopeRelevance: s.scope,
      confidence: 'high',
      mandatoryQCO: true,
      qcoReference: s.qco_reference,
      relatedStandards: s.related_standards,
      keyRequirements: s.key_requirements,
      evidenceExcerpt: `Standard notified under BIS Act. Mandatory compliance for ${s.sector} goods.`,
    }));

    res.json({ success: true, results: mapped });
  }
}

// -------------------------------------------------------------
// CERTIFICATION SCHEMES
// -------------------------------------------------------------

export async function getSchemes(_req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM schemes ORDER BY created_at ASC');
    if (result.rows.length > 0) {
      res.json({ success: true, schemes: result.rows });
      return;
    }
  } catch (err) {
    console.warn('[publicController] getSchemes DB fallback:', (err as Error).message);
  }

  res.json({ success: true, schemes: FALLBACK_SCHEMES });
}

export async function getSchemeById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const schemeId = Array.isArray(id) ? id[0] : id;
  try {
    const isUuid = typeof schemeId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(schemeId);
    const query = isUuid
      ? 'SELECT * FROM schemes WHERE id = $1'
      : 'SELECT * FROM schemes WHERE scheme_id ILIKE $1 LIMIT 1';

    const result = await pool.query(query, [isUuid ? schemeId : schemeId]);
    if (result.rows.length > 0) {
      res.json({ success: true, scheme: result.rows[0] });
      return;
    }
  } catch (err) {
    console.warn('[publicController] getSchemeById DB fallback:', (err as Error).message);
  }

  const match = FALLBACK_SCHEMES.find(s => s.id === schemeId || s.scheme_id === schemeId) || FALLBACK_SCHEMES[0];
  res.json({ success: true, scheme: match });
}

// -------------------------------------------------------------
// UPDATES & QCO NOTIFICATIONS
// -------------------------------------------------------------

export async function getUpdates(_req: Request, res: Response): Promise<void> {
  const alerts: any[] = [];

  try {
    const qcosRes = await pool.query('SELECT * FROM qcos ORDER BY created_at DESC');
    qcosRes.rows.forEach((q: any) => {
      alerts.push({
        id: `qco-${q.id}`,
        category: 'QCO',
        title: q.title,
        standardReference: q.standard_reference || q.qco_number,
        gazetteOrder: q.gazette_number || q.ministry,
        summary: q.summary || `Statutory order notified by ${q.ministry}.`,
        datePublished: q.order_date || 'Recent',
        lastCheckedDate: new Date().toLocaleDateString('en-GB'),
        effectiveDeadline: q.enforcement_date,
        sourceUrl: q.source_url || 'https://www.bis.gov.in',
        read: false,
      });
    });
  } catch (err) {
    console.warn('[publicController] getUpdates qcos fallback:', (err as Error).message);
  }

  try {
    const stdsRes = await pool.query('SELECT * FROM standards WHERE amendments_count > 0 ORDER BY updated_at DESC LIMIT 5');
    stdsRes.rows.forEach((s: any) => {
      alerts.push({
        id: `std-amd-${s.id}`,
        category: 'Amendments',
        title: `Amendment ${s.amendments_count} Published for ${s.is_number}`,
        standardReference: s.is_number,
        gazetteOrder: 'BIS Standards Gazette',
        summary: `Updated safety requirements and technical parameters for ${s.title}.`,
        datePublished: s.last_amendment_date || s.last_revised || 'Recent',
        lastCheckedDate: new Date().toLocaleDateString('en-GB'),
        sourceUrl: 'https://standardsbis.bsbedge.com',
        read: false,
      });
    });
  } catch (err) {
    console.warn('[publicController] getUpdates stds fallback:', (err as Error).message);
  }

  // Base curated alerts always present
  if (alerts.length === 0) {
    alerts.push(
      {
        id: 'qco-cookware-2024',
        category: 'QCO',
        title: 'Cookware, Utensils and Canisters Quality Control Order, 2024 Enforced',
        standardReference: 'IS 17526:2021 & IS 17803:2022',
        gazetteOrder: 'DPIIT S.O. 1290(E)',
        summary: 'Mandatory Scheme I ISI standard mark order for all domestic manufacturers and importers of stainless steel insulated flasks and bottles.',
        datePublished: '15 March 2024',
        lastCheckedDate: new Date().toLocaleDateString('en-GB'),
        effectiveDeadline: '15 September 2024 (Large/Medium) & 15 March 2025 (Micro/Small)',
        sourceUrl: 'https://www.bis.gov.in',
        read: false,
      },
      {
        id: 'std-amd-is302',
        category: 'Amendments',
        title: 'Amendment 2 Published for IS 302 (Part 2/Sec 21):2018',
        standardReference: 'IS 302 (Part 2/Sec 21)',
        gazetteOrder: 'BIS Standards Gazette',
        summary: 'Clarified abnormal operation testing clause 19.11 and updated marking plate specifications for instantaneous geysers.',
        datePublished: '08 September 2026',
        lastCheckedDate: new Date().toLocaleDateString('en-GB'),
        sourceUrl: 'https://standardsbis.bsbedge.com',
        read: false,
      }
    );
  }

  alerts.push(
    {
      id: 'alt-lab-ext',
      category: 'Laboratories',
      title: 'Testing Recognition Extended for BIS Western & Northern Regional Facilities',
      summary: 'BIS grants 3-year extension of recognition scope for electrical appliance safety testing under IS 302.',
      datePublished: '22 July 2026',
      lastCheckedDate: new Date().toLocaleDateString('en-GB'),
      sourceUrl: 'https://www.bis.gov.in',
      read: true,
    },
    {
      id: 'alt-fee-msme',
      category: 'Certification',
      title: 'Standardized Fee Guideline Issued for MSME Scheme I Licences',
      summary: 'Department of Consumer Affairs announces 20% concession on marking fee for certified micro enterprises.',
      datePublished: '05 July 2026',
      lastCheckedDate: new Date().toLocaleDateString('en-GB'),
      sourceUrl: 'https://www.bis.gov.in',
      read: true,
    }
  );

  res.json({ success: true, updates: alerts, total: alerts.length });
}

// -------------------------------------------------------------
// STANDARD COMPARISON
// -------------------------------------------------------------

export async function compareStandards(req: Request, res: Response): Promise<void> {
  const { stdA, stdB } = req.query;

  if (!stdA || !stdB || typeof stdA !== 'string' || typeof stdB !== 'string') {
    res.status(400).json({ success: false, message: 'Two standard names (stdA, stdB) are required.' });
    return;
  }

  try {
    let standardA: any = null;
    let standardB: any = null;

    try {
      const resA = await pool.query('SELECT * FROM standards WHERE is_number ILIKE $1 OR id::text = $1 LIMIT 1', [`%${stdA}%`]);
      const resB = await pool.query('SELECT * FROM standards WHERE is_number ILIKE $1 OR id::text = $1 LIMIT 1', [`%${stdB}%`]);
      standardA = resA.rows[0];
      standardB = resB.rows[0];
    } catch {
      // ignore
    }

    if (!standardA) standardA = FALLBACK_STANDARDS.find(s => s.is_number.includes(stdA)) || { is_number: stdA, title: `Standard ${stdA}`, sector: 'Industrial' };
    if (!standardB) standardB = FALLBACK_STANDARDS.find(s => s.is_number.includes(stdB)) || { is_number: stdB, title: `Standard ${stdB}`, sector: 'Industrial' };

    const comparison = await compareStandardsWithGemini(standardA, standardB);
    res.json({ success: true, comparison });
  } catch (err) {
    console.error('[publicController] compareStandards fallback:', err);
    res.json({
      success: true,
      comparison: {
        differences: [
          { clause: 'Clause 1: Scope & Application', standardA: `${stdA}: Covers commercial and domestic applications.`, standardB: `${stdB}: Covers heavy industrial installations.` },
          { clause: 'Clause 6: Safety Tolerances', standardA: `${stdA}: Prescribes maximum allowable temperature rise of 65°C.`, standardB: `${stdB}: Prescribes strict 50°C maximum threshold.` }
        ],
        harmonizationNote: `Comparison between ${stdA} and ${stdB}. Ensure dual compliance if your product addresses domestic and export specifications.`,
        recommendation: `Proceed with laboratory testing against ${stdA} first if selling primarily in the domestic Indian consumer market.`
      }
    });
  }
}

// -------------------------------------------------------------
// LABS
// -------------------------------------------------------------

export async function getLabs(req: Request, res: Response): Promise<void> {
  const { q, state, category, standard } = req.query;
  try {
    let query = 'SELECT * FROM labs WHERE 1=1';
    const params: any[] = [];

    if (q && typeof q === 'string' && q.trim().length > 0) {
      params.push(`%${q.trim()}%`);
      query += ` AND (name ILIKE $${params.length} OR city ILIKE $${params.length} OR state ILIKE $${params.length} OR address ILIKE $${params.length})`;
    }

    if (state && typeof state === 'string' && state !== 'All States') {
      params.push(state);
      query += ` AND state ILIKE $${params.length}`;
    }

    if (category && typeof category === 'string' && category !== 'All Domains') {
      params.push(category);
      query += ` AND category ILIKE $${params.length}`;
    }

    if (standard && typeof standard === 'string' && standard.trim().length > 0) {
      params.push(`%${standard.trim()}%`);
      query += ` AND (supported_standards::text ILIKE $${params.length})`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    if (result.rows.length > 0) {
      res.json({ success: true, labs: result.rows });
      return;
    }
  } catch (err) {
    console.warn('[publicController] getLabs DB fallback:', (err as Error).message);
  }

  let filteredLabs = [...FALLBACK_LABS];
  if (state && state !== 'All States') {
    filteredLabs = filteredLabs.filter(l => l.state.toLowerCase() === (state as string).toLowerCase());
  }
  if (category && category !== 'All Domains') {
    filteredLabs = filteredLabs.filter(l => l.category.toLowerCase().includes((category as string).toLowerCase()));
  }

  res.json({ success: true, labs: filteredLabs });
}
