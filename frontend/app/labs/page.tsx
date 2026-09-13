"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import { 
  Search, 
  MapPin, 
  FlaskConical, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ExternalLink, 
  Filter, 
  Layers, 
  Navigation,
  CheckCircle2,
  Building,
  ArrowRight,
  Info
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TestingLab {
  id: string;
  name: string;
  category: string;
  region: string;
  city: string;
  state: string;
  address: string;
  recognitionId: string;
  validThrough: string;
  accreditation: string;
  supportedStandards: string[];
  keyTests: string[];
  contactEmail: string;
  contactPhone: string;
  lat: number;
  lng: number;
}

const MOCK_LABS: TestingLab[] = [
  {
    id: "lab-1",
    name: "BIS Central Laboratory (CL)",
    category: "Electrical & Mechanical",
    region: "North",
    city: "Sahibabad",
    state: "Uttar Pradesh",
    address: "Plot No. 20/9, Site IV, Industrial Area, Sahibabad, Ghaziabad",
    recognitionId: "BIS-CL-001",
    validThrough: "Permanent Central Facility",
    accreditation: "BIS In-House Central Laboratory",
    supportedStandards: ["IS 302 (Part 1)", "IS 302 (Part 2/Sec 21)", "IS 16046 (Part 2)", "IS 4151"],
    keyTests: ["Dielectric Strength", "Thermal Cut-out Abuse", "Mechanical Drop Impact", "Ingress Protection (IPX4)"],
    contactEmail: "cl-ghaziabad@bis.gov.in",
    contactPhone: "+91-120-4177100",
    lat: 28.67,
    lng: 77.34
  },
  {
    id: "lab-2",
    name: "Western Regional Laboratory (WRL)",
    category: "Electrical & Chemical",
    region: "West",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Manakalaya, E9, MIDC, Andheri (East), Mumbai",
    recognitionId: "BIS-WRL-002",
    validThrough: "Permanent Regional Facility",
    accreditation: "NABL Accredited & BIS Regional Lab",
    supportedStandards: ["IS 302 (Part 2/Sec 21)", "IS 17526", "IS 17803", "IS 10500"],
    keyTests: ["Hydrostatic Pressure Burst", "Food Contact Material Leaching", "Insulation Resistance", "Water Purity"],
    contactEmail: "wrl-mumbai@bis.gov.in",
    contactPhone: "+91-22-28329295",
    lat: 19.11,
    lng: 72.86
  },
  {
    id: "lab-3",
    name: "Southern Regional Laboratory (SRL)",
    category: "Electronics & Batteries",
    region: "South",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "CIT Campus, IV Cross Road, Taramani, Chennai",
    recognitionId: "BIS-SRL-003",
    validThrough: "Permanent Regional Facility",
    accreditation: "NABL Accredited Lab",
    supportedStandards: ["IS 16046 (Part 2)", "IS 15885", "IS 616"],
    keyTests: ["Lithium Cell Overcharge", "External Short Circuit at 55°C", "Vibration Shock Test", "Photometry"],
    contactEmail: "srl-chennai@bis.gov.in",
    contactPhone: "+91-44-22541442",
    lat: 12.98,
    lng: 80.24
  },
  {
    id: "lab-4",
    name: "National Test House (NTH - Western Region)",
    category: "Mechanical & Building Materials",
    region: "West",
    city: "Pune",
    state: "Maharashtra",
    address: "F-10, MIDC Industrial Area, Pimpri, Pune",
    recognitionId: "BIS-RECOG-NTH-142",
    validThrough: "31 March 2028",
    accreditation: "Government of India Recognized",
    supportedStandards: ["IS 269", "IS 17526", "IS 4151"],
    keyTests: ["Compressive Strength", "Chemical Analysis of Stainless Steel", "Helmet Impact Absorption"],
    contactEmail: "nthpune-ca@nic.in",
    contactPhone: "+91-20-27472091",
    lat: 18.62,
    lng: 73.81
  },
  {
    id: "lab-5",
    name: "Electronics Test & Development Centre (ETDC)",
    category: "Electronics & IT Goods",
    region: "South",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Peenya Industrial Area, 1st Stage, Bengaluru",
    recognitionId: "BIS-RECOG-ETDC-089",
    validThrough: "15 October 2027",
    accreditation: "STQC / NABL Accredited",
    supportedStandards: ["IS 16046 (Part 2)", "IS 15885", "IS 13252"],
    keyTests: ["Secondary Battery Safety", "EMC Emission & Immunity", "Climatic Thermal Chamber Cycling"],
    contactEmail: "etdcbang@stqc.nic.in",
    contactPhone: "+91-80-28394464",
    lat: 13.03,
    lng: 77.51
  },
  {
    id: "lab-6",
    name: "Gujarat Laboratory for Industrial Standards (GLIS)",
    category: "Chemical & Utensils",
    region: "West",
    city: "Ahmedabad",
    state: "Gujarat",
    address: "GIDC Phase II, Vatva, Ahmedabad",
    recognitionId: "BIS-RECOG-GLIS-211",
    validThrough: "30 June 2027",
    accreditation: "BIS-Recognized Private Lab",
    supportedStandards: ["IS 17526", "IS 17803", "IS 10500"],
    keyTests: ["Spectrometric Metal Analysis", "Heavy Metal Migration", "Seal Vacuum Integrity"],
    contactEmail: "testing@glislab.in",
    contactPhone: "+91-79-25830911",
    lat: 22.96,
    lng: 72.63
  }
];

