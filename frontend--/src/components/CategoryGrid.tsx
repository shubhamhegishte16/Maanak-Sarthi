"use me";
"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  ShieldCheck, 
  Settings, 
  FlaskConical, 
  FileCheck2, 
  ArrowRight 
} from "lucide-react";

interface CategoryGridProps {
  onSelectCategory: (id: string) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const categories = [
    {
      id: "standards",
      title: "Indian Standards",
      description: "Search and view the latest Indian Standards (IS).",
      icon: BookOpen,
      count: "20,000+ Standards",
      badgeColor: "bg-bis-burgundy/10 text-bis-burgundy",
    },
    {
      id: "qcos",
      title: "QCOs",
      description: "Find applicable Quality Control Orders for your product.",
      icon: ShieldCheck,
      count: "700+ Mandates",
      badgeColor: "bg-bis-sage/20 text-bis-sage-dark",
    },
    {
      id: "certification",
      title: "Certification Schemes",
      description: "Learn about ISI, CRS, FMCS and more.",
      icon: Settings,
      count: "4 Core Schemes",
      badgeColor: "bg-bis-gold/20 text-bis-slate",
    },
    {
      id: "labs",
      title: "BIS-Recognized Labs",
      description: "Locate accredited testing and calibration labs.",
      icon: FlaskConical,
      count: "350+ Labs",
      badgeColor: "bg-bis-terracotta/10 text-bis-terracotta",
    },
    {
      id: "documents",
      title: "Documents",
      description: "Guides, forms, notices and circulars.",
      icon: FileCheck2,
      count: "Official Downloads",
      badgeColor: "bg-bis-slate/10 text-bis-slate",
    },
  ];

  return (
    <section id="categories-section" className="py-12 md:py-16 bg-bis-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif-title font-normal text-bis-slate">
              Explore by category
            </h3>
            <p className="text-xs sm:text-sm text-bis-slate-muted mt-1">
              Browse official standards, mandates, testing networks, and certification pathways.
            </p>
          </div>
          <button
            onClick={() => onSelectCategory("all")}
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-bis-burgundy hover:text-bis-burgundy-light transition-colors group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative bg-white/90 hover:bg-white p-5 rounded-2xl border border-bis-border shadow-custom-sm hover:shadow-custom-lg transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
              >
                <div>
                  {/* Icon Circle */}
                  <div className="w-10 h-10 rounded-xl bg-bis-cream-dark flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-bis-border/50">
                    <IconComp className="w-5 h-5 text-bis-burgundy" />
                  </div>

                  {/* Title & Count Badge */}
                  <div className="space-y-1">
                    <h4 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate group-hover:text-bis-burgundy transition-colors">
                      {cat.title}
                    </h4>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium ${cat.badgeColor}`}>
                      {cat.count}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-bis-slate-muted leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Action Arrow */}
                <div className="mt-6 pt-3 border-t border-bis-border/40 flex items-center justify-end">
                  <div className="p-1.5 rounded-full text-bis-slate-muted group-hover:text-bis-burgundy group-hover:bg-bis-cream-dark transition-all">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={() => onSelectCategory("all")}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-bis-burgundy"
          >
            <span>View all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
