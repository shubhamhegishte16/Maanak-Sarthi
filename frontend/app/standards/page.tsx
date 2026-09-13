"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge, { StandardStatus } from "@/components/shared/StatusBadge";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  SlidersHorizontal, 
  ArrowRight, 
  Calendar, 
  ExternalLink, 
  FlaskConical, 
  Settings, 
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface IndianStandard {
  isNumber: string;
  title: string;
  year: string;
  category: string;
  status: StandardStatus;
  scope: string;
  amendmentsCount: number;
  lastAmendmentDate?: string;
  mandatoryQCO: boolean;
  qcoName?: string;
  stiAvailable: boolean;
  relatedStandards: string[];
  recognizedLabsCount: number;
  lastVerified: string;
}

const STANDARDS_DATABASE: IndianStandard[] = [
  {
    isNumber: "IS 302 (Part 1):2024",
    title: "Safety of Household and Similar Electrical Appliances — General Requirements",
    year: "2024",
    category: "Electrical & Electronics",
    status: "mandatory_qco",
    scope: "Deals with the safety of electrical appliances for household and similar purposes, their rated voltage being not more than 250 V for single-phase and 480 V for other appliances.",
    amendmentsCount: 3,
    lastAmendmentDate: "June 2025",
    mandatoryQCO: true,
    qcoName: "Electrical Appliances (Quality Control) Order, 2023",
    stiAvailable: true,
    relatedStandards: ["IS 302 (Part 2 series)", "IS 616", "IS 15885"],
    recognizedLabsCount: 24,
    lastVerified: "01/09/2026"
  },
  {
    isNumber: "IS 302 (Part 2/Sec 21):2018",
    title: "Particular Requirements — Storage Water Heaters",
    year: "2018",
    category: "Electrical & Electronics",
    status: "mandatory_isi",
    scope: "Applies to electric storage water heaters for household and similar purposes intended for heating water below its boiling temperature, their rated voltage being not more than 250 V.",
    amendmentsCount: 2,
    lastAmendmentDate: "January 2024",
    mandatoryQCO: true,
    qcoName: "Geysers and Water Heaters QCO",
    stiAvailable: true,
    relatedStandards: ["IS 302 (Part 1)", "IS 2082"],
    recognizedLabsCount: 14,
    lastVerified: "05/09/2026"
  },
  {
    isNumber: "IS 16046 (Part 2):2018",
    title: "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes (Lithium Systems)",
    year: "2018",
    category: "Electronics & IT Goods",
    status: "mandatory_crs",
    scope: "Specifies requirements and tests for the safe operation of portable sealed secondary lithium cells and batteries for use in portable electronic applications.",
    amendmentsCount: 1,
    lastAmendmentDate: "November 2023",
    mandatoryQCO: true,
    qcoName: "Electronics and IT Goods (Requirement for Compulsory Registration) Order",
    stiAvailable: false,
    relatedStandards: ["IEC 62133-2:2017", "IS 16046 (Part 1)"],
    recognizedLabsCount: 18,
    lastVerified: "01/09/2026"
  },
  {
    isNumber: "IS 17526:2021",
    title: "Stainless Steel Vacuum Flasks and Insulated Bottles — Specification",
    year: "2021",
    category: "Consumer Utensils",
    status: "mandatory_qco",
    scope: "Prescribes requirements, sampling procedures, and tests for double walled stainless steel vacuum insulated flasks and bottles for domestic potable liquid storage.",
    amendmentsCount: 0,
    mandatoryQCO: true,
    qcoName: "Cookware and Utensils (Quality Control) Order, 2024",
    stiAvailable: true,
    relatedStandards: ["IS 6911", "IS 10146"],
    recognizedLabsCount: 8,
    lastVerified: "20/08/2026"
  },
  {
    isNumber: "IS 4151:2020",
    title: "Protective Helmets for Two-Wheeler Motorists — Specification",
    year: "2020",
    category: "Automotive & Personal Protection",
    status: "mandatory_isi",
    scope: "Lays down the requirements for protective helmets for two-wheeler motor vehicle riders, covering shock absorption, chin strap retention, and peripheral vision.",
    amendmentsCount: 2,
    lastAmendmentDate: "August 2024",
    mandatoryQCO: true,
    qcoName: "Helmet for Two-Wheeler Motor Vehicle (Quality Control) Order",
    stiAvailable: true,
    relatedStandards: ["IS 9944", "IS 460"],
    recognizedLabsCount: 11,
    lastVerified: "02/09/2026"
  },
  {
    isNumber: "IS 269:2015",
    title: "Ordinary Portland Cement (33, 43 and 53 Grade) — Specification",
    year: "2015",
    category: "Building Materials & Civil",
    status: "mandatory_isi",
    scope: "Covers the manufacture and chemical & physical requirements for 33, 43, and 53 grade ordinary Portland cement widely used in construction.",
    amendmentsCount: 4,
    lastAmendmentDate: "May 2025",
    mandatoryQCO: true,
    qcoName: "Cement (Quality Control) Order",
    stiAvailable: true,
    relatedStandards: ["IS 4031 (Parts 1 to 15)", "IS 4032"],
    recognizedLabsCount: 35,
    lastVerified: "01/09/2026"
  },
  {
    isNumber: "IS 10500:2012",
    title: "Drinking Water — Specification",
    year: "2012",
    category: "Food, Water & Agriculture",
    status: "voluntary",
    scope: "Prescribes the acceptable and permissible limits for essential physicochemical, bacteriological, and radioactive parameters in drinking water.",
    amendmentsCount: 3,
    lastAmendmentDate: "March 2024",
    mandatoryQCO: false,
    stiAvailable: true,
    relatedStandards: ["IS 3025 series", "IS 1622"],
    recognizedLabsCount: 65,
    lastVerified: "04/09/2026"
  },
  {
    isNumber: "IS 15885 (Part 2/Sec 13):2012",
    title: "Lamp Controlgear — Particular Requirements for DC or AC Supplied Electronic Controlgear for LED Modules",
    year: "2012",
    category: "Electrical & Electronics",
    status: "mandatory_crs",
    scope: "Specifies safety and performance characteristics for electronic controlgear (drivers) powering LED lighting modules.",
    amendmentsCount: 1,
    mandatoryQCO: true,
    qcoName: "MeitY CRS Mandate for LED Luminaires",
    stiAvailable: false,
    relatedStandards: ["IS 16102", "IEC 61347-2-13"],
    recognizedLabsCount: 19,
    lastVerified: "25/08/2026"
  }
];

