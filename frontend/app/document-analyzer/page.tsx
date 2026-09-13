"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import { 
  UploadCloud, 
  FileText, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Send, 
  Search, 
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SampleDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  title: string;
  summary: string;
  identifiedStandards: { isNumber: string; title: string; clause: string }[];
  dates: { label: string; date: string }[];
  requirements: string[];
  missingInfo: string[];
  suggestedQuestions: string[];
}

const SAMPLE_DOCS: SampleDocument[] = [
  {
    id: "doc-1",
    name: "DPIIT_QCO_Cookware_2024_Gazette.pdf",
    size: "1.4 MB",
    type: "Gazette Notification",
    title: "Cookware, Utensils and Canisters Quality Control Order, 2024",
    summary: "Ministry of Commerce and Industry statutory order mandating standard mark conformity under Scheme-I of Schedule-II for stainless steel insulated and non-insulated containers.",
    identifiedStandards: [
      { isNumber: "IS 17526:2021", title: "Stainless Steel Vacuum Flasks and Insulated Bottles", clause: "Order Paragraph 3" },
      { isNumber: "IS 17803:2022", title: "Single Walled Stainless Steel Water Bottles", clause: "Order Paragraph 4" }
    ],
    dates: [
      { label: "Date of Gazette Notification", date: "15 March 2024" },
      { label: "Mandatory Enforcement Date (Large/Medium Units)", date: "15 September 2024" },
      { label: "Enforcement Date (Micro & Small Enterprises)", date: "15 March 2025" }
    ],
    requirements: [
      "Goods must conform to corresponding Indian Standard and bear the standard mark (ISI).",
      "Licence must be obtained under Scheme I of Schedule II of BIS (Conformity Assessment) Regulations.",
      "BIS designated as the sole certifying and enforcement authority."
    ],
    missingInfo: [
      "Specific testing laboratory concession list not specified in this gazette section.",
      "Export goods exemption requires verification of custom bond documentation."
    ],
    suggestedQuestions: [
      "Does this order apply to micro manufacturers immediately?",
      "What is the penalty for stocking non-certified inventory after the deadline?",
      "Which BIS scheme applies to this order?"
    ]
  },
  {
    id: "doc-2",
    name: "NABL_Accredited_Lab_Test_Report_Sample.pdf",
    size: "2.8 MB",
    type: "Laboratory Test Report",
    title: "Conformity Test Report on Secondary Lithium-Ion Cell Assembly",
    summary: "Independent testing laboratory certificate evaluating cylindrical secondary lithium cells against mechanical abuse and overcharge test parameters.",
    identifiedStandards: [
      { isNumber: "IS 16046 (Part 2):2018", title: "Secondary Lithium Cells & Batteries", clause: "Clauses 7.2.1 & 7.3.2" },
      { isNumber: "IEC 62133-2:2017", title: "Safety Requirements for Portable Sealed Cells", clause: "Annexure B" }
    ],
    dates: [
      { label: "Sample Testing Completed", date: "12 August 2026" },
      { label: "Report Validity Window", date: "90 Days from Issue" }
    ],
    requirements: [
      "Continuous charging at constant voltage passed without thermal runaway.",
      "External short circuit test verified at 55°C ± 5°C with no rupture or fire.",
      "Cell vent mechanism functioned within specified threshold."
    ],
    missingInfo: [
      "BIS Lab Portal sample barcode reference string requires re-authentication.",
      "Factory manufacturing batch serial ranges not explicitly itemized on Page 4."
    ],
    suggestedQuestions: [
      "Does this test report satisfy the CRS registration prerequisite?",
      "Is the 90-day validity sufficient for our BIS application filing?",
      "Are all required IS 16046 clauses evaluated in this report?"
    ]
  }
];

