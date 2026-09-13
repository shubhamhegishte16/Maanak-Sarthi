"use me";
"use client";

import React from "react";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bis-cream border-t border-bis-border/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-bis-border/60">
          
          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
            <span className="font-serif-title text-xl font-bold text-bis-slate">
              BIS Guidance
            </span>
            <span className="hidden sm:inline text-bis-slate-muted">•</span>
            <span className="text-xs text-bis-slate-muted font-medium tracking-wide">
              Standards • Compliance • Confidence
            </span>
          </div>

          {/* Right Tagline */}
          <div className="text-xs text-bis-slate-muted text-center md:text-right font-medium">
            <span>Reliable information for a stronger, safer India.</span>
          </div>

        </div>

        {/* Bottom Copyright & Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-bis-slate-muted">
          <p>© 2026 BIS Guidance. Designed for clarity, speed & safety.</p>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-bis-burgundy transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-bis-burgundy transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-bis-burgundy transition-colors">Official Gazette</a>
            <a href="#" className="hover:text-bis-burgundy transition-colors">Contact Support</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