const STATES = ["All States", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Karnataka", "Gujarat"];
const CATEGORIES = ["All Domains", "Electrical & Mechanical", "Electronics & IT Goods", "Chemical & Utensils"];

function BISLabFinderContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialStd = searchParams.get("standard") || "";

  const [query, setQuery] = useState(initialStd);
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCategory, setSelectedCategory] = useState("All Domains");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [activeLab, setActiveLab] = useState<TestingLab | null>(MOCK_LABS[0]);

  const filteredLabs = useMemo(() => {
    return MOCK_LABS.filter((lab) => {
      const matchQuery =
        !query ||
        lab.name.toLowerCase().includes(query.toLowerCase()) ||
        lab.city.toLowerCase().includes(query.toLowerCase()) ||
        lab.supportedStandards.some((s) => s.toLowerCase().includes(query.toLowerCase())) ||
        lab.keyTests.some((k) => k.toLowerCase().includes(query.toLowerCase()));

      const matchState = selectedState === "All States" || lab.state === selectedState;
      const matchCat = selectedCategory === "All Domains" || lab.category.includes(selectedCategory);

      return matchQuery && matchState && matchCat;
    });
  }, [query, selectedState, selectedCategory]);

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("labTitle", "BIS Recognized")}
        italicWord={t("labItalic", "Lab Finder")}
        description={t("labSubtitle", "Locate Central, Regional, and NABL-accredited BIS testing laboratories authorized to evaluate your product against mandatory Indian Standards.")}
        badgeText={t("labBadge", "Infrastructure Network • NABL & BIS Laboratories")}
        breadcrumbs={[{ label: t("labs", "BIS Lab Finder") }]}
      />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-bis-border shadow-custom-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-bis-slate-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("labPlaceholder", "Search by standard (e.g. IS 302), city, test parameter, or laboratory name...")}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-bis-cream border border-bis-border focus:outline-none focus:border-bis-burgundy text-xs sm:text-sm text-bis-slate"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3.5 py-3 rounded-full bg-bis-cream border border-bis-border text-xs text-bis-slate font-medium focus:outline-none focus:border-bis-burgundy"
              >
                {STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              {/* View Toggle (List vs Map) */}
              <div className="flex items-center bg-bis-cream p-1 rounded-full border border-bis-border text-xs font-semibold">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    viewMode === "list" ? "bg-bis-burgundy text-white shadow-2xs" : "text-bis-slate-muted hover:text-bis-slate"
                  }`}
                >
                  {t("labListMode", "List")}
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    viewMode === "map" ? "bg-bis-burgundy text-white shadow-2xs" : "text-bis-slate-muted hover:text-bis-slate"
                  }`}
                >
                  {t("labMapMode", "Map")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Overview Strip */}
        <div className="flex items-center justify-between mb-4 text-xs text-bis-slate-muted">
          <div>
            {t("labShowingCount", "BIS-Recognized Testing Facilities")}: <strong className="text-bis-slate">{filteredLabs.length}</strong>
          </div>
          <span className="italic">{t("officialSource", "Official BIS Source")}</span>
        </div>

        {/* Main Content Layout (Desktop side-by-side or responsive) */}
        {viewMode === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white rounded-3xl p-6 border border-bis-border hover:border-bis-burgundy shadow-custom-sm hover:shadow-custom-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-bis-border/60 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-bis-burgundy uppercase tracking-wider block">
                        {lab.accreditation}
                      </span>
                      <h3 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate group-hover:text-bis-burgundy transition-colors mt-0.5">
                        {lab.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-bis-slate-muted">
                    <MapPin className="w-3.5 h-3.5 text-bis-terracotta flex-shrink-0" />
                    <span>{lab.city}, {lab.state}</span>
                  </div>

                  <p className="text-[11px] text-bis-slate-muted leading-relaxed line-clamp-2">
                    {lab.address}
                  </p>

                  {/* Standards Supported Tags */}
                  <div>
                    <span className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider block mb-1.5">
                      Accredited Testing Scope:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {lab.supportedStandards.map((std, i) => (
                        <span
                          key={i}
                          className="font-mono text-[10px] font-bold bg-bis-cream px-2 py-0.5 rounded border border-bis-border text-bis-slate"
                        >
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Capabilities */}
                  <div className="bg-bis-cream p-3 rounded-2xl border border-bis-border/60 text-[11px] space-y-1">
                    <span className="font-semibold text-bis-slate block text-[10px] uppercase">
                      Sample Evaluated Parameters:
                    </span>
                    <p className="text-bis-slate-muted line-clamp-2">
                      {lab.keyTests.join(" • ")}
                    </p>
                  </div>
                </div>

                {/* Contact & Enquiry */}
                <div className="pt-3 border-t border-bis-border/50 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-bis-slate-muted">
                    ID: {lab.recognitionId}
                  </span>

                  <a
                    href={`mailto:${lab.contactEmail}?subject=BIS%20Testing%20Inquiry`}
                    className="inline-flex items-center space-x-1 font-semibold text-bis-burgundy hover:underline"
                  >
                    <span>Contact Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Map Visualizer (Mock Interactive Map Layout) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl p-6 border border-bis-border shadow-custom-lg">
            
            {/* Map Canvas Placeholder */}
            <div className="lg:col-span-8 bg-bis-cream-dark/60 rounded-2xl p-8 border border-bis-border min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden text-center space-y-3">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4A1525_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-bis-burgundy flex items-center justify-center mx-auto shadow-sm">
                  <Navigation className="w-6 h-6" />
                </div>
                <h4 className="font-serif-title text-lg font-semibold text-bis-slate">
                  Geographic Testing Network Map
                </h4>
                <p className="text-xs text-bis-slate-muted max-w-md mx-auto leading-relaxed">
                  Displaying accredited BIS Central Laboratories, Regional Offices, and NABL testing points across India.
                </p>

                {/* Mock Pin Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {filteredLabs.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setActiveLab(l)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                        activeLab?.id === l.id
                          ? "bg-bis-burgundy text-white border-bis-burgundy shadow-sm"
                          : "bg-white hover:bg-bis-cream text-bis-slate border-bis-border"
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{l.city}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Lab Details on Right (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {activeLab && (
                <div className="p-5 rounded-2xl bg-bis-cream border border-bis-border space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-bis-burgundy text-[10px] uppercase">
                      {activeLab.accreditation}
                    </span>
                    <ConfidenceBadge level="verified" />
                  </div>

                  <h3 className="font-serif-title text-base font-bold text-bis-slate">
                    {activeLab.name}
                  </h3>

                  <div className="space-y-1 text-bis-slate-muted">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-bis-terracotta flex-shrink-0" />
                      <span>{activeLab.city}, {activeLab.state}</span>
                    </div>
                    <p className="pl-4 text-[11px]">{activeLab.address}</p>
                  </div>

                  <div className="pt-2 border-t border-bis-border/60 space-y-2">
                    <div className="flex items-center space-x-1.5 text-bis-slate">
                      <Mail className="w-3.5 h-3.5 text-bis-slate-muted" />
                      <span className="font-mono text-[11px]">{activeLab.contactEmail}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-bis-slate">
                      <Phone className="w-3.5 h-3.5 text-bis-slate-muted" />
                      <span className="font-mono text-[11px]">{activeLab.contactPhone}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-bis-border/60">
                    <span className="text-[10px] font-bold text-bis-slate-muted uppercase block mb-1">
                      Accredited Standard Scope:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {activeLab.supportedStandards.map((std, idx) => (
                        <span key={idx} className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-bis-border text-bis-slate">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3">
                    <a
                      href={`mailto:${activeLab.contactEmail}`}
                      className="w-full py-2 bg-bis-burgundy text-white font-semibold rounded-xl hover:bg-bis-burgundy-light flex items-center justify-center space-x-1 transition-colors"
                    >
                      <span>Send Testing Query</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      <Footer />
    </main>
  );
}

export default function BISLabFinderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bis-cream flex items-center justify-center text-xs">Loading Lab Finder...</div>}>
      <BISLabFinderContent />
    </Suspense>
  );
}
