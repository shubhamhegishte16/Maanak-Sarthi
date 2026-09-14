"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import StepTimeline, { TimelineStep } from "@/components/shared/StepTimeline";
import StatusBadge from "@/components/shared/StatusBadge";
import { 
  Settings, 
  FileText, 
  CheckCircle2, 
  FlaskConical, 
  Building2, 
  Award, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Clock,
  Layers
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { publicApi } from "@/lib/api";

interface CertificationScheme {
  id: string;
  name: string;
  schedule: string;
  badge: string;
  shortDesc: string;
  productExamples: string[];
  mandatoryNote: string;
  steps: TimelineStep[];
  requiredDocs: string[];
  testingProtocol: string;
  factoryAudit: string;
  estimatedTimeline: string;
  officialRef: string;
}

const CERT_SCHEMES: CertificationScheme[] = [
  {
    id: "isi",
    name: "Scheme I — ISI Mark Certification",
    schedule: "Schedule-II, Scheme-I (Conformity Assessment Regulations)",
    badge: "Most Common for Industrial & Domestic Goods",
    shortDesc: "Traditional standard mark licence granted following factory infrastructure audit, in-house laboratory inspection, and independent sample testing.",
    productExamples: ["Domestic Appliances (IS 302)", "Cement (IS 269)", "Steel Products", "Helmets (IS 4151)", "Bottles (IS 17526)"],
    mandatoryNote: "Mandated across 500+ categories via Ministry Quality Control Orders (QCOs).",
    estimatedTimeline: "30 to 60 Days from application acceptance",
    officialRef: "BIS Product Certification Scheme-I (BIS Act 2016)",
    steps: [
      { number: "01", title: "Product & IS Identification", subtitle: "Define Scope", description: "Identify product specifications and primary applicable Indian Standard.", status: "completed" },
      { number: "02", title: "Manufacturing & Lab Setup", subtitle: "Factory Audit Prep", description: "Ensure internal quality testing machinery matches Scheme of Testing & Inspection (STI).", status: "completed" },
      { number: "03", title: "Document Collation", subtitle: "Form & Annexures", description: "Prepare plant machinery list, calibration records, factory layout, and test certificates.", status: "current" },
      { number: "04", title: "Factory Inspection", subtitle: "BIS Technical Audit", description: "BIS inspecting officers verify manufacturing control and draw counter-samples.", status: "upcoming" },
      { number: "05", title: "Independent Sample Testing", subtitle: "Recognized Lab", description: "Samples drawn during audit are tested at accredited BIS or central laboratories.", status: "upcoming" },
      { number: "06", title: "Licence Grant (CM/L)", subtitle: "Standard Mark", description: "Grant of licence to use Standard ISI Mark on verified production lots.", status: "upcoming" },
    ],
    requiredDocs: [
      "Factory Registration / Proof of Manufacturing Premises",
      "Process Flowchart & Manufacturing Machinery Inventory",
      "In-House Testing Equipment & Valid Calibration Certificates",
      "Quality Control Personnel Qualifications & Appointment Letters",
      "Raw Material Test Certificates (MTC)",
      "Factory Layout Map and Drawing of Proposed Marking"
    ],
    testingProtocol: "Manufacturer must maintain laboratory equipment conforming to the relevant Scheme of Testing and Inspection (STI) issued by BIS.",
    factoryAudit: "Physical audit conducted by BIS authorized technical officers to verify raw material inspection, stage inspection, and routine batch testing."
  },
  {
    id: "crs",
    name: "Scheme II — Compulsory Registration Scheme (CRS)",
    schedule: "Schedule-II, Scheme-II (Registration Scheme)",
    badge: "Electronic & IT Products",
    shortDesc: "Self-declaration of conformity based on laboratory test reports issued by BIS-recognized testing laboratories without pre-licence factory inspection.",
    productExamples: ["Lithium Batteries (IS 16046)", "Laptops & Tablets", "LED Lamps", "Power Adapters", "Smart Watches"],
    mandatoryNote: "Mandated under MeitY and Ministry of Power Quality Control Orders.",
    estimatedTimeline: "15 to 25 Days post test report submission",
    officialRef: "BIS CRS Portal under MeitY Notification",
    steps: [
      { number: "01", title: "Sample Generation", subtitle: "Model Selection", description: "Prepare representative production samples matching product series grouping guidelines.", status: "completed" },
      { number: "02", title: "Testing at BIS Lab", subtitle: "NABL Accredited", description: "Submit samples to BIS-recognized lab for comprehensive safety evaluation.", status: "completed" },
      { number: "03", title: "Test Report Review", subtitle: "90-Day Validity", description: "Verify all clauses of applicable IS standard are evaluated without non-conformance.", status: "current" },
      { number: "04", title: "Online CRS Submission", subtitle: "Self Declaration", description: "Submit application on BIS CRS portal with test report and brand authorization.", status: "upcoming" },
      { number: "05", title: "Scrutiny & Registration", subtitle: "R-Number Grant", description: "BIS assigns unique Registration Number (R-XXXXXXXX) for the brand and models.", status: "upcoming" },
    ],
    requiredDocs: [
      "Original Test Report from BIS-Recognized Laboratory (less than 90 days old)",
      "Brand Owner Authorization Letter & Trademark Registration Certificate",
      "Authorized Indian Representative (AIR) Undertaking (for foreign brands)",
      "Product Technical Specification & Series Grouping Justification Document",
      "Affidavit cum Undertaking for CRS self-declaration"
    ],
    testingProtocol: "Testing must be conducted strictly at BIS-recognized laboratories in India. Foreign test reports are not accepted under CRS.",
    factoryAudit: "No initial factory audit required. Post-market surveillance testing is conducted periodically from retail market samples."
  },
  {
    id: "fmcs",
    name: "Foreign Manufacturers Certification Scheme (FMCS)",
    schedule: "Scheme-I for Overseas Production Units",
    badge: "Overseas Production",
    shortDesc: "Enables overseas manufacturers exporting products to India to use the standard ISI mark following physical inspection of overseas premises.",
    productExamples: ["Automotive Tyres", "Steel Bars & Wire", "Chemicals", "Medical Devices", "Electronic Appliances"],
    mandatoryNote: "Mandatory for overseas factories exporting QCO-regulated goods into India.",
    estimatedTimeline: "90 to 180 Days including international audit travel",
    officialRef: "BIS FMCS Branch, Manak Bhavan, New Delhi",
    steps: [
      { number: "01", title: "Appoint Indian Rep (AIR)", subtitle: "Statutory Mandate", description: "Nominate Authorized Indian Representative located within India.", status: "completed" },
      { number: "02", title: "Application Dossier", subtitle: "Form V Filing", description: "Submit comprehensive technical dossier to BIS FMCS headquarters.", status: "current" },
      { number: "03", title: "Overseas Factory Audit", subtitle: "Physical Inspection", description: "BIS technical team travels to overseas facility to verify manufacturing quality.", status: "upcoming" },
      { number: "04", title: "Sample Testing in India", subtitle: "Custom Bond Clearance", description: "Drawn samples tested at independent accredited laboratories in India.", status: "upcoming" },
      { number: "05", title: "Licence & Performance Bond", subtitle: "Marking Permission", description: "Submission of Performance Bank Guarantee and grant of FMCS licence.", status: "upcoming" },
    ],
    requiredDocs: [
      "Nomination Letter of Authorized Indian Representative (AIR)",
      "Overseas Manufacturing Facility Business Licence & Environmental Clearance",
      "Process Flow Diagram & Machinery Serial List",
      "Testing Equipment List with Calibration Hierarchy",
      "Performance Bank Guarantee (PBG) Undertaking",
      "Agreement on BIS Terms and Conditions"
    ],
    testingProtocol: "Counter-samples drawn during overseas audit are sealed and dispatched to designated BIS laboratories in India for verification.",
    factoryAudit: "Mandatory physical audit of overseas production lines, in-house lab, and quality management system by BIS officers."
  }
];

export default function CertificationNavigatorPage() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<CertificationScheme[]>(CERT_SCHEMES);
  const [selectedSchemeId, setSelectedSchemeId] = useState("isi");

  useEffect(() => {
    async function loadSchemes() {
      try {
        const res = await publicApi.getSchemes();
        if (res.data.success && Array.isArray(res.data.schemes) && res.data.schemes.length > 0) {
          const mapped: CertificationScheme[] = res.data.schemes.map((s: any) => ({
            id: s.scheme_id || s.id,
            name: s.name,
            schedule: s.schedule || 'Conformity Assessment Regulations',
            badge: s.badge || s.sector || 'Mandatory Standard Mark',
            shortDesc: s.short_desc || s.name,
            productExamples: Array.isArray(s.product_examples) ? s.product_examples : [],
            mandatoryNote: s.status === 'Active' ? 'Active standard scheme under BIS Act.' : 'Voluntary standard scheme.',
            steps: Array.isArray(s.steps) && s.steps.length > 0 ? s.steps : (CERT_SCHEMES.find(cs => cs.id === s.scheme_id)?.steps || []),
            requiredDocs: Array.isArray(s.required_docs) && s.required_docs.length > 0 ? s.required_docs : (CERT_SCHEMES.find(cs => cs.id === s.scheme_id)?.requiredDocs || []),
            testingProtocol: s.testing_protocol || 'Testing at BIS recognized laboratory.',
            factoryAudit: s.factory_audit || 'Physical audit by BIS technical officers.',
            estimatedTimeline: s.estimated_timeline || '30-45 Days',
            officialRef: s.official_ref || 'BIS Conformity Assessment Regulations'
          }));

          setSchemes((prev) => {
            const ids = new Set(mapped.map(m => m.id));
            const remaining = prev.filter(p => !ids.has(p.id));
            return [...mapped, ...remaining];
          });
        }
      } catch (err) {
        console.error("Failed to fetch live schemes:", err);
      }
    }
    loadSchemes();
  }, []);

  const currentScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("certTitle", "Certification")}
        italicWord={t("certItalic", "Navigator")}
        description={t("certSubtitle", "Understand statutory BIS certification schemes, document readiness prerequisites, testing requirements, and step-by-step procedural lifecycles.")}
        badgeText={t("certBadge", "Guidance Module • Conformity Assessment Framework")}
        breadcrumbs={[{ label: t("certification", "Certification Navigator") }]}
      />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Important Institutional Advisory */}
        <div className="mb-8 p-4 rounded-2xl bg-bis-gold-light/80 border border-bis-gold/30 flex items-start space-x-3 text-xs text-bis-slate leading-relaxed shadow-2xs">
          <AlertCircle className="w-4 h-4 text-bis-terracotta flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-bis-slate">{t("advisoryNotice", "Procedural Guidance Notice")}:</span> {t("certAdvisoryNotice", "This navigator provides educational guidance on BIS conformity assessment schemes. Official licence applications must be filed through the official BIS portals (Manakonline / CRS Portal). Final decisions on certification and testing remain exclusively with BIS.")}
          </div>
        </div>

        {/* Scheme Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {schemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => setSelectedSchemeId(scheme.id)}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedSchemeId === scheme.id
                  ? "bg-white border-bis-burgundy shadow-custom-lg ring-1 ring-bis-burgundy"
                  : "bg-white/80 hover:bg-white border-bis-border hover:border-bis-slate/30 shadow-2xs"
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  selectedSchemeId === scheme.id ? "bg-bis-burgundy/10 text-bis-burgundy" : "bg-bis-cream text-bis-slate-muted"
                }`}>
                  {scheme.badge}
                </span>
                <h3 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate mt-2">
                  {scheme.name}
                </h3>
                <p className="text-xs text-bis-slate-muted mt-1.5 line-clamp-2">
                  {scheme.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-bis-border/50 flex items-center justify-between text-xs font-semibold text-bis-burgundy">
                <span>{t("certViewFlow", "View Scheme Flow")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>

        {/* Active Scheme Detailed Breakdown */}
        <div className="space-y-8">
          
          {/* Visual Timeline Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bis-border shadow-custom-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bis-border/60 pb-4">
              <div>
                <div className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider">
                  {currentScheme.schedule}
                </div>
                <h3 className="text-xl sm:text-2xl font-serif-title font-semibold text-bis-slate mt-0.5">
                  {t("certTimelineTitle", "Procedural Lifecycle & Milestone Timeline")}
                </h3>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="p-1.5 rounded-lg bg-bis-cream-dark text-bis-slate-muted">
                  <Clock className="w-3.5 h-3.5" />
                </span>
                <span className="font-semibold text-bis-slate">
                  {currentScheme.estimatedTimeline}
                </span>
              </div>
            </div>

            {/* Stepper Component (Horizontal on desktop, vertical on mobile) */}
            <div className="hidden md:block py-2">
              <StepTimeline steps={currentScheme.steps} currentStepIndex={2} orientation="horizontal" />
            </div>
            <div className="md:hidden">
              <StepTimeline steps={currentScheme.steps} currentStepIndex={2} orientation="vertical" />
            </div>

            {/* Representative Categories */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-bis-slate-muted font-medium">Frequent Product Categories:</span>
              {currentScheme.productExamples.map((ex, i) => (
                <span key={i} className="bg-bis-cream px-2.5 py-1 rounded-md border border-bis-border text-bis-slate font-medium">
                  {ex}
                </span>
              ))}
            </div>
          </div>

          {/* Scheme Requirements & Audit Protocols (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Required Documentation Dossier (6 cols) */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-bis-border shadow-custom-sm space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-bis-slate border-b border-bis-border/60 pb-3">
                <FileText className="w-4 h-4 text-bis-burgundy" />
                <span>{t("certDossierTitle", "Prerequisite Documentation Dossier")}</span>
              </div>

              <p className="text-xs text-bis-slate-muted leading-relaxed">
                {t("certDossierDesc", "Before initiating official filing on the BIS portal, manufacturers must assemble and authenticate the following dossier:")}
              </p>

              <ul className="space-y-2.5 text-xs text-bis-slate">
                {currentScheme.requiredDocs.map((doc, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-bis-cream border border-bis-border/60">
                    <CheckCircle2 className="w-4 h-4 text-bis-sage-dark flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  href="/application-readiness"
                  className="w-full py-2.5 px-4 bg-bis-cream hover:bg-bis-cream-dark border border-bis-border text-bis-burgundy text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>{t("readiness", "Check Your Application Readiness Score")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Testing & Assessment Protocols (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Testing Protocol Box */}
              <div className="bg-white p-6 rounded-3xl border border-bis-border shadow-custom-sm space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-bis-slate">
                  <FlaskConical className="w-4 h-4 text-bis-sage-dark" />
                  <span>{t("certTestingTitle", "Testing & Laboratory Protocol")}</span>
                </div>
                <p className="text-xs text-bis-slate-muted leading-relaxed">
                  {currentScheme.testingProtocol}
                </p>
                <div className="pt-2">
                  <Link
                    href="/labs"
                    className="text-xs font-semibold text-bis-burgundy hover:underline inline-flex items-center space-x-1"
                  >
                    <span>{t("labs", "Search accredited testing laboratories for this scheme")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Factory Audit & Inspection Box */}
              <div className="bg-white p-6 rounded-3xl border border-bis-border shadow-custom-sm space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-bis-slate">
                  <Building2 className="w-4 h-4 text-bis-gold" />
                  <span>{t("certAuditTitle", "Factory Quality Audit & Surveillance")}</span>
                </div>
                <p className="text-xs text-bis-slate-muted leading-relaxed">
                  {currentScheme.factoryAudit}
                </p>
              </div>

              {/* Official BIS Process Link */}
              <div className="p-5 rounded-2xl bg-bis-burgundy text-white space-y-2 shadow-custom-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-bis-gold-light">
                    {t("certStatutoryRef", "Official Statutory Reference")}
                  </span>
                  <Award className="w-4 h-4 text-bis-gold-light" />
                </div>
                <h4 className="font-serif-title text-base font-semibold">
                  {currentScheme.officialRef}
                </h4>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Refer to the Bureau of Indian Standards official portal for application submission guidelines, fee schedules, and gazette notifications.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
