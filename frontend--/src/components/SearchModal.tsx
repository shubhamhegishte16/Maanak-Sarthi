"use me";
"use client";

import React, { useState } from "react";
import { Search, X, BookOpen, ShieldCheck, FlaskConical, ArrowRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const sampleResults = [
    { title: "IS 302 (Part 1): 2024", desc: "Safety of Household and Similar Electrical Appliances", category: "Standard" },
    { title: "QCO-2025-17", desc: "Mandatory Quality Control Order for Domestic Appliances", category: "QCO" },
    { title: "IS 16046 (Part 2): 2018", desc: "Secondary cells and batteries containing alkaline or non-acid electrolytes", category: "Standard" },
    { title: "Central Marks Testing Lab", desc: "NABL Accredited Regional Laboratory - Western Zone", category: "Lab" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-bis-cream w-full max-w-2xl rounded-3xl border border-bis-border shadow-custom-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-bis-border flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3 w-full pr-4">
            <Search className="w-5 h-5 text-bis-burgundy flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Indian Standards (IS), QCOs, Lab names..."
              className="w-full text-sm sm:text-base text-bis-slate placeholder-bis-slate-muted bg-transparent focus:outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-bis-cream-dark text-bis-slate-muted hover:text-bis-slate transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        <div className="p-4 bg-bis-cream-card/60 border-b border-bis-border/60">
          <p className="text-[11px] font-bold text-bis-slate-muted uppercase tracking-wider mb-2">
            Suggested Filters
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button onClick={() => setSearchTerm("IS 302")} className="px-3 py-1 bg-white rounded-full border border-bis-border text-bis-slate hover:border-bis-burgundy transition-all">
              Electrical Safety (IS 302)
            </button>
            <button onClick={() => setSearchTerm("Batteries")} className="px-3 py-1 bg-white rounded-full border border-bis-border text-bis-slate hover:border-bis-burgundy transition-all">
              Batteries (IS 16046)
            </button>
            <button onClick={() => setSearchTerm("QCO 2026")} className="px-3 py-1 bg-white rounded-full border border-bis-border text-bis-slate hover:border-bis-burgundy transition-all">
              Latest QCO Mandates
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[350px] overflow-y-auto space-y-2">
          {sampleResults.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                alert(`Selected: ${item.title}`);
                onClose();
              }}
              className="p-3 bg-white rounded-2xl border border-bis-border/70 hover:border-bis-burgundy hover:shadow-xs transition-all flex items-center justify-between group cursor-pointer"
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
        <div className="p-3 bg-white border-t border-bis-border text-center text-[11px] text-bis-slate-muted">
          Press <kbd className="px-1.5 py-0.5 bg-bis-cream border border-bis-border rounded font-mono text-[10px]">ESC</kbd> to close modal
        </div>
      </div>
    </div>
  );
}
