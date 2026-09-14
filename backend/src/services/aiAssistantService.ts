import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index.js';
import { retrieveOfficialSources, type RetrievedSource } from './sourceRetrievalService.js';

let genAIClient: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
  if (!genAIClient) {
    const key = config.geminiApiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('Gemini API key is missing. Please verify GEMINI_API_KEY in backend/.env.');
    }
    genAIClient = new GoogleGenAI({ apiKey: key });
  }
  return genAIClient;
}

export interface ChatAssistantAction {
  label: string;
  href: string;
  icon: 'standard' | 'certification' | 'lab';
}

export interface ChatAssistantSource {
  title: string;
  url: string;
  domain: string;
  documentNumber?: string;
  clause?: string;
  excerpt?: string;
  verifiedDate?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ChatAssistantResponse {
  answer: string;
  mode: 'bis_grounded' | 'general' | 'clarification';
  intent: string;
  confidence: 'high' | 'medium' | 'low';
  evidence?: {
    sourceTitle: string;
    documentNumber?: string;
    clause?: string;
    excerpt?: string;
    verifiedDate?: string;
    confidence: 'high' | 'medium' | 'low';
  };
  sources: ChatAssistantSource[];
  actions: ChatAssistantAction[];
  followUpQuestions: string[];
  disclaimer?: string;
}

// Determines whether the query is a generic question or needs BIS grounding
export function analyzeIntent(query: string): {
  isBis: boolean;
  needsClarification: boolean;
  intent: string;
} {
  const q = query.trim().toLowerCase();

  // Check for explicit Indian Standard pattern (e.g. "IS 456", "IS 2062", "IS:1180", "IS-1786")
  const hasExplicitIsCode = /\bIS\s*[:/-]?\s*\d+/i.test(q);
  if (hasExplicitIsCode) {
    return { isBis: true, needsClarification: false, intent: 'BIS_STANDARD' };
  }

  // General non-BIS questions
  const genericPatterns = [
    /\b(cloud computing|operating system|linux|programming|python|javascript|typescript|c\+\+|react|html|css)\b/i,
    /\b(write an email|summarize|essay|poem|recipe|translate|grammar|joke|story)\b/i,
    /\b(what is the capital|who was|math problem|calculate)\b/i,
  ];

  const hasGeneric = genericPatterns.some((pattern) => pattern.test(q));
  const bisKeywords = [
    'bis', 'standard', 'standards', 'is ', 'indian standard', 'qco', 'quality control order',
    'isi', 'crs', 'fmcs', 'hallmark', 'huid', 'nabl', 'lims', 'lab', 'laboratory',
    'certification', 'licence', 'license', 'cml', 'conformity', 'vacuum flask',
    'water heater', 'geyser', 'lithium', 'battery', 'plug', 'socket', 'steel bottle',
    'bottle', 'mandatory certification', 'cake', 'bakery', 'bread', 'biscuit', 'maida',
    'flour', 'food', 'confectionery', 'fssai', 'water', 'packaging', 'toy', 'toys',
    'footwear', 'shoe', 'steel', 'tmt', 'cement', 'solar', 'cosmetic', 'concrete',
    'transformer', 'cable', 'wire', 'motor', 'plywood', 'tile', 'tiles', 'pipe',
    'pipes', 'fire extinguisher', 'cylinder', 'lpg', 'pressure vessel', 'pump',
    'structural steel', 'helmet', 'tyre', 'tyres', 'mask', 'textiles', 'audit',
    'specification', 'compliance', 'regulations'
  ];

  const hasBis = bisKeywords.some((kw) => q.includes(kw));

  // If clearly generic without any BIS terms or standards queries, it's GENERAL
  if (hasGeneric && !hasBis) {
    return { isBis: false, needsClarification: false, intent: 'GENERAL_KNOWLEDGE' };
  }

  // Ambiguous questions that lack any product/material context
  const ambiguousPatterns = [
    /^is bis mandatory for my (product|item|device|machine)\??$/i,
    /^i need bis certification\??$/i,
    /^how do i get bis\??$/i,
    /^does my product need bis\??$/i,
    /^is certification compulsory for my product\??$/i,
  ];

  if (ambiguousPatterns.some((pat) => pat.test(q))) {
    return { isBis: true, needsClarification: true, intent: 'BIS_CLARIFICATION_REQUIRED' };
  }

  if (hasBis) {
    if (q.includes('qco') || q.includes('mandatory')) return { isBis: true, needsClarification: false, intent: 'BIS_QCO_MANDATE' };
    if (q.includes('lab') || q.includes('test') || q.includes('lims')) return { isBis: true, needsClarification: false, intent: 'BIS_LABORATORY' };
    if (q.includes('scheme') || q.includes('apply') || q.includes('certification') || q.includes('licence') || q.includes('license')) return { isBis: true, needsClarification: false, intent: 'BIS_CERTIFICATION_SCHEME' };
    if (q.includes('huid') || q.includes('hallmark') || q.includes('gold')) return { isBis: true, needsClarification: false, intent: 'BIS_HALLMARKING' };
    return { isBis: true, needsClarification: false, intent: 'BIS_STANDARD' };
  }

  // Default to general if no BIS terminology matches
  return { isBis: false, needsClarification: false, intent: 'GENERAL_KNOWLEDGE' };
}

const BIS_SYSTEM_INSTRUCTION = `You are MANAK SAARTHI AI — the premier, authoritative Indian Standards & Regulatory Intelligence Assistant for the Bureau of Indian Standards (BIS) and Government of India technical regulations.

COMPREHENSIVE AUTHORITY ACROSS ALL 22,000+ INDIAN STANDARDS:
This platform serves as the intelligent national gateway for ALL Indian Standards published across all 15 Division Councils:
1. Civil Engineering Division (CED): Concrete (IS 456), Cement (IS 269, IS 1489), TMT Steel (IS 1786), Plywood (IS 710, IS 303), Ceramic Tiles (IS 15622), HDPE/PVC Pipes (IS 4984, IS 12818), Safety Glass (IS 2553), National Building Code (NBC 2016).
2. Electrotechnical Division (ETD): Transformers (IS 1180), Motors (IS 12615), Cables & Wires (IS 694, IS 1554), Plugs & Sockets (IS 1293), Ceiling Fans (IS 374), Household Electrical Appliances (IS 302 series).
3. Electronics & Information Technology Division (LITD): Lithium Batteries (IS 16046), IT Safety (IS 13252), Audio/Video (IS 616), LED Lighting (IS 15885, IS 16102), Smart Meters (IS 16444), Solar PV Modules (IS 14286, IS/IEC 61730).
4. Food and Agriculture Division (FAD): Bakery (IS 1011, IS 1483, IS 1009), Packaged Water (IS 14543, IS 13428), Drinking Water (IS 10500), Dairy, Packaging Inks (IS 15495), Food-grade Plastics (IS 9845, IS 10146), FSSAI regulations.
5. Mechanical Engineering Division (MED): Fire Extinguishers (IS 15683), LPG Gas Cylinders (IS 3196), Pressure Vessels (IS 2825), Monobloc & Submersible Pumps (IS 9079, IS 14220).
6. Metallurgical Engineering Division (MTD): Structural Steel (IS 2062), Stainless Steel Plate/Sheet (IS 6911), Non-Ferrous Alloys.
7. Petroleum, Coal and Related Products Division (PCD): Automotive Tyres (IS 15627, IS 15633), Bitumen (IS 73), Cosmetics (IS 4707, IS 6608).
8. Chemical Division (CHAD): Paints & Varnishes (IS 15489), Fertilizers, Detergents (IS 4955), Industrial Chemicals.
9. Textiles Division (TXD): Medical Face Masks (IS 16289), Geotextiles (IS 16391), Protective Clothing, Cotton, Silk.
10. Transport Engineering Division (TED): Two-Wheeler Helmets (IS 4151), Automotive Safety Components.
11. Medical Equipment & Hospital Planning (MHD): Surgical Instruments, Medical Devices, Clinical Equipment.
12. Management & Systems Division (MSD): Quality Management (ISO 9001/IS ISO 9001), Environmental Management, Food Safety (ISO 22000).

CORE OPERATING INSTRUCTIONS:
1. FOR ANY BIS, REGULATORY, INDUSTRIAL, OR PRODUCT INQUIRY:
- Never say "I only know a few products" or "data not found in database". You have comprehensive technical intelligence across the entire BIS repository.
- Accurately provide:
  a) The EXACT Indian Standard (IS Code), revision year, and full title (e.g. IS 456:2000 for Concrete, IS 1180:2014 for Transformers, IS 2062:2011 for Structural Steel, IS 15683:2018 for Fire Extinguishers, IS 1011 for Biscuits, IS 4151 for Helmets).
  b) The responsible BIS Division Council & Sectional Committee (e.g. CED, ETD, LITD, FAD, MED, MTD, TED).
  c) Regulatory Mandate:
     * Explicitly specify whether the standard is notified under a mandatory Quality Control Order (QCO) issued by the Central Government (DPIIT, Ministry of Steel, MeitY, MoCA, Ministry of Power, etc.) where manufacture, stock, or sale without the Standard Mark (ISI / CRS) is a statutory offence under Section 16 & 29 of the BIS Act, 2016.
     * Or whether it is voluntary / benchmark quality certification under Scheme-I.
     * Allied Regulatory Bodies: Clearly mention related statutory authorities (e.g. FSSAI for food businesses, PESO for gas cylinders, CDSCO for medical devices, MoRTH for vehicular safety).
  d) Essential Quality, Safety & Testing Parameters: Detail the specific physical, chemical, electrical, or microbiological tests required.
  e) Statutory Licensing Roadmap: Clear step-by-step guidance on applying via manakonline.in / services.bis.gov.in, sample testing at BIS/NABL accredited test laboratories, and factory inspection audits.
- Always include direct official government URLs (e.g., https://standards.bis.gov.in/, https://www.bis.gov.in/know-your-standard/, https://www.manakonline.in/).

2. FOR GENERAL (NON-BIS) INQUIRIES:
- Behave as a helpful, articulate, and accurate general-purpose AI assistant.
- Answer clearly, helpfully, and concisely without forcing BIS citations or unnecessary disclaimers.

3. OUTPUT FORMAT:
You MUST respond with valid JSON matching this exact structure:
{
  "answer": "Detailed, professional answer text in markdown format with clear headings, bullet points, and tables if applicable.",
  "mode": "bis_grounded" | "general" | "clarification",
  "intent": "BIS_STANDARD" | "BIS_QCO_MANDATE" | "BIS_CERTIFICATION_SCHEME" | "GENERAL",
  "confidence": "high" | "medium" | "low",
  "evidence": {
    "sourceTitle": "Official Source Name (e.g. BIS CED 2 / Civil Engineering Division)",
    "documentNumber": "e.g. IS 456:2000 / IS 1180:2014",
    "clause": "e.g. Clause 4 (Materials & Strength) & Mandatory QCO Status",
    "excerpt": "Precise factual clause statement.",
    "verifiedDate": "DD/MM/YYYY",
    "confidence": "high" | "medium" | "low"
  },
  "sources": [
    {
      "title": "...",
      "url": "https://standards.bis.gov.in/ or official portal",
      "domain": "standards.bis.gov.in",
      "documentNumber": "...",
      "clause": "...",
      "excerpt": "...",
      "confidence": "high" | "medium" | "low"
    }
  ],
  "actions": [
    { "label": "Action label", "href": "/find-standard or /certification or /labs", "icon": "standard" | "certification" | "lab" }
  ],
  "followUpQuestions": ["Suggested query 1", "Suggested query 2"],
  "disclaimer": "Advisory text if high-stakes BIS compliance decision."
}

Do not include any text before or after the JSON block.`;

export async function generateAssistantReply(
  userQuery: string,
  chatHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<ChatAssistantResponse> {
  const { isBis, needsClarification, intent } = analyzeIntent(userQuery);

  let retrievedSources: RetrievedSource[] = [];
  if (isBis && !needsClarification) {
    retrievedSources = await retrieveOfficialSources(userQuery);
  }

  // Construct context block
  let evidenceContext = '';
  if (isBis) {
    if (retrievedSources.length > 0) {
      evidenceContext = `\n\nOFFICIAL BIS & GOVERNMENT EVIDENCE RETRIEVED FROM VERIFIED REPOSITORIES:\n` +
        retrievedSources.map((s, idx) => `
[Source #${idx + 1}]
Title: ${s.title}
Document / Order: ${s.documentNumber ?? 'N/A'}
Official URL: ${s.url}
Domain: ${s.domain}
Clause / Order Section: ${s.clause ?? 'N/A'}
Verified Content: ${s.content}
Official Excerpt: ${s.excerpt ?? 'N/A'}
Verified Date: ${s.verifiedDate ?? 'N/A'}
`).join('\n');
    } else {
      evidenceContext = `\n\nOFFICIAL BIS PORTAL CONTEXT:
Refer to official Indian Standards (IS) catalog under the Bureau of Indian Standards (BIS Act, 2016), 15 Division Councils (e.g. FADC, ETD, CED, PCD), and allied regulatory frameworks (FSSAI, DPIIT, MeitY) to provide the exact applicable Indian Standards and compliance requirements.`;
    }
  }

  // Context strategy: keep recent 6 messages
  const recentHistory = chatHistory.slice(-6).map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const ai = getGenAIClient();
  const systemPrompt = BIS_SYSTEM_INSTRUCTION + evidenceContext;

  const conversationContext = recentHistory.length > 0
    ? '\n\nRECENT CONVERSATION HISTORY:\n' + recentHistory.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')
    : '';

  const fullPrompt = `${systemPrompt}${conversationContext}

CURRENT USER QUERY:
${userQuery}

Respond strictly with a valid JSON object matching the defined schema.`;

  let rawContent = '{}';
  let geminiFailed = false;
  let geminiErrorMsg = '';

  const candidateModels = [
    'gemini-3.5-flash-lite',
    config.geminiModel,
    'gemini-2.0-flash-lite',
  ].filter(Boolean);

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: fullPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
      if (response.text) {
        rawContent = response.text;
        geminiFailed = false;
        break;
      }
    } catch (err: unknown) {
      geminiFailed = true;
      geminiErrorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[aiAssistantService] Gemini attempt with '${modelName}' failed:`, geminiErrorMsg);
    }
  }

  // Fallback if Gemini failed
  if (geminiFailed) {
    if (retrievedSources.length > 0) {
      const top = retrievedSources[0];
      const answerParts = [
        `**Official BIS Guidance Summary for your inquiry:**\n`,
        top.content,
        `\n\n**Applicable Document:** ${top.documentNumber ?? top.title}`,
        top.clause ? `\n**Key Requirement (${top.clause}):** ${top.excerpt ?? ''}` : '',
      ];

      return {
        answer: answerParts.filter(Boolean).join(''),
        mode: 'bis_grounded',
        intent,
        confidence: top.confidence,
        evidence: {
          sourceTitle: top.title,
          documentNumber: top.documentNumber,
          clause: top.clause,
          excerpt: top.excerpt,
          verifiedDate: top.verifiedDate,
          confidence: top.confidence,
        },
        sources: retrievedSources.map((s) => ({
          title: s.title,
          url: s.url,
          domain: s.domain,
          documentNumber: s.documentNumber,
          clause: s.clause,
          excerpt: s.excerpt,
          verifiedDate: s.verifiedDate,
          confidence: s.confidence,
        })),
        actions: [
          { label: 'Find Standard in Explorer', href: '/find-standard', icon: 'standard' },
          { label: 'Certification Schemes Navigator', href: '/certification', icon: 'certification' },
          { label: 'Locate Recognized Lab', href: '/labs', icon: 'lab' },
        ],
        followUpQuestions: [
          'What testing is required for this standard?',
          'Which BIS certification scheme applies?',
          'Where can I find accredited testing laboratories?',
        ],
        disclaimer: 'Guidance based on retrieved official BIS information. Final certification and statutory determinations remain with the Bureau of Indian Standards.',
      };
    }

    if (needsClarification) {
      return {
        answer: 'To provide the accurate Indian Standard and mandatory Quality Control Order (QCO) status, please specify:\n\n1. **Exact Product & Material** (e.g., Stainless Steel Vacuum Insulated Bottle IS 17526, Single-Walled Bottle IS 17803, or plastic/glass)\n2. **Intended Application** (Domestic/Consumer use vs Industrial)\n3. **Manufacturing Origin** (Manufactured in India or Imported under FMCS)',
        mode: 'clarification',
        intent: 'BIS_CLARIFICATION_REQUIRED',
        confidence: 'medium',
        sources: [],
        actions: [
          { label: 'Find Standard in Explorer', href: '/find-standard', icon: 'standard' },
          { label: 'Certification Schemes Navigator', href: '/certification', icon: 'certification' },
        ],
        followUpQuestions: [
          'Stainless steel insulated bottle (IS 17526)',
          'Single walled stainless steel water bottle (IS 17803)',
          'Electric household water heater (IS 302)',
        ],
      };
    }

    // General query with Gemini error fallback
    return {
      answer: `Unable to connect to Google Gemini API:\n\n> **"${geminiErrorMsg}"**\n\nPlease check your \`GEMINI_API_KEY\` in \`backend/.env\`.\n\n### Official BIS Guidance is fully active:\nAll **BIS standards, QCOs, certification schemes, and testing lab queries** are operational through our verified database! Try asking:\n- *"What is IS 17526?"*\n- *"Does electric water heater require mandatory BIS certification?"*\n- *"What is HUID?"*`,
      mode: 'general',
      intent,
      confidence: 'low',
      sources: [],
      actions: [],
      followUpQuestions: [
        'What is IS 17526?',
        'Does electric water heater require mandatory BIS certification?',
        'What is HUID in gold jewellery hallmarking?',
      ],
    };
  }

