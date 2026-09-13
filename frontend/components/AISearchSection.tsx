"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Settings, 
  FlaskConical, 
  Sparkles,
  ExternalLink
} from "lucide-react";

interface AISearchSectionProps {
  onSelectCategory?: (category: string) => void;
}

export default function AISearchSection({ onSelectCategory }: AISearchSectionProps) {
  const [query, setQuery] = useState("");
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const presets = [
    {
      suggestion: "Is my product BIS certified?",
      question: "Does my electric water heater require mandatory BIS certification?",
      answer: "Yes, electric water heaters are under mandatory BIS CRS certification under IS 302 (Part 2/Sec 21).",
      sources: [
        { num: "01", standard: "IS 302 (Part 2):2024", clause: "Clause 6.2 (Safety Standards)" },
        { num: "02", standard: "QCO-2025-17", clause: "Clause 3.1 (Mandatory Marking)" },
        { num: "03", standard: "CRS Scheme", clause: "Annexure A (Testing Protocol)" }
      ]
    },
    {
      suggestion: "Find applicable standards",
      question: "Which Indian Standard applies to lithium-ion batteries?",
      answer: "Lithium-ion batteries for portable electronics are covered under IS 16046 (Part 2):2018.",
      sources: [
        { num: "01", standard: "IS 16046 (Part 2)", clause: "Cell Safety Requirements" },
        { num: "02", standard: "QCO Batteries 2024", clause: "Compliance Mandate" },
        { num: "03", standard: "Recognized Lab Protocol", clause: "Section 4.1" }
      ]
    },
    {
      suggestion: "Locate a BIS lab",
      question: "Where can I test electrical equipment for IS 302 compliance?",
      answer: "14 accredited BIS-Recognized Labs are available in Maharashtra & NCR region.",
      sources: [
        { num: "01", standard: "Central Marks Lab", clause: "New Delhi Regional Branch" },
        { num: "02", standard: "NABL Accredited", clause: "Lab Reg #BIS-LAB-948" },
        { num: "03", standard: "Calibration Scheme", clause: "Clause 12.3" }
      ]
    },
    {
      suggestion: "Check QCO for my product",
      question: "What is the enforcement date for the latest Electrical Equipment QCO?",
      answer: "Enforcement date is effective from 01 October 2026 for all domestic manufacturers.",
      sources: [
        { num: "01", standard: "Gazette Notification", clause: "S.O. 4821(E)" },
        { num: "02", standard: "IS 1234:2024", clause: "Quality Control Guidelines" },
        { num: "03", standard: "FMCS Scheme", clause: "Foreign Manufacturers Annexure" }
      ]
    }
  ];

  const currentPreset = presets[activePresetIndex];

  const handlePillClick = (index: number) => {
    setActivePresetIndex(index);
    setQuery(presets[index].suggestion);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Find closest matching preset or keep active
    alert(`Searching BIS Guidance database for: "${query}"`);
  };

  return (
    <section id="guidance-search" className="py-12 md:py-20 bg-gradient-to-b from-bis-cream via-white/50 to-bis-cream border-t border-bis-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Search Header & Inputs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Upper Tracked Tagline */}
            <div className="flex items-center space-x-2 text-[11px] font-semibold tracking-widest text-bis-slate-muted uppercase">
              <span className="w-2 h-2 rounded-full bg-bis-terracotta animate-pulse" />
              <span>Indian Standards • Verified Sources • Real Answers</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl font-serif-title font-normal text-bis-slate leading-tight">
              Navigate Indian Standards, <br />
              <span className="font-serif-italic text-bis-slate/90">
                with confidence.
              </span>
            </h2>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-bis-slate-muted leading-relaxed max-w-xl">
              Get accurate, source-grounded information on Indian Standards, Quality Control Orders, certification schemes, and BIS-recognized labs — all in one place.
            </p>

            {/* Interactive Search Box */}
            <form onSubmit={handleSearchSubmit} className="relative mt-4">
              <div className="relative flex items-center bg-white rounded-full p-2 pl-5 shadow-custom-lg border border-bis-border focus-within:border-bis-burgundy transition-all">
                <Search className="w-5 h-5 text-bis-slate-muted mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about a product, standard or requirement..."
                  className="w-full text-xs sm:text-sm text-bis-slate placeholder-bis-slate-muted/70 bg-transparent focus:outline-none pr-4"
                />
                <button
                  type="submit"
                  className="p-3 bg-bis-sage text-white rounded-full hover:bg-bis-sage-dark transition-colors flex-shrink-0 shadow-sm"
                  aria-label="Submit search"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Suggestion Pills */}
            <div className="pt-2">
              <p className="text-[11px] font-medium text-bis-slate-muted mb-2.5">
                Popular guidance topics:
              </p>
              <div className="flex flex-wrap gap-2">
                {presets.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePillClick(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      activePresetIndex === idx
                        ? "bg-bis-burgundy text-white border-bis-burgundy shadow-sm"
                        : "bg-white/80 text-bis-slate border-bis-border hover:bg-bis-cream-dark hover:border-bis-slate/30"
                    }`}
                  >
                    {item.suggestion}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Red-Circled AI Answer & Source Diagram Visual Stack */}
          <div className="lg:col-span-6 relative">
            
            {/* Background Ambient Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-bis-gold/20 via-bis-sage/20 to-bis-burgundy/10 rounded-3xl blur-2xl -z-10" />

            <div className="bg-bis-cream-card/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-bis-border shadow-custom-lg relative">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2 text-xs font-bold tracking-wider text-bis-slate uppercase">
                  <span className="w-2 h-2 rounded-full bg-bis-sage" />
                  <span>SOURCE-GROUNDED AI</span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-bis-burgundy bg-bis-burgundy/5 px-2.5 py-1 rounded-full border border-bis-burgundy/10 font-medium">
                  <Sparkles className="w-3 h-3 text-bis-burgundy" />
                  <span>Real-time Verification</span>
                </div>
              </div>

              {/* Simulated Prompt & Answer Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePresetIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* User Question Box */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-bis-border/80 shadow-sm">
                    <p className="text-xs sm:text-sm font-semibold text-bis-slate">
                      {currentPreset.question}
                    </p>
                    
                    {/* Verified Answer Banner */}
                    <div className="mt-3.5 flex items-start space-x-2.5 bg-bis-sage-light/80 border border-bis-sage/30 p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-bis-sage-dark flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-bis-slate font-medium leading-snug">
                        {currentPreset.answer}
                      </p>
                    </div>

                    {/* Sources Sub-list */}
                    <div className="mt-4 pt-3 border-t border-bis-border/60">
                      <p className="text-[11px] font-bold text-bis-slate-muted uppercase tracking-wider mb-2">
                        Sources
                      </p>
                      <div className="space-y-2">
                        {currentPreset.sources.map((src, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-bis-cream/60 transition-colors">
                            <div className="flex items-center space-x-3">
                              <span className="text-[10px] font-mono text-bis-gold font-semibold">
                                {src.num}
                              </span>
                              <span className="font-semibold text-bis-slate">
                                {src.standard}
                              </span>
                            </div>
                            <span className="text-bis-slate-muted text-[11px]">
                              {src.clause}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Flow Connected Nodes on Right */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                      <button 
                        onClick={() => onSelectCategory?.("standards")}
                        className="flex items-center space-x-1.5 p-2 bg-white rounded-xl border border-bis-border shadow-xs hover:border-bis-burgundy transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-bis-burgundy" />
                        <span className="text-[11px] font-medium text-bis-slate">Indian Standards</span>
                      </button>

                      <button 
                        onClick={() => onSelectCategory?.("qcos")}
                        className="flex items-center space-x-1.5 p-2 bg-white rounded-xl border border-bis-border shadow-xs hover:border-bis-burgundy transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-bis-sage-dark" />
                        <span className="text-[11px] font-medium text-bis-slate">QCOs</span>
                      </button>

                      <button 
                        onClick={() => onSelectCategory?.("certification")}
                        className="flex items-center space-x-1.5 p-2 bg-white rounded-xl border border-bis-border shadow-xs hover:border-bis-burgundy transition-all"
                      >
                        <Settings className="w-3.5 h-3.5 text-bis-gold" />
                        <span className="text-[11px] font-medium text-bis-slate">Schemes</span>
                      </button>

                      <button 
                        onClick={() => onSelectCategory?.("labs")}
                        className="flex items-center space-x-1.5 p-2 bg-white rounded-xl border border-bis-border shadow-xs hover:border-bis-burgundy transition-all"
                      >
                        <FlaskConical className="w-3.5 h-3.5 text-bis-terracotta" />
                        <span className="text-[11px] font-medium text-bis-slate">Recognized Labs</span>
                      </button>
                    </div>

                  </div>

                  {/* Bottom Flow Caption */}
                  <p className="text-[11px] text-center text-bis-slate-muted italic pt-1">
                    From product to compliance — with verified sources.
                  </p>

                </motion.div>
              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