const CATEGORIES = [
  "All Categories",
  "Electrical & Electronics",
  "Electronics & IT Goods",
  "Consumer Utensils",
  "Automotive & Personal Protection",
  "Building Materials & Civil",
  "Food, Water & Agriculture"
];

function StandardsExplorerContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filterMandatoryOnly, setFilterMandatoryOnly] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<IndianStandard | null>(null);

  const filteredStandards = useMemo(() => {
    return STANDARDS_DATABASE.filter((std) => {
      const matchSearch =
        std.isNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.scope.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "All Categories" || std.category === selectedCategory;

      const matchMandatory = !filterMandatoryOnly || std.mandatoryQCO;

      return matchSearch && matchCategory && matchMandatory;
    });
  }, [searchQuery, selectedCategory, filterMandatoryOnly]);

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("stdTitle", "Standards")}
        italicWord={t("stdItalic", "Explorer")}
        description={t("stdSubtitle", "Search, inspect, and verify published Indian Standards (IS), gazetted amendments, applicable certification schemes, and testing network scope.")}
        badgeText={t("stdBadge", "National Catalog • Know Your Standard")}
        breadcrumbs={[{ label: t("standards", "Standards Explorer") }]}
      />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-bis-border shadow-custom-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-bis-slate-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("stdPlaceholder", "Search by IS number (e.g. IS 302, IS 16046), product keyword, or application...")}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-bis-cream border border-bis-border focus:outline-none focus:border-bis-burgundy text-xs sm:text-sm text-bis-slate"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-bis-slate-muted hover:text-bis-slate"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <label className="flex items-center space-x-2 text-xs font-semibold text-bis-slate cursor-pointer px-4 py-3 rounded-full bg-bis-cream border border-bis-border hover:bg-bis-cream-dark transition-colors flex-shrink-0">
              <input
                type="checkbox"
                checked={filterMandatoryOnly}
                onChange={(e) => setFilterMandatoryOnly(e.target.checked)}
                className="rounded text-bis-burgundy focus:ring-bis-burgundy"
              />
              <span>{t("stdMandatoryOnly", "Mandatory QCO Only")}</span>
            </label>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-bis-burgundy text-white shadow-2xs font-semibold"
                    : "bg-bis-cream hover:bg-bis-cream-dark text-bis-slate border border-bis-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Meta */}
        <div className="flex items-center justify-between mb-4 text-xs text-bis-slate-muted">
          <div>
            {t("stdShowingCount", "Showing Standards matching query")}: <span className="font-bold text-bis-slate">{filteredStandards.length}</span>
          </div>
          <span className="italic">{t("officialSource", "Official BIS Source")}</span>
        </div>

        {/* Standards Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredStandards.map((std) => (
            <div
              key={std.isNumber}
              className="bg-white rounded-3xl p-6 border border-bis-border hover:border-bis-burgundy shadow-custom-sm hover:shadow-custom-lg transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bis-border/60 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-bis-burgundy bg-bis-burgundy/10 px-2.5 py-1 rounded-lg">
                      {std.isNumber}
                    </span>
                    <span className="text-[11px] font-mono text-bis-slate-muted">
                      ({std.year})
                    </span>
                  </div>
                  <StatusBadge status={std.status} />
                </div>

                {/* Title & Category */}
                <div>
                  <h3 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate group-hover:text-bis-burgundy transition-colors leading-snug">
                    {std.title}
                  </h3>
                  <span className="inline-block mt-1 text-[11px] font-medium text-bis-slate-muted bg-bis-cream px-2 py-0.5 rounded border border-bis-border">
                    {std.category}
                  </span>
                </div>

                {/* Scope Description */}
                <p className="text-xs text-bis-slate-muted leading-relaxed line-clamp-3">
                  {std.scope}
                </p>

                {/* Metadata Strip */}
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-bis-cream p-2 rounded-xl border border-bis-border/60">
                    <span className="text-bis-slate-muted block text-[10px]">{t("stdAmendmentsStatus", "Amendments")}</span>
                    <span className="font-semibold text-bis-slate">
                      {std.amendmentsCount > 0 ? `${std.amendmentsCount} Notified` : "None"}
                    </span>
                  </div>
                  <div className="bg-bis-cream p-2 rounded-xl border border-bis-border/60">
                    <span className="text-bis-slate-muted block text-[10px]">{t("stdStiStatus", "Testing Scheme")}</span>
                    <span className="font-semibold text-bis-slate">
                      {std.stiAvailable ? "STI Published" : "CRS Lab Protocol"}
                    </span>
                  </div>
                  <div className="bg-bis-cream p-2 rounded-xl border border-bis-border/60 col-span-2 sm:col-span-1">
                    <span className="text-bis-slate-muted block text-[10px]">{t("labs", "Accredited Labs")}</span>
                    <span className="font-semibold text-bis-sage-dark">
                      {std.recognizedLabsCount} Facilities
                    </span>
                  </div>
                </div>

                {std.mandatoryQCO && std.qcoName && (
                  <div className="bg-bis-burgundy/5 p-2.5 rounded-xl border border-bis-burgundy/15 text-[11px] text-bis-slate flex items-start space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-bis-burgundy flex-shrink-0 mt-0.5" />
                    <span><strong className="text-bis-burgundy">QCO:</strong> {std.qcoName}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-bis-border/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => setSelectedStandard(std)}
                  className="font-semibold text-bis-burgundy hover:underline inline-flex items-center space-x-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t("stdKnowStandard", "Know Your Standard (Full Details)")}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/certification?standard=${encodeURIComponent(std.isNumber)}`}
                    className="p-1.5 text-bis-slate-muted hover:text-bis-burgundy hover:bg-bis-cream rounded-lg transition-colors"
                    title="Certification Scheme"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/labs?standard=${encodeURIComponent(std.isNumber)}`}
                    className="p-1.5 text-bis-slate-muted hover:text-bis-burgundy hover:bg-bis-cream rounded-lg transition-colors"
                    title="Testing Labs"
                  >
                    <FlaskConical className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredStandards.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-bis-border space-y-3">
            <BookOpen className="w-10 h-10 text-bis-slate-muted mx-auto" />
            <h3 className="font-serif-title text-lg font-semibold text-bis-slate">
              No Indian Standards Found
            </h3>
            <p className="text-xs text-bis-slate-muted max-w-sm mx-auto">
              No matches found for "{searchQuery}". Try using the standard number or general category term.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setFilterMandatoryOnly(false);
              }}
              className="px-4 py-2 bg-bis-burgundy text-white text-xs font-semibold rounded-full hover:bg-bis-burgundy-light transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Know Your Standard Detailed Drawer / Modal */}
      {selectedStandard && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-bis-border shadow-custom-lg p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between border-b border-bis-border pb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-sm font-bold text-bis-burgundy bg-bis-burgundy/10 px-2.5 py-0.5 rounded">
                    {selectedStandard.isNumber}
                  </span>
                  <StatusBadge status={selectedStandard.status} />
                </div>
                <h3 className="font-serif-title text-lg sm:text-xl font-bold text-bis-slate">
                  {selectedStandard.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStandard(null)}
                className="p-1.5 rounded-full hover:bg-bis-cream text-bis-slate-muted hover:text-bis-slate transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-bis-slate">
              <div>
                <span className="font-bold text-bis-slate-muted uppercase tracking-wider text-[10px] block mb-1">
                  Scope & Application
                </span>
                <p className="leading-relaxed bg-bis-cream p-3 rounded-xl border border-bis-border text-bis-slate">
                  {selectedStandard.scope}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-bis-cream p-3 rounded-xl border border-bis-border">
                  <span className="text-bis-slate-muted block text-[10px]">Amendments Status</span>
                  <span className="font-semibold text-bis-slate">
                    {selectedStandard.amendmentsCount} published ({selectedStandard.lastAmendmentDate || "No updates"})
                  </span>
                </div>
                <div className="bg-bis-cream p-3 rounded-xl border border-bis-border">
                  <span className="text-bis-slate-muted block text-[10px]">Testing Scheme (STI)</span>
                  <span className="font-semibold text-bis-slate">
                    {selectedStandard.stiAvailable ? "Scheme of Testing Available" : "CRS Lab Testing Protocol"}
                  </span>
                </div>
              </div>

              {selectedStandard.mandatoryQCO && (
                <div className="bg-bis-burgundy/5 p-3 rounded-xl border border-bis-burgundy/15">
                  <span className="font-bold text-bis-burgundy block mb-0.5">Government QCO Mandate</span>
                  <span>{selectedStandard.qcoName}</span>
                </div>
              )}

              <div>
                <span className="font-bold text-bis-slate-muted uppercase tracking-wider text-[10px] block mb-1">
                  Cross-Referenced Indian Standards
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStandard.relatedStandards.map((ref, idx) => (
                    <span key={idx} className="font-mono bg-bis-cream px-2 py-1 rounded border border-bis-border">
                      {ref}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-bis-border/60 flex items-center justify-between text-[11px] text-bis-slate-muted">
                <span>Last Verified against BIS Portal: {selectedStandard.lastVerified}</span>
                <ConfidenceBadge level="verified" />
              </div>
            </div>

            <div className="pt-3 border-t border-bis-border flex flex-wrap items-center justify-end gap-2 text-xs">
              <Link
                href={`/compliance?standard=${encodeURIComponent(selectedStandard.isNumber)}`}
                className="px-4 py-2 bg-bis-cream hover:bg-bis-cream-dark border border-bis-border text-bis-slate font-semibold rounded-full transition-colors"
              >
                Run Compliance Check
              </Link>
              <Link
                href={`/certification?standard=${encodeURIComponent(selectedStandard.isNumber)}`}
                className="px-4 py-2 bg-bis-burgundy text-white font-semibold rounded-full hover:bg-bis-burgundy-light transition-colors shadow-sm"
              >
                View Certification Path
              </Link>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

export default function StandardsExplorerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bis-cream flex items-center justify-center text-xs">Loading Standards...</div>}>
      <StandardsExplorerContent />
    </Suspense>
  );
}
