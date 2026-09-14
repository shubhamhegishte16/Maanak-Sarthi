"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge, { StandardStatus } from "@/components/shared/StatusBadge";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import { 
  SlidersHorizontal, 
  ArrowRight, 
  Check, 
  X, 
  HelpCircle, 
  FileText, 
  Settings, 
  FlaskConical, 
  ShieldCheck,
  RefreshCw,
  Scale,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { publicApi } from "@/lib/api";

interface ComparisonStandard {
  isNumber: string;
  title: string;
  edition: string;
  status: StandardStatus;
  scope: string;
  productCoverage: string;
  keyRequirements: string[];
  testMethods: string[];
  markingRules: string;
  amendments: string;
  scheme: string;
  gazetteMandate: string;
}

const COMPARISON_PAIRS: { label: string; stdA: ComparisonStandard; stdB: ComparisonStandard }[] = [
  {
    label: "Water Heaters: General vs Particular (IS 302-1 vs IS 302-2-21)",
    stdA: {
      isNumber: "IS 302 (Part 1):2024",
      title: "Safety of Household Electrical Appliances — General Requirements",
      edition: "Sixth Edition (2024)",
      status: "mandatory_qco",
      scope: "Horizontal parent safety standard applicable across all domestic household electrical equipment up to 250V.",
      productCoverage: "All consumer electrical apparatus (heaters, irons, mixers, fans, toasters).",
      keyRequirements: [
        "Classification of insulation (Class 0, I, II, III)",
        "Protection against electric shock via live probe test",
        "Clearance and creepage distances across PCB",
        "Resistance to heat, fire, and tracking"
      ],
      testMethods: [
        "High voltage dielectric test (1250V to 3750V)",
        "Earth continuity test (< 0.1 Ω at 25A)",
        "Glow wire flammability test at 750°C/850°C",
        "Moisture resistance chamber conditioning"
      ],
      markingRules: "Rated voltage, frequency, manufacturer name/trademark, and wattage rating.",
      amendments: "3 published amendments (harmonized with IEC 60335-1).",
      scheme: "Scheme I (ISI Mark) under Electrical Appliances QCO.",
      gazetteMandate: "S.O. 4821(E) — Ministry of Commerce and Industry."
    },
    stdB: {
      isNumber: "IS 302 (Part 2/Sec 21):2018",
      title: "Particular Requirements — Storage Water Heaters",
      edition: "Second Edition (2018)",
      status: "mandatory_isi",
      scope: "Vertical daughter standard augmenting Part 1 specifically for stationary and instantaneous electric water geysers.",
      productCoverage: "Water heating tanks with closed, vented, or cistern-fed construction.",
      keyRequirements: [
        "Dual thermal cut-out (thermostat + thermal safety cutoff)",
        "Hydrostatic pressure burst resistance of inner water tank",
        "Pressure relief safety valve operation",
        "Anti-siphoning and vacuum release verification"
      ],
      testMethods: [
        "Hydrostatic container test at 1.5x working pressure (up to 1.5 MPa)",
        "Continuous dry-heating test to verify non-resettable cut-off",
        "Hot water standing energy loss measurement (BEE 5-Star protocol)",
        "Earthing terminal corrosion resistance"
      ],
      markingRules: "Maximum rated pressure (MPa), capacity (Litres), water inlet/outlet color coding (Blue/Red), and CM/L licence number.",
      amendments: "2 published amendments (latest notified Jan 2024).",
      scheme: "Mandatory Scheme I (ISI Standard Mark).",
      gazetteMandate: "DPIIT Quality Control Order 2023."
    }
  },
  {
    label: "Water Bottles: Insulated vs Single Wall (IS 17526 vs IS 17803)",
    stdA: {
      isNumber: "IS 17526:2021",
      title: "Stainless Steel Vacuum Flasks and Insulated Bottles",
      edition: "First Edition (2021)",
      status: "mandatory_qco",
      scope: "Prescribes specifications for double-walled vacuum insulated containers.",
      productCoverage: "Thermos flasks, vacuum travel mugs, and hot/cold insulated flasks.",
      keyRequirements: [
        "Food grade austenitic stainless steel (SS 304 or SS 316)",
        "Thermal retention efficiency test (hot & cold limits)",
        "Handle and closure torque resistance",
        "Drop test from 1.2m without vacuum seal failure"
      ],
      testMethods: [
        "6-hour and 24-hour liquid temperature measurement",
        "Heavy metal leaching test (Lead, Cadmium, Hexavalent Chromium)",
        "Leak proof test under inverted pressurization"
      ],
      markingRules: "Nominal volume, stainless steel grade, BIS ISI Mark CM/L.",
      amendments: "No amendments (current active edition).",
      scheme: "Scheme I (ISI Mark).",
      gazetteMandate: "Cookware and Utensils (Quality Control) Order, 2024."
    },
    stdB: {
      isNumber: "IS 17803:2022",
      title: "Single Walled Stainless Steel Water Bottles",
      edition: "First Edition (2022)",
      status: "mandatory_qco",
      scope: "Prescribes specifications for single-walled non-vacuum potable water containers.",
      productCoverage: "Gym bottles, school water bottles, office metal flasks (non-thermal).",
      keyRequirements: [
        "Food contact grade stainless steel composition",
        "Corrosion resistance against acidic citrus beverages",
        "Neck thread and cap sealing durability",
        "Base impact resistance test"
      ],
      testMethods: [
        "Citric acid immersion corrosion test",
        "Mechanical drop test on hard concrete surface",
        "Cap gasket tightness testing"
      ],
      markingRules: "Gross capacity, material grade, manufacturer identification.",
      amendments: "No amendments.",
      scheme: "Scheme I (ISI Mark).",
      gazetteMandate: "DPIIT QCO 2024."
    }
  }
];

