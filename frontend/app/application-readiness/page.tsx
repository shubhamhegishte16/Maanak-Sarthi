"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import { 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  FlaskConical, 
  Building2, 
  Settings, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Check, 
  AlertTriangle, 
  RotateCcw 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { userApi } from "@/lib/api";

interface ReadinessPillar {
  title: string;
  weight: string;
  readyCount: number;
  totalCount: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: { task: string; status: "ready" | "attention" | "pending"; note: string }[];
}

export default function ApplicationReadinessPage() {
  const { t } = useLanguage();

  const [pillars, setPillars] = useState<ReadinessPillar[]>([
    {
      title: "Document Dossier & Statutory Records",
      weight: "25%",
      readyCount: 4,
      totalCount: 5,
      icon: FileText,
      color: "text-bis-burgundy",
      items: [
        { task: "Factory Premises Ownership / Lease Agreement", status: "ready", note: "Verified against GST registration" },
        { task: "Process Flowchart & Plant Machinery Schedule", status: "ready", note: "Uploaded and cross-checked with capacity" },
        { task: "Appointed Technical QC Personnel CVs & Degrees", status: "ready", note: "B.Tech Electrical & Mechanical leads documented" },
        { task: "Brand Trademark / TM Application Certificate", status: "ready", note: "Valid Class 11 trade certificate on record" },
        { task: "Raw Material Supplier Mill Test Certificates (MTC)", status: "attention", note: "Grade 304 chemical composition certificate missing for Batch 2" }
      ]
    },
    {
      title: "Testing & Laboratory Verification",
      weight: "35%",
      readyCount: 2,
      totalCount: 3,
      icon: FlaskConical,
      color: "text-bis-sage-dark",
      items: [
        { task: "Independent Lab Test Report for Primary Safety Clauses", status: "ready", note: "TR-2026-948 from NABL accredited lab verified" },
        { task: "Complete Routine & Acceptance Test In-House Records", status: "ready", note: "Last 30 consecutive batch logs maintained" },
        { task: "Thermal Runaway / Abnormal Cut-out Test Certificate", status: "attention", note: "Specialized destructive test certificate pending from external lab" }
      ]
    },
    {
      title: "In-House Quality Infrastructure & Calibration",
      weight: "25%",
      readyCount: 3,
      totalCount: 4,
      icon: Building2,
      color: "text-bis-gold",
      items: [
        { task: "Scheme of Testing and Inspection (STI) Machinery Compliance", status: "ready", note: "Internal lab matches mandatory equipment list" },
        { task: "Pressure Gauge & High-Voltage Tester Calibration", status: "ready", note: "Calibrated within last 6 months by NABL calibration lab" },
        { task: "Environmental Conditioning Chamber Calibration", status: "attention", note: "Calibration certificate expired on 15 August 2026" },
        { task: "Daily Standard Mark Register Maintenance Protocol", status: "ready", note: "Digital log template configured" }
      ]
    },
    {
      title: "Procedural & BIS Portal Filing Preparedness",
      weight: "15%",
      readyCount: 2,
      totalCount: 2,
      icon: Settings,
      color: "text-bis-slate",
      items: [
        { task: "Authorized Signatory DSC & Portal Login Setup", status: "ready", note: "Class-3 Digital Signature Certificate active" },
        { task: "Fee Schedule Calculation & Bank Guarantee Line", status: "ready", note: "Application & inspection fee budget sanctioned" }
      ]
    }
  ]);

  useEffect(() => {
    async function loadReadiness() {
      try {
        const res = await userApi.getReadiness();
        if (res.data.success && Array.isArray(res.data.pillars) && res.data.pillars.length > 0) {
          setPillars((prev) =>
            res.data.pillars.map((p: any, idx: number) => ({
              ...p,
              icon: prev[idx]?.icon || FileText,
              color: prev[idx]?.color || "text-bis-burgundy",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch live readiness:", err);
      }
    }
    loadReadiness();
  }, []);

  const handleToggleTask = async (pillarTitle: string, task: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ready" ? "attention" : "ready";

    // Optimistic UI update
    setPillars((prev) =>
      prev.map((p) => {
        if (p.title !== pillarTitle) return p;
        const newItems = p.items.map((i) =>
          i.task === task ? { ...i, status: nextStatus as any } : i
        );
        const readyCount = newItems.filter((i) => i.status === "ready").length;
        return { ...p, items: newItems, readyCount };
      })
    );

    try {
      await userApi.updateReadinessTask({
        pillarTitle,
        task,
        status: nextStatus,
      });
    } catch (err) {
      console.error("Failed to persist task status:", err);
    }
  };

  const totalTasks = pillars.reduce((sum, p) => sum + p.totalCount, 0);
  const totalReady = pillars.reduce((sum, p) => sum + p.readyCount, 0);
  const readinessPercent = Math.round((totalReady / totalTasks) * 100);

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("readTitle", "Application")}
        italicWord={t("readItalic", "Readiness")}
        description={t("readSubtitle", "Self-evaluate manufacturing premises, laboratory calibration, and documentation completeness before formally submitting your BIS licence or CRS filing.")}
        badgeText={t("readBadge", "Preparation Module • Self-Assessment Benchmark")}
        breadcrumbs={[{ label: t("readiness", "Application Readiness") }]}
      />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* CRITICAL STATUTORY DISCLAIMER (Required by guidelines) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-bis-gold-light/80 border border-bis-gold/30 flex items-start space-x-3 mb-8 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-bis-terracotta flex-shrink-0 mt-0.5" />
          <div className="text-xs text-bis-slate leading-relaxed">
            <span className="font-bold text-bis-slate block mb-1">
              {t("advisoryNotice", "Important Guideline on Readiness Score")}:
            </span>
            {t("readNotice", "This percentage represents an internal readiness self-assessment based on standard BIS application checklists. It is NOT a BIS approval score and does not guarantee licence grant. Final granting of standard mark licences is subject to physical verification and official scrutiny by BIS officers.")}
          </div>
        </div>

        {/* Readiness Meter Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bis-border shadow-custom-lg mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Score Meter (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider">
                {t("readConsolidated", "Consolidated Readiness Indicator")}
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="font-serif-title text-5xl sm:text-6xl font-bold text-bis-slate">
                  {readinessPercent}%
                </span>
                <div>
                  <span className="text-xs font-bold text-bis-sage-dark uppercase block">
                    {t("readAdvancedStage", "Advanced Stage")}
                  </span>
                  <span className="text-xs text-bis-slate-muted">
                    {totalReady} / {totalTasks} {t("readSatisfiedCount", "checklist parameters satisfied")}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-bis-cream-dark h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-bis-burgundy h-full rounded-full transition-all duration-500" 
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>

              <p className="text-xs text-bis-slate-muted leading-relaxed">
                Target Product: <strong className="text-bis-slate">Instant Electric Storage Geyser 15L</strong> under <strong className="text-bis-burgundy font-mono">IS 302 (Part 2/Sec 21)</strong>.
              </p>
            </div>

            {/* Right Summary Columns (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-bis-cream border border-bis-border space-y-2">
                    <Icon className={`w-5 h-5 ${pillar.color}`} />
                    <div>
                      <span className="font-bold text-bis-slate block text-[11px] leading-tight">
                        {pillar.title.split("&")[0]}
                      </span>
                      <span className="text-[10px] text-bis-slate-muted">
                        {pillar.readyCount}/{pillar.totalCount} Complete
                      </span>
                    </div>
                    <div className="pt-1 border-t border-bis-border/50 text-[10px] font-semibold text-bis-slate-muted">
                      Weight: {pillar.weight}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Detailed 4-Pillar Breakdown */}
        <div className="space-y-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 sm:p-7 border border-bis-border shadow-custom-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bis-border/60 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-bis-cream text-bis-slate">
                      <Icon className={`w-4 h-4 ${pillar.color}`} />
                    </div>
                    <div>
                      <h3 className="font-serif-title text-base font-semibold text-bis-slate">
                        {pillar.title}
                      </h3>
                      <span className="text-[11px] text-bis-slate-muted">
                        Evaluation Weight: {pillar.weight} • {pillar.readyCount} of {pillar.totalCount} items verified
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-bis-cream border border-bis-border text-bis-slate self-start sm:self-auto">
                    {Math.round((pillar.readyCount / pillar.totalCount) * 100)}% Fulfilled
                  </span>
                </div>

                {/* Checklist items */}
                <div className="space-y-2.5">
                  {pillar.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      onClick={() => handleToggleTask(pillar.title, item.task, item.status)}
                      className="p-3.5 rounded-2xl bg-bis-cream border border-bis-border hover:border-bis-burgundy/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          {item.status === "ready" && (
                            <CheckCircle2 className="w-4 h-4 text-bis-sage-dark flex-shrink-0" />
                          )}
                          {item.status === "attention" && (
                            <AlertTriangle className="w-4 h-4 text-bis-terracotta flex-shrink-0" />
                          )}
                          <span className="font-semibold text-bis-slate">{item.task}</span>
                        </div>
                        <p className="text-[11px] text-bis-slate-muted pl-6">
                          {item.note}
                        </p>
                      </div>

                      <div className="pl-6 sm:pl-0 flex-shrink-0">
                        {item.status === "ready" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bis-sage-light text-bis-sage-dark">
                            Ready
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bis-gold-light text-bis-terracotta border border-bis-gold/40">
                            Needs Attention
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Action Roadmap */}
        <div className="mt-8 bg-bis-cream-dark/70 rounded-3xl p-6 sm:p-8 border border-bis-border space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-bis-slate uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-bis-burgundy" />
            <span>Recommended Next Action Items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-bis-border space-y-1.5">
              <span className="text-[10px] font-bold text-bis-terracotta uppercase">Priority 1</span>
              <h4 className="font-semibold text-bis-slate">Recalibrate Environmental Chamber</h4>
              <p className="text-bis-slate-muted text-[11px] leading-relaxed">
                Contact NABL accredited calibration facility to update calibration certificate before physical audit.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-bis-border space-y-1.5">
              <span className="text-[10px] font-bold text-bis-gold uppercase">Priority 2</span>
              <h4 className="font-semibold text-bis-slate">Obtain Destructive Test Certificate</h4>
              <p className="text-bis-slate-muted text-[11px] leading-relaxed">
                Commission thermal runaway external test at an accredited BIS recognized electrical testing laboratory.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-bis-border space-y-1.5">
              <span className="text-[10px] font-bold text-bis-sage-dark uppercase">Priority 3</span>
              <h4 className="font-semibold text-bis-slate">Review Scheme I Filing Checklist</h4>
              <p className="text-bis-slate-muted text-[11px] leading-relaxed">
                Finalize online application on Manakonline with authenticated digital signatures.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-end gap-3 text-xs">
            <Link
              href="/labs"
              className="px-4 py-2 bg-bis-burgundy text-white font-semibold rounded-full hover:bg-bis-burgundy-light transition-all shadow-sm"
            >
              Locate Lab for Missing Test
            </Link>
            <Link
              href="/certification"
              className="px-4 py-2 bg-white border border-bis-border text-bis-slate font-semibold rounded-full hover:bg-bis-cream transition-all"
            >
              Review Certification Steps
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
