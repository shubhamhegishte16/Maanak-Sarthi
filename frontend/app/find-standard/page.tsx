"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import StatusBadge, { StandardStatus } from "@/components/shared/StatusBadge";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Settings, 
  FlaskConical, 
  AlertCircle, 
  SlidersHorizontal,
  ChevronRight,
  HelpCircle,
  RotateCcw
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface StandardResult {
  id: string;
  isNumber: string;
  title: string;
  year: string;
  status: StandardStatus;
  scopeRelevance: string;
  confidence: "high" | "medium" | "low";
  mandatoryQCO: boolean;
  qcoReference?: string;
  relatedStandards: string[];
  keyRequirements: string[];
  evidenceExcerpt: string;
}

const PRESET_PRODUCTS = [
  {
    label: "Stainless Steel Water Bottles",
    product: "Vacuum-insulated stainless steel flask & water bottles",
    material: "Stainless Steel (Grade 304 / 316)",
    industry: "Consumer Goods & Utensils",
    intendedUse: "Food and liquid storage for domestic and travel use",
  },
  {
    label: "Lithium-Ion Power Bank",
    product: "Portable lithium-ion rechargeable battery pack",
    material: "Lithium Cobalt / NMC Cells & Plastic casing",
    industry: "Electronics & IT Goods",
    intendedUse: "Power backup for mobile electronics",
  },
  {
    label: "Domestic Solar Water Heater",
    product: "Evacuated tube collector solar water heating system",
    material: "Borosilicate glass & stainless steel manifold",
    industry: "Renewable Energy & Appliances",
    intendedUse: "Residential thermal water heating",
  },
  {
    label: "Two-Wheeler Motorcycle Helmet",
    product: "Full face protective helmet for two-wheeler motorists",
    material: "Expanded Polystyrene (EPS) & Polycarbonate shell",
    industry: "Automotive & Personal Protection",
    intendedUse: "Head protection against vehicular impact",
  },
];

const MOCK_RESULTS: Record<string, StandardResult[]> = {
  "Stainless Steel Water Bottles": [
    {
      id: "std-1",
      isNumber: "IS 17526:2021",
      title: "Stainless Steel Vacuum Flasks and Insulated Bottles — Specification",
      year: "2021",
      status: "mandatory_qco",
      scopeRelevance: "Direct match for double-wall stainless steel vacuum insulated bottles and flasks.",
      confidence: "high",
      mandatoryQCO: true,
      qcoReference: "Cookware and Utensils (Quality Control) Order, 2024",
      relatedStandards: ["IS 6911 (Stainless Steel Plate, Sheet and Strip)", "IS 10146 (Food Contact Polymers)"],
      keyRequirements: [
        "Material compatibility test for food grade stainless steel (min 18% Cr, 8% Ni)",
        "Thermal retention test: liquid temperature > 60°C after 6 hours",
        "Drop impact and leakage resistance tests"
      ],
      evidenceExcerpt: "As per the Department for Promotion of Industry and Internal Trade (DPIIT) notification, no person shall manufacture, import, or store insulated flasks without BIS standard mark.",
    },
    {
      id: "std-2",
      isNumber: "IS 17803:2022",
      title: "Single Walled Stainless Steel Water Bottles — Specification",
      year: "2022",
      status: "mandatory_qco",
      scopeRelevance: "Applies if the flask is single-walled (non-vacuum insulated).",
      confidence: "medium",
      mandatoryQCO: true,
      qcoReference: "DPIIT QCO 2024",
      relatedStandards: ["IS 6911", "IS 3434"],
      keyRequirements: [
        "Toxic heavy metal leaching test limits",
        "Corrosion resistance against acidic beverages",
        "Cap seal tightness under positive pressure"
      ],
      evidenceExcerpt: "Single walled bottles manufactured for potable drinking water are subject to Scheme I ISI certification.",
    }
  ],
  default: [
    {
      id: "std-def-1",
      isNumber: "IS 302 (Part 1):2024",
      title: "Safety of Household and Similar Electrical Appliances — General Requirements",
      year: "2024",
      status: "mandatory_qco",
      scopeRelevance: "General safety benchmark applicable across household consumer electrical apparatus.",
      confidence: "high",
      mandatoryQCO: true,
      qcoReference: "Electrical Appliances (Quality Control) Order",
      relatedStandards: ["IS 302 (Part 2 series)", "IS 616"],
      keyRequirements: [
        "Protection against electric shock under high humidity",
        "Insulation resistance and dielectric strength",
        "Flame retardance of insulating materials"
      ],
      evidenceExcerpt: "Products within this electrical class require valid BIS ISI registration prior to commercial distribution.",
    },
    {
      id: "std-def-2",
      isNumber: "IS 16046 (Part 2):2018",
      title: "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes",
      year: "2018",
      status: "mandatory_crs",
      scopeRelevance: "Potentially applicable if the device contains rechargeable secondary battery modules.",
      confidence: "medium",
      mandatoryQCO: true,
      qcoReference: "MeitY Electronic Products CRS Mandate",
      relatedStandards: ["IS 16046 (Part 1)", "IEC 62133-2"],
      keyRequirements: [
        "Overcharge protection circuit verification",
        "Vibration and mechanical shock resistance",
        "Continuous charging under extreme ambient temperatures"
      ],
      evidenceExcerpt: "Compulsory Registration Scheme (CRS) applies to all portable electronic power packs.",
    }
  ]
};

