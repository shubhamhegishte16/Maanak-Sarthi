"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import { 
  Bell, 
  Filter, 
  FileText, 
  Award, 
  FlaskConical, 
  ExternalLink, 
  Calendar, 
  Check, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCheck
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type AlertCategory = "All" | "QCO" | "Amendments" | "Standards" | "Certification" | "Laboratories";

interface AlertNotification {
  id: string;
  category: "QCO" | "Amendments" | "Standards" | "Certification" | "Laboratories";
  title: string;
  standardReference?: string;
  gazetteOrder?: string;
  summary: string;
  datePublished: string;
  lastCheckedDate: string;
  sourceUrl: string;
  read: boolean;
  effectiveDeadline?: string;
}

const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: "alt-1",
    category: "QCO",
    title: "Cookware, Utensils and Canisters Quality Control Order Notified",
    standardReference: "IS 17526:2021 & IS 17803:2022",
    gazetteOrder: "DPIIT S.O. 1290(E)",
    summary: "Ministry of Commerce and Industry issues mandatory Scheme I standard mark order for all domestic manufacturers and importers of stainless steel insulated flasks and water bottles.",
    datePublished: "15 March 2024",
    lastCheckedDate: "05/09/2026",
    effectiveDeadline: "Mandatory from 15 September 2024 (Large/Medium) & 15 March 2025 (Micro/Small)",
    sourceUrl: "https://www.bis.gov.in",
    read: false
  },
  {
    id: "alt-2",
    category: "Amendments",
    title: "Amendment 3 Published for IS 302 (Part 1) General Safety",
    standardReference: "IS 302 (Part 1):2024",
    summary: "Clause 19.11 updated regarding self-resetting safety cut-out testing protocol and creepage distances on electronic controller circuits.",
    datePublished: "28 August 2026",
    lastCheckedDate: "06/09/2026",
    sourceUrl: "https://standardsbis.bsbedge.com",
    read: false
  },
  {
    id: "alt-3",
    category: "Standards",
    title: "Revised Edition Published: Secondary Lithium Cells and Batteries",
    standardReference: "IS 16046 (Part 2):2018 / Amd 1",
    summary: "Harmonization with updated IEC 62133-2 testing methods for continuous overcharging and short circuit testing thresholds.",
    datePublished: "10 August 2026",
    lastCheckedDate: "02/09/2026",
    sourceUrl: "https://standardsbis.bsbedge.com",
    read: true
  },
  {
    id: "alt-4",
    category: "Laboratories",
    title: "Recognition Extended for Central Marks Lab & 4 Regional Facilities",
    summary: "BIS grants 3-year extension of recognition scope for electrical appliance safety testing under IS 302 Part 2 series across Northern and Western regions.",
    datePublished: "22 July 2026",
    lastCheckedDate: "01/09/2026",
    sourceUrl: "https://www.bis.gov.in/bo-lab-webpage/",
    read: true
  },
  {
    id: "alt-5",
    category: "Certification",
    title: "Standardized Fee Guideline Issued for MSME Scheme I Licences",
    summary: "Department of Consumer Affairs announces 20% concession on marking fee for certified micro enterprises manufacturing QCO-regulated goods.",
    datePublished: "05 July 2026",
    lastCheckedDate: "30/08/2026",
    sourceUrl: "https://www.bis.gov.in",
    read: true
  }
];

const CATEGORIES: AlertCategory[] = ["All", "QCO", "Amendments", "Standards", "Certification", "Laboratories"];