export default function DocumentAnalyzerPage() {
  const { t } = useLanguage();
  const [activeDoc, setActiveDoc] = useState<SampleDocument | null>(SAMPLE_DOCS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<{ q: string; a: string }[]>([]);

  const handleSelectPreset = (doc: SampleDocument) => {
    setIsUploading(true);
    setActiveDoc(null);
    setQaHistory([]);
    setTimeout(() => {
      setActiveDoc(doc);
      setIsUploading(false);
    }, 450);
  };

  const handleSimulatedUpload = () => {
    setIsUploading(true);
    setActiveDoc(null);
    setQaHistory([]);
    setTimeout(() => {
      setActiveDoc(SAMPLE_DOCS[0]);
      setIsUploading(false);
    }, 600);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || !activeDoc) return;

    const q = userQuestion;
    setUserQuestion("");

    let reply = `Based on our AI-assisted parsing of "${activeDoc.name}", this document references ${activeDoc.identifiedStandards[0]?.isNumber}. The document outlines mandatory compliance requirements subject to official verification with BIS gazette notifications.`;

    if (q.toLowerCase().includes("micro") || q.toLowerCase().includes("deadline")) {
      reply = `According to the parsed timeline in this document, Micro and Small Enterprises have extended compliance deadlines (up to 6 additional months) compared to large manufacturers. Please check Order Paragraph 5.`;
    } else if (q.toLowerCase().includes("scheme")) {
      reply = `This document specifies compliance under Scheme-I of Schedule-II (Standard ISI Mark Scheme), requiring factory audit and laboratory test report verification.`;
    }

    setQaHistory((prev) => [...prev, { q, a: reply }]);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("docTitle", "Document")}
        italicWord={t("docItalic", "Analyzer")}
        description={t("docSubtitle", "Upload and analyze BIS Quality Control Orders, laboratory test reports, and standard gazettes. AI automatically extracts cited standards, clauses, and enforcement timelines.")}
        badgeText={t("docBadge", "Interpretation Module • Source-Grounded Document AI")}
        breadcrumbs={[{ label: t("documents", "Document Analyzer") }]}
      />

      <div className="flex-grow max-w-[1536px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Sample Document Selector Strip */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-bis-slate-muted uppercase tracking-wider mb-3">
            {t("docSampleSelector", "Load an official sample document to analyze:")}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {SAMPLE_DOCS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSelectPreset(doc)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all flex items-center space-x-2 ${
                  activeDoc?.id === doc.id
                    ? "bg-bis-burgundy text-white border-bis-burgundy shadow-sm"
                    : "bg-white hover:bg-bis-cream-dark text-bis-slate border-bis-border"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{doc.type}: {doc.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload Dropzone & Document Meta (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Upload Box */}
            <div 
              onClick={handleSimulatedUpload}
              className="bg-white p-6 rounded-3xl border-2 border-dashed border-bis-border hover:border-bis-burgundy transition-all text-center cursor-pointer group shadow-custom-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-bis-cream-dark text-bis-burgundy flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="font-serif-title text-base font-semibold text-bis-slate">
                {t("docUploadTitle", "Upload BIS Document")}
              </h4>
              <p className="text-xs text-bis-slate-muted mt-1">
                {t("docUploadDesc", "Drag & drop QCO notification, NABL test report, or standard excerpt (PDF, DOCX up to 25MB)")}
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-bis-cream hover:bg-bis-cream-dark border border-bis-border text-bis-slate text-xs font-semibold rounded-full transition-all"
              >
                {t("docSelectFile", "Select Local File")}
              </button>
            </div>

            {/* Document Preview Card */}
            {activeDoc && (
              <div className="bg-white p-5 rounded-3xl border border-bis-border shadow-custom-sm space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-bis-border/60 pb-3">
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-4 h-4 text-bis-sage-dark" />
                    <span className="font-semibold text-bis-slate">{activeDoc.name}</span>
                  </div>
                  <span className="text-[10px] text-bis-slate-muted">{activeDoc.size}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider block mb-1">
                    {t("docClassTitle", "Document Classification")}
                  </span>
                  <div className="text-xs font-semibold text-bis-slate">{activeDoc.title}</div>
                  <p className="text-[11px] text-bis-slate-muted mt-1 leading-relaxed">
                    {activeDoc.summary}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider block mb-1.5">
                    {t("docTimelinesTitle", "Critical Timelines & Dates")}
                  </span>
                  <div className="space-y-1.5">
                    {activeDoc.dates.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] bg-bis-cream p-2 rounded-lg border border-bis-border/50">
                        <span className="text-bis-slate-muted">{d.label}</span>
                        <span className="font-semibold text-bis-slate">{d.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-bis-border/60 text-[10px] text-bis-slate-muted italic">
                  AI-extracted information — requires verification against official gazette publication.
                </div>
              </div>
            )}

          </div>

          {/* Right Column: AI Extraction & QA Section (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {isUploading ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-bis-border">
                <div className="w-10 h-10 border-3 border-bis-burgundy border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="font-serif-title text-base font-semibold text-bis-slate">
                  Parsing Document & Extracting Indian Standards...
                </h4>
                <p className="text-xs text-bis-slate-muted max-w-sm mx-auto">
                  Cross-referencing gazette clauses against National Standards Catalog.
                </p>
              </div>
            ) : activeDoc ? (
              <div className="space-y-6">
                
                {/* Extracted Standards Bar */}
                <div className="bg-white rounded-3xl p-6 border border-bis-border shadow-custom-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-bis-border/60 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-bis-sage animate-pulse" />
                      <h3 className="font-serif-title text-base font-semibold text-bis-slate">
                        {t("docExtractedTitle", "Identified Indian Standards")} ({activeDoc.identifiedStandards.length})
                      </h3>
                    </div>
                    <ConfidenceBadge level="verified" label="AI Extracted • Verified Match" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeDoc.identifiedStandards.map((std, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-bis-cream border border-bis-border space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-bis-burgundy bg-bis-burgundy/10 px-2 py-0.5 rounded">
                            {std.isNumber}
                          </span>
                          <span className="text-[10px] font-semibold text-bis-slate-muted">
                            {std.clause}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-bis-slate leading-snug">
                          {std.title}
                        </p>
                        <div className="pt-2 flex items-center space-x-2 text-[11px]">
                          <Link
                            href={`/standards?query=${encodeURIComponent(std.isNumber)}`}
                            className="text-bis-burgundy font-semibold hover:underline inline-flex items-center space-x-1"
                          >
                            <span>{t("viewDetails", "Explore Standard")}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mandated Requirements & Potential Missing Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Found Requirements */}
                  <div className="bg-white rounded-3xl p-5 border border-bis-border shadow-custom-sm space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-bis-slate">
                      <CheckCircle2 className="w-4 h-4 text-bis-sage-dark" />
                      <span>{t("docReqTitle", "Requirements Identified")}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-bis-slate">
                      {activeDoc.requirements.map((req, i) => (
                        <li key={i} className="flex items-start space-x-2 bg-bis-sage-light/60 p-2.5 rounded-xl border border-bis-sage/20">
                          <span className="text-bis-sage-dark font-bold">•</span>
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Potential Missing Information Warnings */}
                  <div className="bg-white rounded-3xl p-5 border border-bis-border shadow-custom-sm space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-bis-slate">
                      <AlertTriangle className="w-4 h-4 text-bis-terracotta" />
                      <span>{t("docMissingTitle", "Potential Missing Information")}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-bis-slate">
                      {activeDoc.missingInfo.map((mis, i) => (
                        <li key={i} className="flex items-start space-x-2 bg-bis-gold-light/60 p-2.5 rounded-xl border border-bis-gold/25">
                          <span className="text-bis-terracotta font-bold">•</span>
                          <span className="leading-relaxed">{mis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Question Box: Ask About This Document */}
                <div className="bg-white rounded-3xl p-6 border border-bis-border shadow-custom-sm space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-bis-slate">
                    <Sparkles className="w-4 h-4 text-bis-burgundy" />
                    <span>{t("docInquireTitle", "Inquire About This Document")}</span>
                  </div>

                  {/* Suggested Question Pills */}
                  <div className="flex flex-wrap gap-2">
                    {activeDoc.suggestedQuestions.map((sq, i) => (
                      <button
                        key={i}
                        onClick={() => setUserQuestion(sq)}
                        className="text-[11px] bg-bis-cream hover:bg-bis-cream-dark text-bis-slate px-3 py-1 rounded-full border border-bis-border transition-colors text-left"
                      >
                        {sq}
                      </button>
                    ))}
                  </div>

                  {/* QA History */}
                  {qaHistory.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {qaHistory.map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="text-xs font-semibold text-bis-slate bg-bis-cream p-2 rounded-xl">
                            Q: {item.q}
                          </div>
                          <div className="text-xs text-bis-slate-muted bg-bis-sage-light/60 p-3 rounded-xl border border-bis-sage/20 leading-relaxed">
                            <span className="font-semibold text-bis-sage-dark block mb-0.5">AI Interpretation:</span>
                            {item.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Question form */}
                  <form onSubmit={handleAskQuestion} className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      placeholder={t("docInquirePlaceholder", "Ask a specific question about clauses, testing, or enforcement...")}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-bis-cream border border-bis-border focus:outline-none focus:border-bis-burgundy text-xs text-bis-slate"
                    />
                    <button
                      type="submit"
                      disabled={!userQuestion.trim()}
                      className="px-4 py-2.5 bg-bis-burgundy text-white text-xs font-semibold rounded-xl hover:bg-bis-burgundy-light transition-all flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
                    >
                      <span>{t("docInquireBtn", "Inquire")}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* Workflow Next Steps */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-bis-cream-dark/60 rounded-2xl border border-bis-border text-xs">
                  <div className="text-bis-slate-muted">
                    Ready to audit compliance based on this document?
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/compliance"
                      className="px-4 py-1.5 bg-bis-burgundy text-white font-semibold rounded-full hover:bg-bis-burgundy-light transition-all shadow-2xs"
                    >
                      Run Compliance Check
                    </Link>
                    <Link
                      href="/certification"
                      className="px-4 py-1.5 bg-white border border-bis-border text-bis-slate font-semibold rounded-full hover:bg-bis-cream transition-all"
                    >
                      View Certification Scheme
                    </Link>
                  </div>
                </div>

              </div>
            ) : null}

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
