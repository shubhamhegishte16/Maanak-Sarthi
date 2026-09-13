"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  ShieldAlert, 
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  BarChart3,
  ExternalLink
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type AuditStatus = "supported" | "missing" | "manual_check";

interface RequirementItem {
  id: string;
  clause: string;
  parameter: string;
  standardSpec: string;
  status: AuditStatus;
  evidenceSource?: string;
  notes: string;
}

const SAMPLE_AUDIT_DATA: Record<string, RequirementItem[]> = {
  "IS 302 (Part 2/Sec 21):2018": [
    {
      id: "req-1",
      clause: "Clause 6.1",
      parameter: "Classification of Protection Against Electric Shock",
      standardSpec: "Class I apparatus with protective earthing conductor terminal.",
      status: "supported",
      evidenceSource: "Lab Test Report #TR-2026-948 (Section 3.2)",
      notes: "Earth resistance measured at 0.04 Ω (conforms to limit < 0.1 Ω)."
    },
    {
      id: "req-2",
      clause: "Clause 8.1",
      parameter: "Protection Against Access to Live Parts",
      standardSpec: "Test probe B shall not contact live parts with 30 N force applied.",
      status: "supported",
      evidenceSource: "Lab Test Report #TR-2026-948 (Clause 8)",
      notes: "Articulated probe testing verified under normal and elevated temperatures."
    },
    {
      id: "req-3",
      clause: "Clause 19.11",
      parameter: "Abnormal Operation & Thermal Cut-Out Verification",
      standardSpec: "Self-resetting thermal cut-out must operate before tank dry boiling occurs.",
      status: "missing",
      notes: "Missing test evidence: Manufacturer dry boiling test certificate not attached in dossier."
    },
    {
      id: "req-4",
      clause: "Clause 22.102",
      parameter: "Hydrostatic Pressure Test of Water Container",
      standardSpec: "Inner tank container withstands 1.5 times maximum rated operating pressure.",
      status: "supported",
      evidenceSource: "Factory Batch Inspection Record #FAB-310",
      notes: "Pressure sustained at 1.2 MPa for 15 minutes without leakage."
    },
    {
      id: "req-5",
      clause: "Clause 7.1",
      parameter: "Standard Marking & ISI Logo Layout",
      standardSpec: "Marking of rated wattage, capacity, water pressure, and BIS licence number CM/L-XXXXXXXXXX.",
      status: "manual_check",
      notes: "Requires manual inspection: Proposed rating plate artwork requires dimensional alignment check with BIS marking scheme."
    }
  ],
  default: [
    {
      id: "req-def-1",
      clause: "Clause 5.1",
      parameter: "Material Specifications & Grade Conformity",
      standardSpec: "Raw materials must conform to referenced Indian Standard specifications.",
      status: "supported",
      evidenceSource: "Mill Test Certificate #MTC-8842",
      notes: "Chemical composition meets minimum chromium/nickel alloying thresholds."
    },
    {
      id: "req-def-2",
      clause: "Clause 7.2",
      parameter: "Safety & Stress Performance Evaluation",
      standardSpec: "Component demonstrates stability under maximum prescribed load conditions.",
      status: "missing",
      notes: "Missing test report: Tensile and yield stress evaluation documentation pending."
    },
    {
      id: "req-def-3",
      clause: "Clause 9.3",
      parameter: "Durability & Environmental Conditioning",
      standardSpec: "Zero degradation after 48-hour continuous saline spray conditioning.",
      status: "manual_check",
      notes: "Manual verification required: Lab chamber calibration record requires validity confirmation."
    }
  ]
};

function ComplianceCheckerContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const requestedStd = searchParams.get("standard") || "IS 302 (Part 2/Sec 21):2018";

  const [selectedStandard, setSelectedStandard] = useState(requestedStd);
  const [filterStatus, setFilterStatus] = useState<"all" | AuditStatus>("all");

  const requirements = SAMPLE_AUDIT_DATA[selectedStandard] || SAMPLE_AUDIT_DATA.default;

  const filteredRequirements = requirements.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  const supportedCount = requirements.filter((r) => r.status === "supported").length;
  const missingCount = requirements.filter((r) => r.status === "missing").length;
  const manualCount = requirements.filter((r) => r.status === "manual_check").length;

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("compTitle", "Compliance")}
        italicWord={t("compItalic", "Checker")}
        description={t("compSubtitle", "Cross-evaluate uploaded test reports and factory records against mandatory clauses of Indian Standards. Identify supported parameters and highlighted evidence gaps.")}
        badgeText={t("compBadge", "Verification Module • Diagnostic Audit")}
        breadcrumbs={[{ label: t("compliance", "Compliance Checker") }]}
      />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* MANDATORY STATUTORY DISCLAIMER (Required by guidelines) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-bis-gold-light/80 border border-bis-gold/30 flex items-start space-x-3 mb-8 shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-bis-terracotta flex-shrink-0 mt-0.5" />
          <div className="text-xs text-bis-slate leading-relaxed">
            <span className="font-bold text-bis-slate block mb-1">
              {t("advisoryNotice", "AI-Assisted Assessment Notice")}:
            </span>
            {t("compNotice", "Based on the information provided, the following requirements appear to be supported. This evaluation does NOT constitute a legal certification or statutory compliance determination. Formal conformity certificates are granted solely by authorized BIS assessing officers following physical audit and designated laboratory testing.")}
          </div>
        </div>

        {/* Selected Standard & Metric Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bis-border shadow-custom-lg mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bis-border/60 pb-4">
            <div>
              <span className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider block">
                {t("compAuditedStd", "Audited Standard")}
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono text-base sm:text-lg font-bold text-bis-burgundy bg-bis-burgundy/10 px-3 py-1 rounded-xl">
                  {selectedStandard}
                </span>
                <span className="text-xs text-bis-slate-muted hidden sm:inline">• Scheme I ISI Mandate</span>
              </div>
            </div>

            {/* Change standard pill select */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-bis-slate-muted">Sample Standards:</span>
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-bis-cream border border-bis-border text-xs text-bis-slate font-medium focus:outline-none focus:border-bis-burgundy"
              >
                <option value="IS 302 (Part 2/Sec 21):2018">IS 302 (Water Heaters)</option>
                <option value="IS 16046 (Part 2):2018">IS 16046 (Lithium Batteries)</option>
              </select>
            </div>
          </div>

          {/* Metric Status Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-bis-sage-light/70 border border-bis-sage/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-bis-sage-dark uppercase tracking-wider block">
                  {t("evidenceFound", "Evidence Found")}
                </span>
                <span className="font-serif-title text-2xl font-bold text-bis-slate mt-0.5 block">
                  {supportedCount}
                </span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-bis-sage-dark" />
            </div>

            <div className="p-4 rounded-2xl bg-bis-gold-light/80 border border-bis-gold/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-bis-terracotta uppercase tracking-wider block">
                  {t("missingEvidence", "Missing Evidence")}
                </span>
                <span className="font-serif-title text-2xl font-bold text-bis-slate mt-0.5 block">
                  {missingCount}
                </span>
              </div>
              <AlertTriangle className="w-8 h-8 text-bis-terracotta" />
            </div>

            <div className="p-4 rounded-2xl bg-bis-cream border border-bis-border flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-bis-slate-muted uppercase tracking-wider block">
                  {t("manualVerification", "Manual Verification")}
                </span>
                <span className="font-serif-title text-2xl font-bold text-bis-slate mt-0.5 block">
                  {manualCount}
                </span>
              </div>
              <HelpCircle className="w-8 h-8 text-bis-slate-muted" />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-bis-slate-muted mr-1">{t("compFilterClauses", "Filter Clauses:")}</span>
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterStatus === "all"
                  ? "bg-bis-burgundy text-white shadow-2xs"
                  : "bg-white text-bis-slate border border-bis-border"
              }`}
            >
              {requirements.length}
            </button>
            <button
              onClick={() => setFilterStatus("supported")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterStatus === "supported"
                  ? "bg-bis-sage-dark text-white shadow-2xs"
                  : "bg-white text-bis-slate border border-bis-border"
              }`}
            >
              {t("evidenceFound", "Supported")} ({supportedCount})
            </button>
            <button
              onClick={() => setFilterStatus("missing")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterStatus === "missing"
                  ? "bg-bis-terracotta text-white shadow-2xs"
                  : "bg-white text-bis-slate border border-bis-border"
              }`}
            >
              {t("missingEvidence", "Missing")} ({missingCount})
            </button>
          </div>

          <Link
            href="/application-readiness"
            className="text-xs font-semibold text-bis-burgundy hover:underline inline-flex items-center space-x-1"
          >
            <span>{t("readiness", "Application Readiness")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Requirements Table (Desktop) vs Stacked Cards (Mobile) */}
        <div className="bg-white rounded-3xl border border-bis-border shadow-custom-sm overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bis-cream-dark/70 text-bis-slate font-bold uppercase tracking-wider text-[11px] border-b border-bis-border">
                  <th className="py-4 px-6">{t("compParamCol", "Clause / Parameter")}</th>
                  <th className="py-4 px-6">{t("compSpecCol", "Standard Specification")}</th>
                  <th className="py-4 px-6">{t("compStatusCol", "Evaluation Status")}</th>
                  <th className="py-4 px-6">{t("compNotesCol", "Evidence & Audit Notes")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bis-border/60">
                {filteredRequirements.map((item) => (
                  <tr key={item.id} className="hover:bg-bis-cream/50 transition-colors">
                    <td className="py-4 px-6 align-top">
                      <span className="font-mono text-xs font-bold text-bis-burgundy bg-bis-burgundy/10 px-2 py-0.5 rounded block w-max mb-1">
                        {item.clause}
                      </span>
                      <span className="font-semibold text-bis-slate">{item.parameter}</span>
                    </td>
                    <td className="py-4 px-6 align-top text-bis-slate-muted leading-relaxed max-w-xs">
                      {item.standardSpec}
                    </td>
                    <td className="py-4 px-6 align-top">
                      {item.status === "supported" && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-bis-sage-light text-bis-sage-dark border border-bis-sage/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Evidence Found</span>
                        </span>
                      )}
                      {item.status === "missing" && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-bis-gold-light text-bis-terracotta border border-bis-gold/40">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Missing Evidence</span>
                        </span>
                      )}
                      {item.status === "manual_check" && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-bis-cream-dark text-bis-slate-muted border border-bis-border">
                          <HelpCircle className="w-3 h-3" />
                          <span>Manual Verification</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 align-top space-y-1 max-w-sm">
                      {item.evidenceSource && (
                        <div className="text-[11px] font-semibold text-bis-slate flex items-center space-x-1">
                          <FileText className="w-3 h-3 text-bis-burgundy" />
                          <span>{item.evidenceSource}</span>
                        </div>
                      )}
                      <p className="text-[11px] text-bis-slate-muted leading-relaxed">
                        {item.notes}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="lg:hidden p-4 divide-y divide-bis-border space-y-4">
            {filteredRequirements.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-bis-burgundy bg-bis-burgundy/10 px-2 py-0.5 rounded">
                    {item.clause}
                  </span>
                  {item.status === "supported" && (
                    <span className="text-[11px] font-semibold text-bis-sage-dark flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Evidence Found</span>
                    </span>
                  )}
                  {item.status === "missing" && (
                    <span className="text-[11px] font-semibold text-bis-terracotta flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Missing Evidence</span>
                    </span>
                  )}
                  {item.status === "manual_check" && (
                    <span className="text-[11px] font-semibold text-bis-slate-muted flex items-center space-x-1">
                      <HelpCircle className="w-3 h-3" />
                      <span>Manual Check</span>
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-bis-slate">{item.parameter}</h4>
                <p className="text-bis-slate-muted leading-relaxed">{item.standardSpec}</p>

                {item.evidenceSource && (
                  <div className="bg-bis-cream p-2.5 rounded-xl border border-bis-border text-[11px]">
                    <span className="font-semibold text-bis-slate block">Source: {item.evidenceSource}</span>
                    <span className="text-bis-slate-muted mt-0.5 block">{item.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Workflow Routing */}
        <div className="mt-8 p-6 bg-white rounded-3xl border border-bis-border shadow-custom-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif-title text-base font-semibold text-bis-slate">
              Need laboratory testing for missing evidence clauses?
            </h4>
            <p className="text-xs text-bis-slate-muted mt-0.5">
              Locate BIS-recognized test facilities capable of testing {selectedStandard}.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={`/labs?standard=${encodeURIComponent(selectedStandard)}`}
              className="px-5 py-2.5 bg-bis-burgundy text-white text-xs font-semibold rounded-full hover:bg-bis-burgundy-light transition-all shadow-sm flex items-center space-x-1.5"
            >
              <span>Locate Accredited Labs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}

export default function ComplianceCheckerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bis-cream flex items-center justify-center text-xs">Loading Compliance Checker...</div>}>
      <ComplianceCheckerContent />
    </Suspense>
  );
}
