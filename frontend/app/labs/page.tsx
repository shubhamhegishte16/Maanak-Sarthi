"use client";

import React, { useState, useMemo, Suspense, useEffect } from "react";
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
import { publicApi } from "@/lib/api";

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
  
  const [labs, setLabs] = useState<TestingLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLab, setActiveLab] = useState<TestingLab | null>(null);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await publicApi.getLabs();
      if (res.data.success) {
        const mapped = res.data.labs.map((l: any) => ({
          id: l.id,
          name: l.name,
          category: l.category || 'General',
          region: l.region || 'Unknown',
          city: l.city || 'Unknown',
          state: l.state || 'Unknown',
          address: l.address || 'Address not provided',
          recognitionId: l.recognition_id || `LAB-${l.id.substring(0, 5).toUpperCase()}`,
          validThrough: l.valid_through || 'Unknown',
          accreditation: l.accreditation || 'Recognized',
          supportedStandards: Array.isArray(l.supported_standards) ? l.supported_standards : [],
          keyTests: Array.isArray(l.key_tests) ? l.key_tests : [],
          contactEmail: l.contact_email || 'contact@lab.com',
          contactPhone: l.contact_phone || '+91-0000000000',
          lat: l.lat || 20,
          lng: l.lng || 77
        }));
        setLabs(mapped);
        if (mapped.length > 0) setActiveLab(mapped[0]);
      }
    } catch (error) {
      console.error("Failed to fetch labs", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
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
  }, [query, selectedState, selectedCategory, labs]);

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
                      {t("labAccreditedScope", "Accredited Testing Scope:")}
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
                      {t("labSampleParams", "Sample Evaluated Parameters:")}
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
                    <span>{t("labContactLab", "Contact Lab")}</span>
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
                  {t("labMapTitle", "Geographic Testing Network Map")}
                </h4>
                <p className="text-xs text-bis-slate-muted max-w-md mx-auto leading-relaxed">
                  {t("labMapDesc", "Displaying accredited BIS Central Laboratories, Regional Offices, and NABL testing points across India.")}
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
                      {t("labAccreditedStandardScope", "Accredited Standard Scope:")}
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
                      <span>{t("labSendQuery", "Send Testing Query")}</span>
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
