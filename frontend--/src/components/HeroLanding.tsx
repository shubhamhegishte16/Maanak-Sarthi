"use me";
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Users, 
  ShieldCheck, 
  Star, 
  FileText, 
  Award, 
  FlaskConical, 
  CheckSquare, 
  FolderArchive, 
  Headphones, 
  ArrowRight 
} from "lucide-react";

interface HeroLandingProps {
  onExploreClick: () => void;
}

export default function HeroLanding({ onExploreClick }: HeroLandingProps) {
  const miniCategories = [
    { name: "Standards", icon: FileText },
    { name: "Certification", icon: Award },
    { name: "Labs", icon: FlaskConical },
    { name: "QCOs", icon: CheckSquare },
    { name: "Documents", icon: FolderArchive },
    { name: "Support", icon: Headphones },
  ];

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-bis-border bg-white/70 backdrop-blur-sm text-xs font-medium text-bis-slate-muted shadow-sm tracking-wide">
            <span>Trusted</span>
            <span className="mx-2 text-bis-gold">•</span>
            <span>Transparent</span>
            <span className="mx-2 text-bis-gold">•</span>
            <span>Together</span>
          </div>
        </motion.div>

        {/* Hero Headlines */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-6"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-title font-normal tracking-tight leading-[1.1] text-bis-slate">
            Indian Standards, <br />
            <span className="font-serif-italic font-normal text-bis-burgundy block mt-1">
              for a Safer Tomorrow.
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-bis-slate-muted max-w-2xl mx-auto leading-relaxed">
            We facilitate standardization, certification and quality assurance
            to build a stronger, safer and more sustainable India.
          </p>
        </motion.div>

        {/* Central Visual Composition (Layered Photo & Floating Stat Cards) */}
        <div className="relative mt-12 mb-12 max-w-5xl mx-auto">
          
          {/* Backdrop Accent Shapes with Gentle Floating Animation */}
          {/* Top-Right Muted Sage Shape */}
          <motion.div 
            animate={{ rotate: [3, 6, 3], scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute -top-6 -right-4 sm:top-2 sm:right-6 w-56 h-56 sm:w-80 sm:h-80 bg-bis-sage/75 rounded-[40px] sm:rounded-[60px] -z-10" 
          />
          
          {/* Bottom-Left Warm Gold Shape */}
          <motion.div 
            animate={{ rotate: [-6, -3, -6], scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-4 sm:bottom-4 sm:left-4 w-60 h-60 sm:w-88 sm:h-88 bg-bis-gold/65 rounded-[40px] sm:rounded-[60px] -z-10" 
          />

          {/* Central Headquarters Photo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-custom-lg border-2 border-white/60 bg-white"
          >
            <div className="relative w-full h-[320px] sm:h-[450px] lg:h-[500px]">
              <Image
                src="/images/bis_building.jpg"
                alt="Bureau of Indian Standards Headquarters"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* FLOATING CARD 1: 99% Stat (Top Left) with Continuous Float */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, -10, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.3 },
              x: { duration: 0.6, delay: 0.3 },
              y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
            }}
            className="absolute top-4 -left-2 sm:top-8 sm:-left-10 lg:-left-16 z-20 w-48 sm:w-64 bg-bis-burgundy text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-custom-lg border border-white/20 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              <span className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                99%
              </span>
              <button 
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="View compliance report"
              >
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-white/85 font-light leading-snug">
              Products in the market meet BIS standards for your safety.
            </p>
          </motion.div>

          {/* FLOATING CARD 2: 2.5M+ Consumers (Bottom Left) with Continuous Float */}
          <motion.div 
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, 8, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.4 },
              x: { duration: 0.6, delay: 0.4 },
              y: { repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.5 }
            }}
            className="absolute bottom-4 -left-2 sm:bottom-12 sm:-left-8 lg:-left-14 z-20 w-52 sm:w-72 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-custom-lg border border-bis-border hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-bis-burgundy/10 text-bis-burgundy rounded-xl">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="font-sans text-xl sm:text-2xl font-bold text-bis-slate block">
                  2.5M+
                </span>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-bis-slate-muted leading-relaxed">
              Businesses and consumers trusted BIS across India.
            </p>
          </motion.div>

          {/* FLOATING CARD 3: 4.8 Rating (Top Right) with Continuous Float */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, -12, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.35 },
              x: { duration: 0.6, delay: 0.35 },
              y: { repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.2 }
            }}
            className="absolute top-6 -right-2 sm:top-12 sm:-right-8 lg:-right-12 z-20 w-48 sm:w-64 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-custom-lg border border-bis-border hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-bis-sage/20 text-bis-sage-dark rounded-xl">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-sans text-xl sm:text-3xl font-bold text-bis-slate">
                  4.8
                </span>
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-bis-gold text-bis-gold" />
              </div>
            </div>
            <p className="mt-2.5 text-xs text-bis-slate-muted leading-relaxed">
              Average customer rating for our services.
            </p>
          </motion.div>

          {/* FLOATING CARD 4: Categories Widget (Bottom Right) with Continuous Float */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: 1, 
              y: [0, 10, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.45 },
              y: { repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.4 }
            }}
            className="absolute -bottom-10 right-2 sm:bottom-4 sm:-right-6 lg:-right-10 z-20 w-64 sm:w-80 bg-bis-cream-card/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-custom-lg border border-bis-border hover:shadow-2xl transition-shadow"
          >
            <div className="grid grid-cols-2 gap-2">
              {miniCategories.map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-white/80 border border-bis-border/60 hover:bg-white hover:border-bis-burgundy/30 transition-all cursor-pointer"
                  >
                    <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-bis-burgundy" />
                    <span className="text-[11px] sm:text-xs font-medium text-bis-slate">
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex justify-end">
              <button 
                onClick={onExploreClick}
                className="p-1.5 text-bis-slate-muted hover:text-bis-burgundy hover:bg-white/80 rounded-full transition-all"
                title="View categories"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Center Bottom Explore CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center pt-8 sm:pt-12"
        >
          <button
            onClick={onExploreClick}
            className="group inline-flex items-center space-x-3 px-8 py-3.5 bg-bis-burgundy text-white font-medium text-xs sm:text-sm rounded-full shadow-custom-lg hover:bg-bis-burgundy-light hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Explore Our Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
