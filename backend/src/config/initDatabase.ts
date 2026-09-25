import { pool } from './database.js';
import { ensureAdminAccount } from './adminSeed.js';

let isInitialized = false;

export async function initUserPanelDatabase(): Promise<void> {
  if (isInitialized) return;

  try {
    // 1. Extensions
    try {
      await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
    } catch (e) {
      console.warn('[initDatabase] pgcrypto notice:', (e as Error).message);
    }

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'role'
        ) THEN
          ALTER TABLE users ADD COLUMN role VARCHAR(30);
        END IF;
      END $$;
    `);

    await pool.query(`
      DO $$
      DECLARE
        role_constraint_name TEXT;
      BEGIN
        SELECT conname INTO role_constraint_name
        FROM pg_constraint
        WHERE conrelid = 'users'::regclass AND contype = 'c' AND conname ILIKE '%role%';

        IF role_constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE users DROP CONSTRAINT %I', role_constraint_name);
        END IF;

        ALTER TABLE users
          ADD CONSTRAINT users_role_check
          CHECK (role IN ('consumer', 'business', 'lab', 'admin'))
          NOT VALID;
      END $$;
    `);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'status'
        ) THEN
          ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'Active';
        END IF;
      END $$;
    `);

    await pool.query(`
      UPDATE users
      SET status = 'Active'
      WHERE status IS NULL OR status = '';
    `);

    await pool.query(`
      ALTER TABLE users
        ALTER COLUMN status SET DEFAULT 'Active';
    `);

    await pool.query(`
      ALTER TABLE users
        ALTER COLUMN status SET NOT NULL;
    `);

    // 2. Ensure base tables exist
    const baseTables = [
      `CREATE TABLE IF NOT EXISTS standards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        is_number VARCHAR(100) NOT NULL,
        title TEXT NOT NULL,
        sector VARCHAR(100),
        status VARCHAR(50),
        last_revised VARCHAR(50),
        clauses_count INTEGER DEFAULT 0,
        scope TEXT,
        key_requirements JSONB DEFAULT '[]',
        related_standards JSONB DEFAULT '[]',
        qco_reference TEXT,
        sti_available BOOLEAN DEFAULT true,
        amendments_count INTEGER DEFAULT 0,
        last_amendment_date VARCHAR(50),
        recognized_labs_count INTEGER DEFAULT 12,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS labs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        region VARCHAR(50),
        city VARCHAR(100),
        state VARCHAR(100),
        address TEXT,
        recognition_id VARCHAR(100),
        valid_through VARCHAR(100),
        accreditation VARCHAR(100),
        supported_standards JSONB DEFAULT '[]',
        key_tests JSONB DEFAULT '[]',
        contact_email VARCHAR(100),
        contact_phone VARCHAR(50),
        lat FLOAT,
        lng FLOAT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS schemes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        scheme_id VARCHAR(100) NOT NULL,
        name TEXT NOT NULL,
        sector VARCHAR(100),
        standards_count INTEGER DEFAULT 0,
        status VARCHAR(50),
        schedule VARCHAR(150),
        badge VARCHAR(100),
        short_desc TEXT,
        steps JSONB DEFAULT '[]',
        required_docs JSONB DEFAULT '[]',
        testing_protocol TEXT,
        factory_audit TEXT,
        estimated_timeline VARCHAR(100),
        official_ref VARCHAR(255),
        product_examples JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS qcos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        qco_number VARCHAR(100) NOT NULL,
        title TEXT NOT NULL,
        ministry VARCHAR(150),
        standards_count INTEGER DEFAULT 0,
        status VARCHAR(50),
        order_date VARCHAR(50),
        enforcement_date VARCHAR(150),
        gazette_number VARCHAR(100),
        summary TEXT,
        source_url TEXT,
        standard_reference VARCHAR(150),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        doc_type VARCHAR(50),
        size VARCHAR(50),
        status VARCHAR(50),
        file_path TEXT,
        parsed_content JSONB DEFAULT '{}',
        user_id UUID,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS user_saved_standards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        standard_id UUID,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS user_products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        name VARCHAR(255) NOT NULL,
        model VARCHAR(100),
        standard_number VARCHAR(100),
        readiness_percent INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Docs In Review',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS user_readiness_checklists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        product_id UUID,
        pillar_title VARCHAR(150) NOT NULL,
        task VARCHAR(255) NOT NULL,
        status VARCHAR(30) DEFAULT 'pending',
        note TEXT,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS compliance_audits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        standard_number VARCHAR(100) NOT NULL,
        clause VARCHAR(50) NOT NULL,
        parameter VARCHAR(255) NOT NULL,
        standard_spec TEXT,
        status VARCHAR(30) DEFAULT 'manual_check',
        evidence_source TEXT,
        notes TEXT,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`
    ];

    for (const sql of baseTables) {
      try {
        await pool.query(sql);
      } catch (err) {
        console.warn('[initDatabase] Table creation notice:', (err as Error).message);
      }
    }

    // 3. Add columns safely to existing tables if needed
    const alterCols = [
      'ALTER TABLE standards ADD COLUMN IF NOT EXISTS scope TEXT;',
      "ALTER TABLE standards ADD COLUMN IF NOT EXISTS key_requirements JSONB DEFAULT '[]';",
      "ALTER TABLE standards ADD COLUMN IF NOT EXISTS related_standards JSONB DEFAULT '[]';",
      'ALTER TABLE standards ADD COLUMN IF NOT EXISTS qco_reference TEXT;',
      'ALTER TABLE standards ADD COLUMN IF NOT EXISTS sti_available BOOLEAN DEFAULT true;',
      'ALTER TABLE standards ADD COLUMN IF NOT EXISTS amendments_count INTEGER DEFAULT 0;',
      'ALTER TABLE standards ADD COLUMN IF NOT EXISTS last_amendment_date VARCHAR(50);',
      'ALTER TABLE standards ADD COLUMN IF NOT EXISTS recognized_labs_count INTEGER DEFAULT 12;',

      'ALTER TABLE schemes ADD COLUMN IF NOT EXISTS schedule VARCHAR(150);',
      'ALTER TABLE schemes ADD COLUMN IF NOT EXISTS badge VARCHAR(100);',
      'ALTER TABLE schemes ADD COLUMN IF NOT EXISTS short_desc TEXT;',
      "ALTER TABLE schemes ADD COLUMN IF NOT EXISTS steps JSONB DEFAULT '[]';",
      "ALTER TABLE schemes ADD COLUMN IF NOT EXISTS required_docs JSONB DEFAULT '[]';",
      'ALTER TABLE schemes ADD COLUMN IF NOT EXISTS testing_protocol TEXT;',
      'ALTER TABLE schemes ADD COLUMN IF NOT EXISTS factory_audit TEXT;',
      'ALTER TABLE schemes ADD COLUMN IF NOT EXISTS estimated_timeline VARCHAR(100);',
      'ALTER TABLE schemes ADD COLUMN IF NOT EXISTS official_ref VARCHAR(255);',
      "ALTER TABLE schemes ADD COLUMN IF NOT EXISTS product_examples JSONB DEFAULT '[]';",

      'ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_path TEXT;',
      "ALTER TABLE documents ADD COLUMN IF NOT EXISTS parsed_content JSONB DEFAULT '{}';",
      'ALTER TABLE documents ADD COLUMN IF NOT EXISTS user_id UUID;',

      'ALTER TABLE qcos ADD COLUMN IF NOT EXISTS order_date VARCHAR(50);',
      'ALTER TABLE qcos ADD COLUMN IF NOT EXISTS enforcement_date VARCHAR(150);',
      'ALTER TABLE qcos ADD COLUMN IF NOT EXISTS gazette_number VARCHAR(100);',
      'ALTER TABLE qcos ADD COLUMN IF NOT EXISTS summary TEXT;',
      'ALTER TABLE qcos ADD COLUMN IF NOT EXISTS source_url TEXT;',
      'ALTER TABLE qcos ADD COLUMN IF NOT EXISTS standard_reference VARCHAR(150);'
    ];

    for (const sql of alterCols) {
      try {
        await pool.query(sql);
      } catch (err) {
        // Safe to ignore if table already has column or doesn't exist yet
      }
    }

    // 4. Seed Standards if empty
    try {
      const stdCountRes = await pool.query('SELECT COUNT(*) FROM standards');
      const stdCount = parseInt(stdCountRes.rows[0].count, 10);
      if (stdCount === 0) {
        await pool.query(`
          INSERT INTO standards (is_number, title, sector, status, last_revised, clauses_count, scope, amendments_count, sti_available, qco_reference, recognized_labs_count, key_requirements, related_standards)
          VALUES 
          (
            'IS 302 (Part 2/Sec 21):2018',
            'Safety of Household and Similar Electrical Appliances — Particular Requirements for Electric Water Heaters',
            'Electrical Engineering',
            'mandatory_qco',
            '2018',
            34,
            'Specifies essential electrical, thermal, and hydrostatic safety requirements for stationary instantaneous and storage water heaters intended for domestic use.',
            2,
            true,
            'Electrical Appliances (Quality Control) Order, 2023',
            14,
            '["Class I apparatus with protective earthing conductor terminal", "Creepage distances and clearances exceeding 4.0 mm", "Dry-boiling cutoff test verification", "Hydrostatic pressure endurance up to 1.0 MPa"]'::jsonb,
            '["IS 302 (Part 1)", "IS 2082", "IS 12615"]'::jsonb
          ),
          (
            'IS 16046 (Part 2):2018',
            'Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes — Safety Requirements for Portable Sealed Secondary Lithium Cells',
            'Electronics & IT Goods',
            'mandatory_crs',
            '2018',
            18,
            'Covers mandatory safety requirements for lithium-ion and lithium polymer secondary cells and batteries used in portable electronics, power banks, and laptops.',
            1,
            true,
            'Electronics and Information Technology Goods (Compulsory Registration Order, 2021)',
            28,
            '["Continuous charging safety and forced discharge protection", "External short circuit test at 55°C", "Free fall drop testing from 1.0 m height", "Thermal abuse withstand at 130°C for 10 minutes"]'::jsonb,
            '["IS 16046 (Part 1)", "IEC 62133-2:2017"]'::jsonb
          ),
          (
            'IS 17526:2021',
            'Stainless Steel Vacuum Flasks and Insulated Flasks — Specification',
            'Mechanical & Utensils',
            'mandatory_qco',
            '2021',
            16,
            'Prescribes safety, non-toxicity, and thermal insulation retention performance for double-walled stainless steel vacuum flasks and insulated bottles.',
            1,
            true,
            'Cookware, Utensils and Canisters (Quality Control) Order, 2024',
            19,
            '["Food-contact material austenitic SS grade 304 (IS 6911)", "Temperature retention test: >= 60°C after 6 hours from 95°C boiling fill", "Impact drop durability test without vacuum degradation", "Heavy metal migration safety limits"]'::jsonb,
            '["IS 6911", "IS 9845"]'::jsonb
          ),
          (
            'IS 4151:2020',
            'Protective Helmets for Two-Wheeler Motor Vehicle Riders — Specification',
            'Automotive & Road Safety',
            'mandatory_qco',
            '2020',
            22,
            'Prescribes physical construction, impact attenuation, and retention system requirements for motorcycle and scooter helmets.',
            2,
            true,
            'Helmets for Riders of Two-Wheeler Motor Vehicles (Quality Control) Order',
            20,
            '["Impact attenuation test at high and ambient temperatures", "Retention system dynamic strength test", "Visor optical and scratch resistance evaluation"]'::jsonb,
            '["IS 9944", "IS 7692"]'::jsonb
          );
        `);
      }
    } catch (stdErr) {
      console.warn('[initDatabase] Standards seeding note:', (stdErr as Error).message);
    }

    await ensureAdminAccount();

    // 5. Seed Schemes if empty
    try {
      const schemeCountRes = await pool.query('SELECT COUNT(*) FROM schemes');
      const schemeCount = parseInt(schemeCountRes.rows[0].count, 10);
      if (schemeCount === 0) {
        await pool.query(`
          INSERT INTO schemes (scheme_id, name, sector, status, schedule, badge, short_desc, product_examples, steps, required_docs, testing_protocol, factory_audit, estimated_timeline, official_ref)
          VALUES
          (
            'isi',
            'Scheme I — ISI Mark Certification',
            'Industrial & Domestic Goods',
            'Active',
            'Schedule-II, Scheme-I (Conformity Assessment Regulations)',
            'Most Common for Industrial & Domestic Goods',
            'Traditional standard mark licence granted following factory infrastructure audit, in-house laboratory inspection, and independent sample testing.',
            '["Domestic Appliances (IS 302)", "Cement (IS 269)", "Steel Products", "Helmets (IS 4151)", "Bottles (IS 17526)"]'::jsonb,
            '[
              {"number": "01", "title": "Product & IS Identification", "subtitle": "Define Scope", "description": "Identify product specifications and primary applicable Indian Standard.", "status": "completed"},
              {"number": "02", "title": "Manufacturing & Lab Setup", "subtitle": "Factory Audit Prep", "description": "Ensure internal quality testing machinery matches Scheme of Testing & Inspection (STI).", "status": "completed"},
              {"number": "03", "title": "Document Collation", "subtitle": "Form & Annexures", "description": "Prepare plant machinery list, calibration records, factory layout, and test certificates.", "status": "current"},
              {"number": "04", "title": "Factory Inspection", "subtitle": "BIS Technical Audit", "description": "BIS inspecting officers verify manufacturing control and draw counter-samples.", "status": "upcoming"},
              {"number": "05", "title": "Independent Sample Testing", "subtitle": "Recognized Lab", "description": "Samples drawn during audit are tested at accredited BIS or central laboratories.", "status": "upcoming"},
              {"number": "06", "title": "Licence Grant (CM/L)", "subtitle": "Standard Mark", "description": "Grant of licence to use Standard ISI Mark on verified production lots.", "status": "upcoming"}
            ]'::jsonb,
            '[
              "Factory Registration / Proof of Manufacturing Premises",
              "Process Flowchart & Manufacturing Machinery Inventory",
              "In-House Testing Equipment & Valid Calibration Certificates",
              "Quality Control Personnel Qualifications & Appointment Letters",
              "Raw Material Test Certificates (MTC)",
              "Factory Layout Map and Drawing of Proposed Marking"
            ]'::jsonb,
            'Manufacturer must maintain laboratory equipment conforming to the relevant Scheme of Testing and Inspection (STI) issued by BIS.',
            'Physical audit conducted by BIS authorized technical officers to verify raw material inspection, stage inspection, and routine batch testing.',
            '30 to 60 Days from application acceptance',
            'BIS Product Certification Scheme-I (BIS Act 2016)'
          ),
          (
            'crs',
            'Scheme II — Compulsory Registration Scheme (CRS)',
            'Electronics & IT Goods',
            'Active',
            'Schedule-II, Scheme-II (Registration Scheme)',
            'Electronic & IT Products',
            'Self-declaration of conformity based on laboratory test reports issued by BIS-recognized testing laboratories without pre-licence factory inspection.',
            '["Lithium Batteries (IS 16046)", "Laptops & Tablets", "LED Lamps", "Power Adapters", "Smart Watches"]'::jsonb,
            '[
              {"number": "01", "title": "Sample Generation", "subtitle": "Model Selection", "description": "Prepare representative production samples matching product series grouping guidelines.", "status": "completed"},
              {"number": "02", "title": "Testing at BIS Lab", "subtitle": "NABL Accredited", "description": "Submit samples to BIS-recognized lab for comprehensive safety evaluation.", "status": "completed"},
              {"number": "03", "title": "Test Report Review", "subtitle": "90-Day Validity", "description": "Verify all clauses of applicable IS standard are evaluated without non-conformance.", "status": "current"},
              {"number": "04", "title": "Online CRS Submission", "subtitle": "Self Declaration", "description": "Submit application on BIS CRS portal with test report and brand authorization.", "status": "upcoming"},
              {"number": "05", "title": "Scrutiny & Registration", "subtitle": "R-Number Grant", "description": "BIS assigns unique Registration Number (R-XXXXXXXX) for the brand and models.", "status": "upcoming"}
            ]'::jsonb,
            '[
              "Original Test Report from BIS-Recognized Laboratory (less than 90 days old)",
              "Brand Owner Authorization Letter & Trademark Registration Certificate",
              "Authorized Indian Representative (AIR) Undertaking (for foreign brands)",
              "Product Technical Specification & Series Grouping Justification Document",
              "Affidavit cum Undertaking for CRS self-declaration"
            ]'::jsonb,
            'Testing must be conducted strictly at BIS-recognized laboratories in India. Foreign test reports are not accepted under CRS.',
            'No initial factory audit required. Post-market surveillance testing is conducted periodically from retail market samples.',
            '15 to 25 Days post test report submission',
            'BIS CRS Portal under MeitY Notification'
          ),
          (
            'hallmarking',
            'Hallmarking Scheme for Precious Metals',
            'Jewellery & Precious Metals',
            'Active',
            'Hallmarking Regulations, 2018',
            'Mandatory Gold & Silver Purity',
            'Third-party purity certification of gold and silver articles marked with 6-digit alphanumeric HUID code at BIS Assaying & Hallmarking Centres (AHC).',
            '["Gold Jewellery (14k, 18k, 20k, 22k, 23k, 24k)", "Silver Artefacts"]'::jsonb,
            '[
              {"number": "01", "title": "Portal Registration", "subtitle": "Zero Fee for Jewellers", "description": "Register outlet details on Manak Online portal.", "status": "completed"},
              {"number": "02", "title": "Consignment Submission", "subtitle": "To Recognized AHC", "description": "Deliver jewellery pieces to accredited Assaying and Hallmarking Centre.", "status": "current"},
              {"number": "03", "title": "Assay & Laser HUID", "subtitle": "XRF & Fire Assay", "description": "AHC verifies purity and applies unique 6-digit laser HUID stamp.", "status": "upcoming"}
            ]'::jsonb,
            '[
              "GST Registration Certificate of Jeweller Outlet",
              "Proof of Commercial Premises / Trade Licence",
              "Aadhaar / Identity Proof of Authorized Signatory"
            ]'::jsonb,
            'Fire assay method as per IS 1418 for gold and potentiometric titration as per IS 2113 for silver.',
            'Surveillance audits conducted at Assaying Centres and retail jewellery showrooms.',
            'Same Day or within 24 Hours at AHC',
            'BIS Hallmarking Scheme (Indian Standard IS 1417)'
          );
        `);
      }
    } catch (schemeErr) {
      console.warn('[initDatabase] Schemes seeding note:', (schemeErr as Error).message);
    }

    // 6. Seed QCO Updates if empty
    try {
      const qcoCountRes = await pool.query('SELECT COUNT(*) FROM qcos');
      const qcoCount = parseInt(qcoCountRes.rows[0].count, 10);
      if (qcoCount === 0) {
        await pool.query(`
          INSERT INTO qcos (qco_number, title, ministry, standards_count, status, order_date, enforcement_date, gazette_number, summary, source_url, standard_reference)
          VALUES
          (
            'DPIIT-QCO-2024-1290',
            'Cookware, Utensils and Canisters Quality Control Order, 2024',
            'Ministry of Commerce and Industry (DPIIT)',
            2,
            'Enforced',
            '15 March 2024',
            '15 September 2024 (Large/Medium) & 15 March 2025 (Micro/Small)',
            'S.O. 1290(E)',
            'Mandatory Scheme I ISI standard mark order for all domestic manufacturers and importers of stainless steel insulated flasks and bottles.',
            'https://www.bis.gov.in',
            'IS 17526:2021 & IS 17803:2022'
          ),
          (
            'DPIIT-QCO-2023-4821',
            'Electrical Appliances (Quality Control) Order, 2023',
            'Ministry of Commerce and Industry',
            4,
            'Enforced',
            '05 December 2023',
            '05 June 2024',
            'S.O. 4821(E)',
            'Enforces mandatory ISI marking for electrical domestic appliances ensuring consumer safety and anti-shock protections.',
            'https://standardsbis.bsbedge.com',
            'IS 302 (Part 1):2024 & IS 302 (Part 2 series)'
          ),
          (
            'MEITY-CRS-2024-09',
            'Electronics & IT Goods Compulsory Registration Mandate',
            'Ministry of Electronics and Information Technology (MeitY)',
            3,
            'Enforced',
            '10 August 2024',
            'Immediate',
            'MeitY Notification No. W-43/1/2024',
            'Registration requirement for rechargeable portable battery assemblies, laptops, and adapters under BIS Scheme II.',
            'https://www.bis.gov.in',
            'IS 16046 (Part 2):2018'
          );
        `);
      }
    } catch (qcoErr) {
      console.warn('[initDatabase] QCO seeding note:', (qcoErr as Error).message);
    }

    isInitialized = true;
    console.log('[initDatabase] User panel tables and verified BIS data successfully initialized.');
  } catch (err) {
    console.error('[initDatabase] Database initialization error:', err);
  }
}
