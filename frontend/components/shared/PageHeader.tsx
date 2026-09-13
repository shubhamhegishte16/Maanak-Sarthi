"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  italicWord?: string;
  description: string;
  badgeText?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  italicWord,
  description,
  badgeText,
  breadcrumbs = [],
  actions,
}: PageHeaderProps) {
  const { t } = useLanguage();
  const displayBadge = badgeText || t("nationalQuality", "National Quality Infrastructure");

  return (
    <div className="bg-gradient-to-b from-white/70 via-bis-cream to-bis-cream border-b border-bis-border/60 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] w-full mx-auto">
        {/* Breadcrumb row */}
        <nav className="flex items-center space-x-1.5 text-xs text-bis-slate-muted mb-4 overflow-x-auto">
          <Link href="/" className="hover:text-bis-burgundy flex items-center space-x-1 transition-colors whitespace-nowrap">
            <Home className="w-3.5 h-3.5" />
            <span>{t("home", "Home")}</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-bis-slate-muted/60 flex-shrink-0" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-bis-burgundy transition-colors whitespace-nowrap">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-bis-slate whitespace-nowrap">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Header content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-bis-slate-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-bis-sage-dark" />
              <span>{displayBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-normal text-bis-slate tracking-tight leading-tight">
              {title}{" "}
              {italicWord && (
                <span className="font-serif-italic text-bis-burgundy">{italicWord}</span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-bis-slate-muted leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
