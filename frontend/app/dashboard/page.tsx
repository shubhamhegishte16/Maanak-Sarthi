"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge, { StandardStatus } from "@/components/shared/StatusBadge";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import { 
  Bookmark, 
  Clock, 
  FileText, 
  CheckCircle2, 
  BarChart3, 
  FlaskConical, 
  Bell, 
  MessageSquare, 
  ArrowRight, 
  Building, 
  UserCheck, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Plus
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "standards" | "compliance" | "docs">("overview");

  const user = {
    name: "Rajesh Sharma",
    company: "Acme Manufacturing & Appliances Pvt Ltd",
    role: "Compliance Officer / Manufacturer",
    email: "rajesh@acmemfg.in",
    licenceType: "ISI Scheme I Applicant",
  };

  const savedStandards = [
    { isNumber: "IS 302 (Part 2/Sec 21):2018", title: "Safety of Household Electric Water Heaters", status: "mandatory_qco" as StandardStatus, dateAdded: "02 Sep 2026", scheme: "Scheme I (ISI)" },
    { isNumber: "IS 16046 (Part 2):2018", title: "Secondary Lithium Cells & Batteries for Portable Applications", status: "mandatory_crs" as StandardStatus, dateAdded: "28 Aug 2026", scheme: "Scheme II (CRS)" },
    { isNumber: "IS 17526:2021", title: "Stainless Steel Vacuum Flasks and Insulated Bottles", status: "mandatory_qco" as StandardStatus, dateAdded: "15 Aug 2026", scheme: "Scheme I (ISI)" },
  ];

  const recentSearches = [
    { query: "Stainless steel water bottle DPIIT QCO timeline", timestamp: "Yesterday, 4:20 PM", module: "AI Assistant", href: "/assistant" },
    { query: "Secondary lithium cell overcharge testing clause", timestamp: "3 days ago", module: "Document Analyzer", href: "/document-analyzer" },
    { query: "NABL accredited labs in Maharashtra for IS 302", timestamp: "5 days ago", module: "BIS Lab Finder", href: "/labs" },
  ];

  const savedProducts = [
    { name: "Instant Electric Geyser 15L", model: "ACM-EG-15", standard: "IS 302 (Part 2/Sec 21)", readiness: "78%", status: "Docs In Review" },
    { name: "Portable Power Bank 20000mAh", model: "ACM-PB-20K", standard: "IS 16046 (Part 2)", readiness: "92%", status: "Lab Report Validated" },
  ];

  const recentAlerts = [
    { title: "Amendment 2 Published for IS 302 Part 2", date: "08 Sep 2026", category: "Standard Revision", unread: true },
    { title: "Gazette Enforcement Deadline approaching for Cookware QCO", date: "04 Sep 2026", category: "QCO Notification", unread: false },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar user={user} />

      <PageHeader
        title={t("dashTitle", "Manufacturer")}
        italicWord={t("dashItalic", "Dashboard")}
        description={t("dashSubtitle", "Monitor saved Indian Standards, tracked products, document audit checklists, and testing laboratory pipelines across your manufacturing portfolio.")}
        badgeText={t("dashBadge", "Authenticated Workspace • Acme Manufacturing Pvt Ltd")}
        breadcrumbs={[{ label: t("dashboard", "My Dashboard") }]}
        actions={
          <div className="flex items-center space-x-2">
            <Link
              href="/find-standard"
              className="px-4 py-2 bg-bis-burgundy text-white text-xs font-semibold rounded-full hover:bg-bis-burgundy-light transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("dashTrackNew", "Track New Product")}</span>
            </Link>
          </div>
        }
      />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* User Identity Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-bis-border shadow-custom-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-bis-cream-dark text-bis-burgundy flex items-center justify-center font-bold text-xl border border-bis-border">
              RS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif-title text-xl font-bold text-bis-slate">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-bis-sage-light text-bis-sage-dark text-[10px] font-bold uppercase tracking-wider">
                  {t("dashVerifiedEntity", "Verified Entity")}
                </span>
              </div>
              <p className="text-xs text-bis-slate-muted mt-0.5">
                {user.company} • <span className="font-medium text-bis-slate">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="p-3 rounded-2xl bg-bis-cream border border-bis-border text-center">
              <span className="text-[10px] text-bis-slate-muted uppercase block">{t("dashTrackedCount", "Active Tracked Standards")}</span>
              <span className="font-mono text-base font-bold text-bis-burgundy">3 Standards</span>
            </div>
            <div className="p-3 rounded-2xl bg-bis-cream border border-bis-border text-center">
              <span className="text-[10px] text-bis-slate-muted uppercase block">{t("dashPortfolioAvg", "Average Readiness")}</span>
              <span className="font-mono text-base font-bold text-bis-sage-dark">85%</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Layout (12 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center Column: Core Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Saved Standards Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-bis-border shadow-custom-sm space-y-4">
              <div className="flex items-center justify-between border-b border-bis-border/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Bookmark className="w-4 h-4 text-bis-burgundy" />
                  <h3 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate">
                    Saved Indian Standards ({savedStandards.length})
                  </h3>
                </div>
                <Link href="/standards" className="text-xs font-semibold text-bis-burgundy hover:underline flex items-center space-x-1">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {savedStandards.map((std, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-bis-cream border border-bis-border hover:border-bis-burgundy/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-bis-burgundy bg-bis-burgundy/10 px-2 py-0.5 rounded">
                          {std.isNumber}
                        </span>
                        <StatusBadge status={std.status} />
                      </div>
                      <h4 className="text-xs font-semibold text-bis-slate">
                        {std.title}
                      </h4>
                      <div className="text-[11px] text-bis-slate-muted">
                        Scheme: <span className="font-medium text-bis-slate">{std.scheme}</span> • Added {std.dateAdded}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Link
                        href={`/compliance?standard=${encodeURIComponent(std.isNumber)}`}
                        className="px-3 py-1.5 bg-white hover:bg-bis-cream-dark border border-bis-border rounded-xl text-xs font-semibold text-bis-slate transition-colors"
                      >
                        Check Compliance
                      </Link>
                      <Link
                        href={`/certification?standard=${encodeURIComponent(std.isNumber)}`}
                        className="p-1.5 bg-bis-burgundy text-white rounded-xl hover:bg-bis-burgundy-light transition-colors"
                        title="Certification Steps"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Products Portfolio */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-bis-border shadow-custom-sm space-y-4">
              <div className="flex items-center justify-between border-b border-bis-border/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-bis-gold" />
                  <h3 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate">
                    Monitored Manufacturing Products
                  </h3>
                </div>
                <Link href="/find-standard" className="text-xs font-semibold text-bis-burgundy hover:underline">
                  + Add Product
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedProducts.map((prod, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-bis-cream border border-bis-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-bis-slate">{prod.name}</span>
                      <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-bis-border text-bis-slate-muted">
                        {prod.model}
                      </span>
                    </div>

                    <div className="text-[11px] text-bis-slate-muted">
                      Target: <span className="font-mono text-bis-burgundy font-semibold">{prod.standard}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-bis-slate-muted block">Readiness</span>
                        <span className="font-bold text-bis-sage-dark">{prod.readiness}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-bis-sage-light text-bis-sage-dark text-[10px] font-semibold">
                        {prod.status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-bis-border/50">
                      <Link
                        href="/application-readiness"
                        className="text-[11px] font-semibold text-bis-burgundy hover:underline inline-flex items-center space-x-1"
                      >
                        <span>View Readiness Audit</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Searches & Query Trails */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-bis-border shadow-custom-sm space-y-4">
              <div className="flex items-center justify-between border-b border-bis-border/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-bis-slate-muted" />
                  <h3 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate">
                    Recent AI Inquiries & Search History
                  </h3>
                </div>
              </div>

              <div className="divide-y divide-bis-border/50 text-xs">
                {recentSearches.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <Link href={item.href} className="font-medium text-bis-slate hover:text-bis-burgundy transition-colors line-clamp-1">
                        "{item.query}"
                      </Link>
                      <div className="text-[11px] text-bis-slate-muted mt-0.5">
                        Module: <span className="text-bis-slate font-semibold">{item.module}</span> • {item.timestamp}
                      </div>
                    </div>
                    <Link href={item.href} className="p-1.5 rounded-full hover:bg-bis-cream text-bis-slate-muted hover:text-bis-burgundy transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Alerts, Readiness & Shortcuts (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Application Readiness Quick Card */}
            <div className="bg-white rounded-3xl p-6 border border-bis-border shadow-custom-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-bis-slate">
                  Overall Compliance Readiness
                </span>
                <BarChart3 className="w-4 h-4 text-bis-sage" />
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="font-serif-title text-4xl font-bold text-bis-slate">74%</span>
                <span className="text-xs text-bis-slate-muted">Application Dossier Prepared</span>
              </div>

              <div className="w-full bg-bis-cream-dark h-2 rounded-full overflow-hidden">
                <div className="bg-bis-burgundy h-full rounded-full w-[74%]" />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-bis-slate">
                  <span>Factory Machinery List</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-bis-sage" />
                </div>
                <div className="flex items-center justify-between text-bis-slate">
                  <span>In-House Lab Calibration</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-bis-sage" />
                </div>
                <div className="flex items-center justify-between text-bis-slate">
                  <span>Independent Lab Test Report</span>
                  <span className="text-[11px] text-bis-terracotta font-semibold">Needs Attention</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/application-readiness"
                  className="w-full py-2.5 bg-bis-cream hover:bg-bis-cream-dark border border-bis-border text-bis-burgundy text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Open Full Readiness Checklist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Regulatory Alerts Strip */}
            <div className="bg-white rounded-3xl p-6 border border-bis-border shadow-custom-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-bis-slate">
                  <Bell className="w-4 h-4 text-bis-burgundy" />
                  <span>Monitored Alerts</span>
                </div>
                <Link href="/updates" className="text-[11px] text-bis-burgundy font-semibold hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentAlerts.map((alt, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-bis-cream border border-bis-border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-bis-burgundy uppercase">
                        {alt.category}
                      </span>
                      {alt.unread && (
                        <span className="w-2 h-2 rounded-full bg-bis-burgundy" />
                      )}
                    </div>
                    <p className="font-semibold text-bis-slate leading-snug">
                      {alt.title}
                    </p>
                    <span className="text-[10px] text-bis-slate-muted block">
                      Published: {alt.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="bg-bis-cream-dark/70 rounded-3xl p-6 border border-bis-border space-y-3 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-bis-slate-muted block">
                Direct Module Access
              </span>

              <Link
                href="/assistant"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-bis-border hover:border-bis-burgundy transition-colors text-bis-slate"
              >
                <span>Ask AI Assistant</span>
                <ArrowRight className="w-3.5 h-3.5 text-bis-slate-muted" />
              </Link>
              <Link
                href="/document-analyzer"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-bis-border hover:border-bis-burgundy transition-colors text-bis-slate"
              >
                <span>Analyze Test Report / QCO</span>
                <ArrowRight className="w-3.5 h-3.5 text-bis-slate-muted" />
              </Link>
              <Link
                href="/compare"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-bis-border hover:border-bis-burgundy transition-colors text-bis-slate"
              >
                <span>Compare Two Standards</span>
                <ArrowRight className="w-3.5 h-3.5 text-bis-slate-muted" />
              </Link>
              <Link
                href="/labs"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-bis-border hover:border-bis-burgundy transition-colors text-bis-slate"
              >
                <span>Find Regional Testing Labs</span>
                <ArrowRight className="w-3.5 h-3.5 text-bis-slate-muted" />
              </Link>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