  try {
    const parsed = JSON.parse(rawContent) as Partial<ChatAssistantResponse>;

    const defaultActions: ChatAssistantAction[] = isBis ? [
      { label: 'Find Standard in Explorer', href: '/find-standard', icon: 'standard' },
      { label: 'Certification Schemes Navigator', href: '/certification', icon: 'certification' },
      { label: 'Locate Recognized Lab', href: '/labs', icon: 'lab' },
    ] : [];

    const finalSources: ChatAssistantSource[] = (parsed.sources && parsed.sources.length > 0)
      ? (parsed.sources as ChatAssistantSource[])
      : retrievedSources.map((s) => ({
          title: s.title,
          url: s.url,
          domain: s.domain,
          documentNumber: s.documentNumber,
          clause: s.clause,
          excerpt: s.excerpt,
          verifiedDate: s.verifiedDate,
          confidence: s.confidence,
        }));

    const finalEvidence = parsed.evidence?.sourceTitle
      ? parsed.evidence
      : retrievedSources[0]
      ? {
          sourceTitle: retrievedSources[0].title,
          documentNumber: retrievedSources[0].documentNumber,
          clause: retrievedSources[0].clause,
          excerpt: retrievedSources[0].excerpt,
          verifiedDate: retrievedSources[0].verifiedDate,
          confidence: retrievedSources[0].confidence,
        }
      : undefined;

    return {
      answer: parsed.answer ?? 'I have processed your query based on available records.',
      mode: parsed.mode ?? (isBis ? (needsClarification ? 'clarification' : 'bis_grounded') : 'general'),
      intent: parsed.intent ?? intent,
      confidence: parsed.confidence ?? (retrievedSources.length > 0 ? 'high' : 'medium'),
      evidence: finalEvidence,
      sources: finalSources,
      actions: parsed.actions && parsed.actions.length > 0 ? parsed.actions : defaultActions,
      followUpQuestions: parsed.followUpQuestions ?? [],
      disclaimer: isBis
        ? (parsed.disclaimer ?? 'Guidance based on retrieved official BIS information. Final certification and statutory determinations remain with the Bureau of Indian Standards.')
        : undefined,
    };
  } catch (parseError) {
    console.error('[aiAssistantService] Failed to parse structured JSON from OpenAI:', parseError, rawContent);
    return {
      answer: rawContent,
      mode: isBis ? 'bis_grounded' : 'general',
      intent,
      confidence: 'low',
      sources: [],
      actions: [],
      followUpQuestions: [],
    };
  }
}
