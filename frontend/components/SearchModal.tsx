"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, ShieldCheck, FlaskConical, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const sampleResults = [
    { title: "IS 302 (Part 1):2024", desc: "Safety of Household and Similar Electrical Appliances", category: "Standard", href: "/standards?query=IS+302" },
    { title: "QCO Cookware 2024", desc: "Mandatory Quality Control Order for Domestic Stainless Steel Utensils", category: "QCO", href: "/updates" },
    { title: "IS 16046 (Part 2):2018", desc: "Secondary cells and batteries containing alkaline or non-acid electrolytes", category: "Standard", href: "/standards?query=IS+16046" },
    { title: "BIS Central Laboratory (CL)", desc: "Central Testing Facility - Regional Testing Hub", category: "Lab", href: "/labs" }
  ];

  const handleSelectResult = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onClose();
    router.push(`/standards?query=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-bis-cream w-full max-w-2xl rounded-3xl border border-bis-border shadow-custom-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-5 border-b border-bis-border flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3 w-full pr-4">
            <Search className="w-5 h-5 text-bis-burgundy flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("searchGlobalPlaceholder", "Search Indian Standards (IS), QCOs, Lab names (Press Enter to search)...")}
              className="w-full text-xs sm:text-sm text-bis-slate placeholder-bis-slate-muted bg-transparent focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-bis-cream-dark text-bis-slate-muted hover:text-bis-slate transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Suggestion Tags */}
        <div className="p-4 bg-bis-cream-card/60 border-b border-bis-border/60">
          <p className="text-[11px] font-bold text-bis-slate-muted uppercase tracking-wider mb-2">
            {t("searchSuggestedFilters", "Suggested Filters")}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button 
              type="button"
              onClick={() => handleSelectResult("/standards?query=IS+302")} 
              className="px-3 py-1 bg-white rounded-full border border-bis-border text-bis-slate hover:border-bis-burgundy transition-all"
            >
              {t("searchFilter1", "Electrical Safety (IS 302)")}
            </button>
            <button 
              type="button"
              onClick={() => handleSelectResult("/standards?query=IS+16046")} 
              className="px-3 py-1 bg-white rounded-full border border-bis-border text-bis-slate hover:border-bis-burgundy transition-all"
            >
              {t("searchFilter2", "Batteries (IS 16046)")}
            </button>
            <button 
              type="button"
              onClick={() => handleSelectResult("/updates")} 
              className="px-3 py-1 bg-white rounded-full border border-bis-border text-bis-slate hover:border-bis-burgundy transition-all"
            >
              {t("searchFilter3", "Latest QCO Mandates")}
            </button>
            <button 
              type="button"
              onClick={() => handleSelectResult("/labs")} 
              className="px-3 py-1 bg-white rounded-full border border-bis-border text-bis-slate hover:border-bis-burgundy transition-all"
            >
              {t("searchFilter4", "Testing Labs")}
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[350px] overflow-y-auto space-y-2">
          {sampleResults.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectResult(item.href)}
              className="p-3 bg-white rounded-2xl border border-bis-border/70 hover:border-bis-burgundy hover:shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-bis-burgundy">{item.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-bis-sage-light text-bis-sage-dark">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-bis-slate-muted mt-1">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-bis-slate-muted group-hover:text-bis-burgundy group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-bis-border text-center text-[11px] text-bis-slate-muted flex items-center justify-between px-5">
          <span>{t("searchGlobalSearch", "Search database across 20,000+ standards")}</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-bis-cream border border-bis-border rounded font-mono text-[10px]">{t("searchEsc", "ESC")}</kbd> {t("searchToClose", "to close")}</span>
        </div>
      </div>
    </div>
  );
}