export default function UpdatesAlertsPage() {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory>("All");
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const filteredAlerts = alerts.filter((item) => {
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchUnread = !filterUnreadOnly || !item.read;
    return matchCat && matchUnread;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const handleToggleRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a))
    );
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("upTitle", "Updates &")}
        italicWord={t("upItalic", "Alerts")}
        description={t("upSubtitle", "Monitor gazetted Quality Control Orders, standard amendments, committee revisions, and testing network updates relevant to your tracked portfolio.")}
        badgeText={t("upBadge", "Regulatory Intelligence • Gazette Tracking")}
        breadcrumbs={[{ label: t("updates", "Updates & Alerts") }]}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-white border border-bis-border text-bis-slate text-xs font-semibold rounded-full hover:bg-bis-cream flex items-center space-x-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-bis-sage-dark" />
              <span>{t("upMarkAllRead", "Mark All Read")}</span>
            </button>
          ) : undefined
        }
      />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Statutory Limitation Disclaimer */}
        <div className="p-4 rounded-2xl bg-bis-cream-dark border border-bis-border text-[11px] text-bis-slate-muted mb-8 leading-relaxed flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-bis-slate-muted flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-bis-slate">{t("advisoryNotice", "Tracking Notice")}:</span> {t("upNotice", "MANAK SAARTHI indexes published notifications from the official Gazette of India and BIS portal. This feed provides periodic regulatory updates and does not claim real-time continuous surveillance of unpublished draft proceedings.")}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-bis-border shadow-custom-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-bis-burgundy text-white font-semibold shadow-2xs"
                    : "bg-bis-cream hover:bg-bis-cream-dark text-bis-slate border border-bis-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="flex items-center space-x-2 text-xs font-semibold text-bis-slate cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterUnreadOnly}
              onChange={(e) => setFilterUnreadOnly(e.target.checked)}
              className="rounded text-bis-burgundy focus:ring-bis-burgundy"
            />
            <span>{t("upUnreadOnly", "Unread Only")} ({unreadCount})</span>
          </label>
        </div>

        {/* Alerts Feed */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-custom-sm hover:shadow-custom-lg space-y-3 ${
                !alert.read ? "border-bis-burgundy/40 ring-1 ring-bis-burgundy/10" : "border-bis-border"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                    alert.category === "QCO"
                      ? "bg-bis-burgundy/10 text-bis-burgundy"
                      : alert.category === "Amendments"
                      ? "bg-bis-terracotta/10 text-bis-terracotta"
                      : "bg-bis-sage/20 text-bis-sage-dark"
                  }`}>
                    {alert.category} Update
                  </span>

                  {!alert.read && (
                    <span className="w-2 h-2 rounded-full bg-bis-burgundy" />
                  )}

                  {alert.standardReference && (
                    <span className="font-mono text-xs font-bold text-bis-slate bg-bis-cream px-2 py-0.5 rounded border border-bis-border">
                      {alert.standardReference}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs text-bis-slate-muted">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-bis-gold" />
                    <span>Published: {alert.datePublished}</span>
                  </div>
                  <button
                    onClick={() => handleToggleRead(alert.id)}
                    className="hover:text-bis-burgundy transition-colors"
                  >
                    {alert.read ? "Mark as Unread" : "Mark as Read"}
                  </button>
                </div>
              </div>

              <h3 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate">
                {alert.title}
              </h3>

              {alert.gazetteOrder && (
                <div className="text-xs text-bis-slate-muted">
                  Order Reference: <span className="font-semibold text-bis-slate">{alert.gazetteOrder}</span>
                </div>
              )}

              <p className="text-xs text-bis-slate-muted leading-relaxed">
                {alert.summary}
              </p>

              {alert.effectiveDeadline && (
                <div className="bg-bis-gold-light p-3 rounded-2xl border border-bis-gold/30 text-xs text-bis-slate flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-bis-terracotta flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-bis-terracotta">Enforcement Timeline:</strong> {alert.effectiveDeadline}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-bis-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-bis-slate-muted">
                  Last Checked Date: {alert.lastCheckedDate}
                </span>

                <div className="flex items-center space-x-3">
                  <a
                    href={alert.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-bis-slate-muted hover:text-bis-burgundy transition-colors"
                  >
                    <span>View Gazette Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {alert.standardReference && (
                    <Link
                      href={`/standards?query=${encodeURIComponent(alert.standardReference.split(" ")[0])}`}
                      className="inline-flex items-center space-x-1 font-semibold text-bis-burgundy hover:underline"
                    >
                      <span>Explore Standard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-bis-border space-y-3">
              <Bell className="w-10 h-10 text-bis-slate-muted mx-auto" />
              <h4 className="font-serif-title text-lg font-semibold text-bis-slate">
                No Alerts Matching Selection
              </h4>
              <p className="text-xs text-bis-slate-muted">
                There are currently no active alerts under the "{selectedCategory}" category.
              </p>
            </div>
          )}
        </div>

      </div>

      <Footer />
    </main>
  );
}
