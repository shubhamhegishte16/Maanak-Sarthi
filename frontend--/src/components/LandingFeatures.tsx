"use me";
"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  BookOpen, 
  Award, 
  FlaskConical, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Lock,
  Building,
  Users,
  Zap
} from "lucide-react";

interface LandingFeaturesProps {
  onSignInClick: () => void;
  onExploreClick: () => void;
}

export default function LandingFeatures({ onSignInClick, onExploreClick }: LandingFeaturesProps) {
  const pillars = [
    {
      title: "Mandatory Safety Standards",
      desc: "Instant lookup of Indian Standards (IS) published by the Bureau of Indian Standards for domestic & imported goods.",
      icon: ShieldCheck,
      badge: "IS Catalog",
      color: "text-bis-burgundy bg-bis-burgundy/10"
    },
    {
      title: "Quality Control Orders (QCOs)",
      desc: "Track gazette notifications and enforcement timelines for mandatory certification across 700+ product categories.",
      icon: Award,
      badge: "Government Gazette",
      color: "text-bis-sage-dark bg-bis-sage/20"
    },
    {
      title: "Recognized Testing Network",
      desc: "Locate NABL-accredited BIS testing & calibration labs across all Indian states and regional branches.",
      icon: FlaskConical,
      badge: "350+ Labs",
      color: "text-bis-terracotta bg-bis-terracotta/10"
    }
  ];

  const popularStandards = [
    { id: "IS 302", name: "Safety of Household Electrical Appliances", category: "Electrical Safety", status: "Mandatory QCO" },
    { id: "IS 16046", name: "Secondary Lithium Cells & Batteries", category: "Electronics & IT", status: "Mandatory CRS" },
    { id: "IS 4151", name: "Protective Helmets for Two-Wheeler Motorists", category: "Personal Protection", status: "Mandatory ISI" },
    { id: "IS 269", name: "Ordinary Portland Cement (33 Grade Specifications)", category: "Building Materials", status: "Mandatory ISI" }
  ];

  return (
    <div className="space-y-16 md:space-y-24 py-8 bg-bis-cream">
      
      {/* SECTION 1: INSTITUTIONAL MISSION PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-bis-slate-muted">
            National Quality Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-normal text-bis-slate mt-2">
            Built for Transparency, Compliance & Safety.
          </h2>
          <p className="text-xs sm:text-sm text-bis-slate-muted mt-3 leading-relaxed">
            BIS Guidance simplifies standard verification for manufacturers, importers, lab officers, and Indian consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-bis-border shadow-custom-sm hover:shadow-custom-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-2xl ${p.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-bis-cream-dark text-bis-slate-muted">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="font-serif-title text-xl font-semibold text-bis-slate mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-bis-slate-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-bis-border/50 flex items-center justify-between text-xs">
                  <span className="text-bis-slate-muted text-[11px]">Official BIS Standard</span>
                  <button 
                    onClick={onExploreClick}
                    className="font-semibold text-bis-burgundy hover:underline inline-flex items-center space-x-1"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: POPULAR STANDARDS CATALOG PREVIEW */}
      <section className="bg-bis-cream-dark/50 py-14 border-y border-bis-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-bis-slate-muted">
                Frequently Verified
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-title font-normal text-bis-slate mt-1">
                Popular Indian Standards Directory
              </h2>
            </div>
            <button
              onClick={onExploreClick}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-bis-burgundy hover:underline"
            >
              <span>Explore All 20,000+ Standards</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularStandards.map((std, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-bis-border hover:border-bis-burgundy transition-all shadow-custom-sm flex flex-col justify-between group cursor-pointer"
                onClick={onExploreClick}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-bis-burgundy bg-bis-burgundy/10 px-2.5 py-1 rounded-md">
                      {std.id}
                    </span>
                    <span className="text-[10px] font-semibold text-bis-sage-dark bg-bis-sage-light px-2 py-0.5 rounded">
                      {std.status}
                    </span>
                  </div>

                  <h4 className="font-serif-title text-sm font-semibold text-bis-slate group-hover:text-bis-burgundy transition-colors leading-snug">
                    {std.name}
                  </h4>
                  <p className="text-[11px] text-bis-slate-muted mt-2">
                    Category: <span className="font-medium text-bis-slate">{std.category}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-bis-border/50 flex items-center justify-between text-[11px]">
                  <span className="text-bis-slate-muted">Verified Gazette Source</span>
                  <ArrowRight className="w-3.5 h-3.5 text-bis-slate-muted group-hover:text-bis-burgundy group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: INSTITUTIONAL STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bis-burgundy text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-custom-lg">
          
          {/* Subtle background glow circle */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-bis-burgundy-light/40 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/15">
            <div className="pt-4 md:pt-0">
              <span className="font-serif-title text-3xl sm:text-5xl font-bold text-white block">
                99%
              </span>
              <span className="text-xs text-white/80 font-light mt-1 block">
                Market Product Safety Compliance
              </span>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="font-sans text-3xl sm:text-5xl font-bold text-white block">
                2.5M+
              </span>
              <span className="text-xs text-white/80 font-light mt-1 block">
                Businesses & Consumers Served
              </span>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="font-sans text-3xl sm:text-5xl font-bold text-bis-gold-light block">
                350+
              </span>
              <span className="text-xs text-white/80 font-light mt-1 block">
                BIS-Recognized Testing Labs
              </span>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="font-sans text-3xl sm:text-5xl font-bold text-white block">
                700+
              </span>
              <span className="text-xs text-white/80 font-light mt-1 block">
                Quality Control Mandates (QCOs)
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION BANNER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-bis-border shadow-custom-lg">
          <h2 className="text-2xl sm:text-4xl font-serif-title font-normal text-bis-slate">
            Ready to verify your product compliance?
          </h2>
          <p className="text-xs sm:text-sm text-bis-slate-muted max-w-xl mx-auto mt-3">
            Sign in to access your customized dashboard, query real-time Indian Standards, and track certification schemes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onSignInClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-bis-burgundy text-white text-xs sm:text-sm font-semibold rounded-full shadow-custom-sm hover:bg-bis-burgundy-light transition-all"
            >
              Sign In to Portal
            </button>
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-bis-cream border border-bis-border text-bis-slate text-xs sm:text-sm font-semibold rounded-full hover:bg-bis-cream-dark transition-all"
            >
              Explore AI Guidance
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
