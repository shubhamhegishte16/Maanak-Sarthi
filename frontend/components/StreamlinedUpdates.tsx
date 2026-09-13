"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  ChevronRight, 
  ArrowRight, 
  HelpCircle, 
  Cpu, 
  FileSearch, 
  CheckCircle 
} from "lucide-react";

export default function StreamlinedUpdates() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "Ask",
      desc: "Tell us about your product, requirement or question.",
      icon: HelpCircle,
    },
    {
      num: "02",
      title: "Get AI Guidance",
      desc: "Receive clear, structured answers with source references.",
      icon: Cpu,
    },
    {
      num: "03",
      title: "View Sources",
      desc: "See exact clauses, documents and official notifications.",
      icon: FileSearch,
    },
    {
      num: "04",
      title: "Take Action",
      desc: "Move forward with confidence and full compliance.",
      icon: CheckCircle,
    },
  ];

  const latestUpdates = [
    {
      id: 1,
      title: "Amendment to IS 302 (Part 1): 2024",
      category: "Indian Standards",
      date: "12 Sep 2026",
      isNew: true,
    },
    {
      id: 2,
      title: "QCO on Electrical Equipment (Amendment)",
      category: "QCOs",
      date: "08 Sep 2026",
      isNew: false,
    },
    {
      id: 3,
      title: "New Labs Added in Maharashtra Region",
      category: "BIS-Recognized Labs",
      date: "05 Sep 2026",
      isNew: false,
    },
    {
      id: 4,
      title: "Updated Certification Process for CRS",
      category: "Certification Schemes",
      date: "02 Sep 2026",
      isNew: false,
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-bis-cream border-t border-bis-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Card: Minimalist How It Works Flow */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 bg-bis-cream-dark/60 p-6 sm:p-8 rounded-3xl border border-bis-border flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-bis-slate-muted mb-2">
                HOW IT WORKS
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-title font-normal text-bis-slate">
                From your question <br />
                <span className="font-serif-italic text-bis-burgundy">
                  to verified sources.
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-bis-slate-muted mt-2 mb-6">
                Simple steps. Trusted information.
              </p>

              {/* 4 Minimalist Steps Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {steps.map((st, i) => {
                  const StepIcon = st.icon;
                  const isActive = activeStep === i;
                  return (
                    <div
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-white border-bis-burgundy shadow-sm"
                          : "bg-white/60 border-bis-border/70 hover:bg-white/90"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-bis-sage/20 text-bis-sage-dark">
                          {st.num}
                        </span>
                        <StepIcon className={`w-4 h-4 ${isActive ? "text-bis-burgundy" : "text-bis-slate-muted"}`} />
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-bis-slate">
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-bis-slate-muted mt-1 leading-snug line-clamp-2">
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-bis-border/50 flex items-center justify-between text-xs">
              <span className="text-bis-slate-muted text-[11px]">
                Built on official gazette & standard references
              </span>
              <button 
                onClick={() => alert("Detailed guidance guide opened")}
                className="font-medium text-bis-burgundy hover:underline inline-flex items-center space-x-1"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Right Card: Latest Updates (Red-circled in Image 2) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-bis-border shadow-custom-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif-title font-semibold text-bis-slate">
                    Latest Updates
                  </h3>
                  <p className="text-xs text-bis-slate-muted mt-0.5">
                    Official amendments, QCOs, circulars and lab additions.
                  </p>
                </div>
                <button 
                  onClick={() => alert("Viewing all updates")}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-bis-burgundy hover:underline"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Updates List */}
              <div className="divide-y divide-bis-border/60">
                {latestUpdates.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => alert(`Opening notice: ${item.title}`)}
                    className="py-3.5 flex items-start justify-between group cursor-pointer hover:bg-bis-cream/50 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-start space-x-3 pr-2">
                      <div className="p-2 rounded-lg bg-bis-cream-dark text-bis-burgundy group-hover:bg-bis-burgundy group-hover:text-white transition-colors mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-bis-slate group-hover:text-bis-burgundy transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1 text-[11px] text-bis-slate-muted">
                          <span className="font-semibold text-bis-sage-dark">{item.category}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                          {item.isNew && (
                            <span className="ml-1.5 px-1.5 py-0.2 rounded bg-bis-terracotta/15 text-bis-terracotta font-bold text-[9px] uppercase">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-bis-slate-muted group-hover:text-bis-burgundy group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Minimal Info Badge */}
            <div className="mt-6 pt-4 border-t border-bis-border/50 flex items-center justify-between text-[11px] text-bis-slate-muted">
              <span>Updated daily from official Gazette notifications</span>
              <span className="font-mono text-bis-gold font-semibold">2026 Edition</span>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