export default function CompareStandardsPage() {
  const { t } = useLanguage();
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [customStdA, setCustomStdA] = useState("");
  const [customStdB, setCustomStdB] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [dynamicPair, setDynamicPair] = useState<any | null>(null);

  const currentPair = dynamicPair || COMPARISON_PAIRS[selectedPairIndex];
  const stdA = currentPair.stdA;
  const stdB = currentPair.stdB;

  const handleCustomCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStdA.trim() || !customStdB.trim()) return;

    setIsComparing(true);
    try {
      const res = await publicApi.compareStandards(customStdA.trim(), customStdB.trim());
      if (res.data.success && res.data.comparison) {
        setDynamicPair(res.data.comparison);
      }
    } catch (err) {
      console.error("Comparison failed:", err);
    } finally {
      setIsComparing(false);
    }
  };

  const handleSelectPreset = (idx: number) => {
    setDynamicPair(null);
    setSelectedPairIndex(idx);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("compareTitle", "Compare")}
        italicWord={t("compareItalic", "Standards")}
        description={t("compareSubtitle", "Side-by-side technical evaluation between two Indian Standards. Analyze variations across product scope, testing protocols, mandatory schemes, and gazette mandates.")}
        badgeText={t("compareBadge", "Analytical Tool • Normative Comparison")}
        breadcrumbs={[{ label: t("compare", "Compare Standards") }]}
      />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Dynamic AI Custom Standard Comparison Input */}
        <div className="mb-8 p-5 bg-white rounded-3xl border border-bis-border shadow-custom-sm">
          <span className="text-xs font-semibold text-bis-slate uppercase tracking-wider block mb-3">
            Compare Any Two Standards with Gemini AI:
          </span>
          <form onSubmit={handleCustomCompare} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="e.g. IS 302 or IS 456"
              value={customStdA}
              onChange={(e) => setCustomStdA(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-2.5 rounded-2xl border border-bis-border text-xs focus:outline-none focus:border-bis-burgundy bg-bis-cream/50"
            />
            <span className="text-xs font-bold text-bis-slate-muted">VS</span>
            <input
              type="text"
              placeholder="e.g. IS 16046 or IS 2062"
              value={customStdB}
              onChange={(e) => setCustomStdB(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-2.5 rounded-2xl border border-bis-border text-xs focus:outline-none focus:border-bis-burgundy bg-bis-cream/50"
            />
            <button
              type="submit"
              disabled={isComparing || !customStdA.trim() || !customStdB.trim()}
              className="w-full sm:w-auto px-5 py-2.5 bg-bis-burgundy hover:bg-bis-burgundy-light text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isComparing ? "Analyzing with AI..." : "Compare with Gemini"}</span>
            </button>
          </form>
        </div>

        {/* Preset Selector */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-bis-slate-muted uppercase tracking-wider block mb-3">
            {t("compareSelectPair", "Or select verified benchmark pairs:")}
          </span>
          <div className="flex flex-wrap gap-2.5">
            {COMPARISON_PAIRS.map((pair, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all flex items-center space-x-2 ${
                  !dynamicPair && selectedPairIndex === idx
                    ? "bg-bis-burgundy text-white border-bis-burgundy shadow-sm"
                    : "bg-white hover:bg-bis-cream-dark text-bis-slate border-bis-border"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{pair.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Standard Headers Comparison Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Standard A Header */}
          <div className="bg-white rounded-3xl p-6 border-2 border-bis-border hover:border-bis-burgundy/60 transition-all shadow-custom-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider">
                Standard Reference A
              </span>
              <StatusBadge status={stdA.status} />
            </div>
            <h3 className="font-mono text-xl sm:text-2xl font-bold text-bis-burgundy">
              {stdA.isNumber}
            </h3>
            <h4 className="font-serif-title text-base font-semibold text-bis-slate leading-snug">
              {stdA.title}
            </h4>
            <div className="text-[11px] text-bis-slate-muted">
              {stdA.edition} • {stdA.amendments}
            </div>
          </div>

          {/* Standard B Header */}
          <div className="bg-white rounded-3xl p-6 border-2 border-bis-border hover:border-bis-burgundy/60 transition-all shadow-custom-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider">
                Standard Reference B
              </span>
              <StatusBadge status={stdB.status} />
            </div>
            <h3 className="font-mono text-xl sm:text-2xl font-bold text-bis-sage-dark">
              {stdB.isNumber}
            </h3>
            <h4 className="font-serif-title text-base font-semibold text-bis-slate leading-snug">
              {stdB.title}
            </h4>
            <div className="text-[11px] text-bis-slate-muted">
              {stdB.edition} • {stdB.amendments}
            </div>
          </div>

        </div>

        {/* Comparison Matrix (Desktop Table) */}
        <div className="hidden md:block bg-white rounded-3xl border border-bis-border shadow-custom-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-bis-cream-dark/70 text-bis-slate font-bold uppercase tracking-wider text-[11px] border-b border-bis-border">
                <th className="py-4 px-6 w-1/4">Comparison Dimension</th>
                <th className="py-4 px-6 w-3/8 text-bis-burgundy font-mono">{stdA.isNumber}</th>
                <th className="py-4 px-6 w-3/8 text-bis-sage-dark font-mono">{stdB.isNumber}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bis-border/60">
              {/* Row 1: Scope */}
              <tr className="hover:bg-bis-cream/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-bis-slate align-top">
                  Scope & Purpose
                </td>
                <td className="py-4 px-6 align-top text-bis-slate-muted leading-relaxed">
                  {stdA.scope}
                </td>
                <td className="py-4 px-6 align-top text-bis-slate-muted leading-relaxed">
                  {stdB.scope}
                </td>
              </tr>

              {/* Row 2: Product Coverage */}
              <tr className="hover:bg-bis-cream/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-bis-slate align-top">
                  Product Coverage
                </td>
                <td className="py-4 px-6 align-top text-bis-slate leading-relaxed">
                  {stdA.productCoverage}
                </td>
                <td className="py-4 px-6 align-top text-bis-slate leading-relaxed">
                  {stdB.productCoverage}
                </td>
              </tr>

              {/* Row 3: Key Requirements */}
              <tr className="hover:bg-bis-cream/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-bis-slate align-top">
                  Prescribed Technical Requirements
                </td>
                <td className="py-4 px-6 align-top">
                  <ul className="space-y-1.5 text-bis-slate">
                    {stdA.keyRequirements.map((r, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-bis-burgundy font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-6 align-top">
                  <ul className="space-y-1.5 text-bis-slate">
                    {stdB.keyRequirements.map((r, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-bis-sage-dark font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* Row 4: Testing Methods */}
              <tr className="hover:bg-bis-cream/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-bis-slate align-top">
                  Critical Test Methods
                </td>
                <td className="py-4 px-6 align-top">
                  <ul className="space-y-1.5 text-bis-slate-muted">
                    {stdA.testMethods.map((t, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-bis-burgundy font-bold">✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-6 align-top">
                  <ul className="space-y-1.5 text-bis-slate-muted">
                    {stdB.testMethods.map((t, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-bis-sage-dark font-bold">✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* Row 5: Marking */}
              <tr className="hover:bg-bis-cream/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-bis-slate align-top">
                  Standard Marking Rules
                </td>
                <td className="py-4 px-6 align-top text-bis-slate leading-relaxed">
                  {stdA.markingRules}
                </td>
                <td className="py-4 px-6 align-top text-bis-slate leading-relaxed">
                  {stdB.markingRules}
                </td>
              </tr>

              {/* Row 6: Scheme & Gazette */}
              <tr className="hover:bg-bis-cream/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-bis-slate align-top">
                  Certification Scheme & Mandate
                </td>
                <td className="py-4 px-6 align-top space-y-1">
                  <div className="font-semibold text-bis-burgundy">{stdA.scheme}</div>
                  <div className="text-[11px] text-bis-slate-muted">{stdA.gazetteMandate}</div>
                </td>
                <td className="py-4 px-6 align-top space-y-1">
                  <div className="font-semibold text-bis-sage-dark">{stdB.scheme}</div>
                  <div className="text-[11px] text-bis-slate-muted">{stdB.gazetteMandate}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Comparison Cards */}
        <div className="md:hidden space-y-4">
          {[
            { label: "Scope & Purpose", valA: stdA.scope, valB: stdB.scope },
            { label: "Product Coverage", valA: stdA.productCoverage, valB: stdB.productCoverage },
            { label: "Marking Rules", valA: stdA.markingRules, valB: stdB.markingRules },
            { label: "Certification Scheme", valA: stdA.scheme, valB: stdB.scheme }
          ].map((dim, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-bis-border space-y-3 text-xs">
              <span className="font-bold text-bis-slate uppercase text-[10px] block border-b border-bis-border/50 pb-1">
                {dim.label}
              </span>
              <div className="space-y-1">
                <span className="font-mono text-bis-burgundy font-bold block">{stdA.isNumber}:</span>
                <p className="text-bis-slate-muted leading-relaxed">{dim.valA}</p>
              </div>
              <div className="space-y-1 pt-2 border-t border-bis-border/40">
                <span className="font-mono text-bis-sage-dark font-bold block">{stdB.isNumber}:</span>
                <p className="text-bis-slate-muted leading-relaxed">{dim.valB}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 p-6 bg-white rounded-3xl border border-bis-border shadow-custom-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-bis-slate-muted">
            Need to investigate test laboratories for either standard?
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/labs?standard=${encodeURIComponent(stdA.isNumber)}`}
              className="px-4 py-2 bg-bis-burgundy text-white font-semibold rounded-full hover:bg-bis-burgundy-light transition-all shadow-2xs"
            >
              Labs for {stdA.isNumber.split(":")[0]}
            </Link>
            <Link
              href={`/labs?standard=${encodeURIComponent(stdB.isNumber)}`}
              className="px-4 py-2 bg-bis-cream hover:bg-bis-cream-dark border border-bis-border text-bis-slate font-semibold rounded-full transition-colors"
            >
              Labs for {stdB.isNumber.split(":")[0]}
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
