"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bis-cream border-t border-bis-border/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-bis-border/60">
          
          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
            <Link href="/" className="font-serif-title text-xl font-bold text-bis-slate hover:text-bis-burgundy transition-colors">
              MANAK SAARTHI
            </Link>
            <span className="hidden sm:inline text-bis-slate-muted">•</span>
            <span className="text-xs text-bis-slate-muted font-medium tracking-wide">
              {t("footerTagline", "Standards • Compliance • Confidence")}
            </span>
          </div>

          {/* Right Tagline */}
          <div className="text-xs text-bis-slate-muted text-center md:text-right font-medium">
            <span>{t("footerMinistry", "Department of Consumer Affairs (DoCA) • Ministry of Consumer Affairs, Food & Public Distribution")}</span>
          </div>

        </div>

        {/* Bottom Copyright & Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-bis-slate-muted">
          <p>{t("footerCopyright", "© 2026 MANAK SAARTHI • Built for National Quality Infrastructure.")}</p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/standards" className="hover:text-bis-burgundy transition-colors">
              {t("footerLinkStandards", "Standards Directory")}
            </Link>
            <Link href="/updates" className="hover:text-bis-burgundy transition-colors">
              {t("footerLinkAlerts", "Gazette Alerts")}
            </Link>
            <Link href="/labs" className="hover:text-bis-burgundy transition-colors">
              {t("footerLinkLabs", "Testing Laboratories")}
            </Link>
            <Link href="/assistant" className="hover:text-bis-burgundy transition-colors">
              {t("footerLinkAssistant", "AI Guidance")}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