export default function FindStandardPage() {
  const { t } = useLanguage();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [industry, setIndustry] = useState("");
  const [intendedUse, setIntendedUse] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<StandardResult[]>([]);

  const handleApplyPreset = (preset: typeof PRESET_PRODUCTS[0]) => {
    setProductName(preset.label);
    setDescription(preset.product);
    setMaterial(preset.material);
    setIndustry(preset.industry);
    setIntendedUse(preset.intendedUse);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() && !description.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      const match = MOCK_RESULTS[productName] || MOCK_RESULTS.default;
      setResults(match);
      setIsSearching(false);
    }, 600);
  };

  const handleReset = () => {
    setProductName("");
    setDescription("");
    setMaterial("");
    setIndustry("");
    setIntendedUse("");
    setHasSearched(false);
    setResults([]);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("findTitle", "Find My")}
        italicWord={t("findItalic", "Standard")}
        description={t("findSubtitle", "Convert your natural-language product description, composition, and intended application into potentially applicable Indian Standards and QCO requirements.")}
        badgeText={t("findBadge", "Discovery Module • Know Your Standard")}
        breadcrumbs={[{ label: t("findStandard", "Find My Standard") }]}
      />

      <div className="flex-grow max-w-[1536px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Preset quick buttons */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-bis-slate-muted uppercase tracking-wider mb-3">
            {t("findTryPreset", "Try a sample manufacturing scenario:")}
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_PRODUCTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-bis-cream-dark text-bis-slate border border-bis-border hover:border-bis-burgundy transition-all shadow-2xs"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Product Intake Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-bis-border shadow-custom-lg space-y-5">
            <div className="flex items-center justify-between border-b border-bis-border/60 pb-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-bis-slate">
                <Sparkles className="w-4 h-4 text-bis-burgundy" />
                <span>{t("findProfileTitle", "Product Profile")}</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-bis-slate-muted hover:text-bis-burgundy text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t("reset", "Reset")}</span>
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-bis-slate mb-1">
                  {t("findProdName", "Product Name / Title *")}
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Stainless Steel Vacuum Flask"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bis-cream border border-bis-border focus:outline-none focus:border-bis-burgundy text-bis-slate"
                />
              </div>

              <div>
                <label className="block font-semibold text-bis-slate mb-1">
                  {t("findProdDesc", "Detailed Product Description")}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe dimensions, capacity, voltage, construction..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bis-cream border border-bis-border focus:outline-none focus:border-bis-burgundy text-bis-slate"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-bis-slate mb-1">
                    {t("findMaterial", "Primary Material")}
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. SS 304, Borosilicate"
                    className="w-full px-3 py-2 rounded-xl bg-bis-cream border border-bis-border focus:outline-none focus:border-bis-burgundy text-bis-slate"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-bis-slate mb-1">
                    {t("findIndustry", "Industry Sector")}
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Utensils, Electronics"
                    className="w-full px-3 py-2 rounded-xl bg-bis-cream border border-bis-border focus:outline-none focus:border-bis-burgundy text-bis-slate"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-bis-slate mb-1">
                  {t("findIntendedUse", "Intended Application / Target Consumer")}
                </label>
                <input
                  type="text"
                  value={intendedUse}
                  onChange={(e) => setIntendedUse(e.target.value)}
                  placeholder="e.g. Domestic drinking water, Industrial storage"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bis-cream border border-bis-border focus:outline-none focus:border-bis-burgundy text-bis-slate"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-3 px-4 bg-bis-burgundy text-white font-semibold rounded-xl hover:bg-bis-burgundy-light transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                {isSearching ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                    <span>{t("findSearching", "Searching Indian Standards Directory...")}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t("findBtn", "Discover Applicable Standards")}</span>
                  </>
                )}
              </button>
            </form>

            <div className="bg-bis-cream-dark/60 p-3 rounded-xl border border-bis-border/80 text-[11px] text-bis-slate-muted leading-relaxed">
              <span className="font-semibold text-bis-slate">Note on Scope:</span> Our engine checks against 20,000+ BIS standard titles, committee scopes, and 700+ gazette Quality Control Orders.
            </div>
          </div>

          {/* Right Column: Potentially Applicable Standards (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {!hasSearched ? (
              /* Empty state before searching */
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-bis-border text-center space-y-4 shadow-custom-sm">
                <div className="w-14 h-14 rounded-2xl bg-bis-cream-dark text-bis-burgundy flex items-center justify-center mx-auto border border-bis-border/50">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-serif-title text-xl font-semibold text-bis-slate">
                  {t("findTitle", "Find My")} {t("findItalic", "Standard")}
                </h3>
                <p className="text-xs sm:text-sm text-bis-slate-muted max-w-md mx-auto leading-relaxed">
                  Enter your product specifications on the left or select a sample scenario above to identify potentially applicable Indian Standards.
                </p>
                <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-bis-slate-muted">
                  <CheckCircle2 className="w-3.5 h-3.5 text-bis-sage" />
                  <span>Returns verified IS codes, QCO mandates & test requirements</span>
                </div>
              </div>
            ) : (
              /* Results Feed */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-serif-title font-semibold text-bis-slate">
                      {t("findResultsTitle", "Potentially Relevant Indian Standards")} ({results.length})
                    </h3>
                    <p className="text-xs text-bis-slate-muted">
                      {t("findResultsFor", "Evaluated for")} "{productName || 'Specified Product'}"
                    </p>
                  </div>
                  <span className="text-[11px] text-bis-slate-muted italic">
                    {t("confidenceLow", "Requires verification")}
                  </span>
                </div>

                {results.map((std) => (
                  <div
                    key={std.id}
                    className="bg-white rounded-3xl p-6 border border-bis-border shadow-custom-sm hover:shadow-custom-lg transition-all space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bis-border/60 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm font-bold text-bis-burgundy bg-bis-burgundy/10 px-2.5 py-1 rounded-lg">
                          {std.isNumber}
                        </span>
                        <StatusBadge status={std.status} />
                      </div>
                      <ConfidenceBadge level={std.confidence} label="Scope Match: High" />
                    </div>

                    {/* Standard Title & Scope */}
                    <div>
                      <h4 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate">
                        {std.title}
                      </h4>
                      <p className="mt-2 text-xs text-bis-slate-muted leading-relaxed">
                        <span className="font-semibold text-bis-slate">{t("findScopeAssessment", "Scope Assessment:")}</span> {std.scopeRelevance}
                      </p>
                    </div>

                    {/* QCO Mandate Alert */}
                    {std.mandatoryQCO && (
                      <div className="bg-bis-burgundy/5 p-3 rounded-xl border border-bis-burgundy/15 flex items-start space-x-2 text-xs text-bis-slate">
                        <AlertCircle className="w-4 h-4 text-bis-burgundy flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-bis-burgundy">Mandatory Quality Control Order:</span>{" "}
                          {std.qcoReference}
                        </div>
                      </div>
                    )}

                    {/* Key Requirements Checklist */}
                    <div>
                      <span className="text-[11px] font-bold text-bis-slate-muted uppercase tracking-wider block mb-2">
                        {t("findKeySpecs", "Key Tested Specifications:")}
                      </span>
                      <ul className="space-y-1.5 text-xs text-bis-slate">
                        {std.keyRequirements.map((req, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-bis-sage-dark flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Related Standards Pills */}
                    {std.relatedStandards.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-bis-slate-muted font-medium">Normative References:</span>
                        {std.relatedStandards.map((ref, idx) => (
                          <span key={idx} className="font-mono bg-bis-cream px-2 py-0.5 rounded border border-bis-border text-bis-slate">
                            {ref}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Evidence Grounding */}
                    <div className="bg-bis-cream p-3 rounded-xl border border-bis-border/80 text-[11px] text-bis-slate-muted italic">
                      "{std.evidenceExcerpt}"
                    </div>

                    {/* Next Action Links */}
                    <div className="pt-3 border-t border-bis-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <Link
                        href={`/certification?standard=${encodeURIComponent(std.isNumber)}`}
                        className="inline-flex items-center space-x-1.5 text-bis-burgundy font-semibold hover:underline"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>{t("certification", "Certification Navigator")}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <Link
                        href={`/labs?standard=${encodeURIComponent(std.isNumber)}`}
                        className="inline-flex items-center space-x-1.5 text-bis-slate-muted hover:text-bis-slate font-medium"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>{t("labs", "BIS Lab Finder")}</span>
                      </Link>
                    </div>

                  </div>
                ))}

                {/* Bottom Disclaimer */}
                <div className="p-4 bg-white rounded-2xl border border-bis-border text-[11px] text-bis-slate-muted text-center">
                  {t("findNotice")}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
