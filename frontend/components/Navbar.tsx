"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Menu, 
  X, 
  LogOut, 
  UserCheck, 
  ChevronDown, 
  Globe, 
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle2,
  FileText,
  BarChart3,
  Bell,
  SlidersHorizontal,
  BookmarkCheck
} from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "@/context/LanguageContext";
import { useAuth, roleLabels } from "@/context/AuthContext";

interface UserProfile {
  id: string;
  name: string;
  role: "consumer" | "business" | "lab";
  email: string;
}

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenSearch?: () => void;
  onOpenAuthModal?: () => void;
  user?: UserProfile | null;
  onLogout?: () => void;
  isLanding?: boolean;
}

export default function Navbar({ 
  onOpenSearch, 
  onOpenAuthModal,
  user = null,
  onLogout,
  isLanding
}: NavbarProps) {
  const { user: contextUser, logout: contextLogout } = useAuth();
  const activeUser = user ?? contextUser;
  const handleLogout = onLogout ?? contextLogout;
  const pathname = usePathname();
  const isLandingMode = isLanding !== undefined ? isLanding : (pathname === "/" && !activeUser);
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Primary top links
  const primaryNav = [
    { name: t("home", "Home"), href: "/" },
    { name: t("assistant", "AI Assistant"), href: "/assistant" },
    { name: t("findStandard", "Find Standard"), href: "/find-standard" },
    { name: t("standards", "Standards"), href: "/standards" },
    { name: t("certification", "Certification"), href: "/certification" },
    { name: t("labs", "Labs"), href: "/labs" },
  ];

  // Secondary items in "More" menu
  const secondaryNav = [
    { name: t("documents", "Document Analyzer"), href: "/document-analyzer", icon: FileText, desc: "Upload & interpret BIS notices, clauses & test reports" },
    { name: t("compliance", "Compliance Checker"), href: "/compliance", icon: CheckCircle2, desc: "Verify evidence against mandatory standard clauses" },
    { name: t("readiness", "Application Readiness"), href: "/application-readiness", icon: BarChart3, desc: "Assess readiness for BIS licence or CRS filing" },
    { name: t("compare", "Compare Standards"), href: "/compare", icon: SlidersHorizontal, desc: "Side-by-side comparison across scope & test methods" },
    { name: t("updates", "Updates & Alerts"), href: "/updates", icon: Bell, desc: "Track recent QCO gazette orders & amendments" },
    { name: t("dashboard", "My Dashboard"), href: "/dashboard", icon: BookmarkCheck, desc: "Saved standards, recent searches & compliance audits" },
  ];

  const isCurrentActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname?.startsWith(href)) return true;
    return false;
  };

  const isMoreActive = secondaryNav.some((item) => pathname?.startsWith(item.href));

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-bis-cream/95 border-b border-bis-border/60 transition-all duration-300">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 h-20 flex items-center justify-between gap-2 lg:gap-3">
        
        {/* Left Brand Mark */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <Link href="/" className="flex items-center group">
            <span className="font-serif-title text-lg sm:text-xl lg:text-2xl font-bold text-bis-slate tracking-tight group-hover:text-bis-burgundy transition-colors whitespace-nowrap">
              {t("portalTitle", "MANAK SAARTHI")}
            </span>
          </Link>
          
          {!isLandingMode && activeUser && (
            <>
              <span className="h-5 w-[1px] bg-bis-slate/20 hidden sm:block" />
              <Link
                href="/dashboard"
                className="hidden 2xl:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-bis-sage-light text-bis-sage-dark text-[11px] font-semibold hover:bg-bis-sage/30 transition-colors whitespace-nowrap flex-shrink-0"
              >
                <UserCheck className="w-3 h-3" />
                <span>{t("dashboardMode", "Dashboard Mode")}</span>
              </Link>
            </>
          )}
        </div>

        {/* Center Pill Nav Bar - Desktop (Hidden on landing page, shown in user / manufacturer panel) */}
        {!isLandingMode && (
          <nav className="hidden xl:flex items-center space-x-1 bg-bis-cream-dark/70 p-1.5 rounded-full border border-bis-border/70 shadow-sm flex-shrink-0">
            {primaryNav.map((item) => {
              const active = isCurrentActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center shrink-0 transition-all duration-200 ${
                    active
                      ? "bg-bis-burgundy text-white shadow-sm font-semibold"
                      : "text-bis-slate-muted hover:text-bis-slate hover:bg-white/60"
                  }`}
                >
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative shrink-0" ref={moreRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center space-x-1 shrink-0 transition-all duration-200 ${
                  isMoreActive
                    ? "bg-bis-burgundy text-white shadow-sm font-semibold"
                    : "text-bis-slate-muted hover:text-bis-slate hover:bg-white/60"
                }`}
              >
                <span className="whitespace-nowrap">{t("more", "More")}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-custom-lg border border-bis-border py-2 px-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider border-b border-bis-border/50">
                    Compliance & Regulatory Tools
                  </div>
                  <div className="py-1">
                    {secondaryNav.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = pathname?.startsWith(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-start space-x-3 px-3 py-2 rounded-xl transition-colors ${
                            isSubActive
                              ? "bg-bis-cream-dark text-bis-burgundy font-semibold"
                              : "hover:bg-bis-cream text-bis-slate"
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSubActive ? "text-bis-burgundy" : "text-bis-slate-muted"}`} />
                          <div>
                            <div className="text-xs font-medium">{sub.name}</div>
                            <div className="text-[11px] text-bis-slate-muted line-clamp-1">{sub.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>
        )}

        {/* Right Actions: Language Selector, Search, User Pill */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-bis-border/80 bg-white/70 hover:bg-white text-xs text-bis-slate transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-bis-slate-muted" />
              <span className="font-semibold uppercase text-[11px]">{language}</span>
              <ChevronDown className="w-3 h-3 text-bis-slate-muted" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-custom-lg border border-bis-border py-1 z-50 animate-in fade-in duration-100">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as LanguageCode);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      language === lang.code
                        ? "bg-bis-cream-dark font-bold text-bis-burgundy"
                        : "text-bis-slate hover:bg-bis-cream"
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-bis-slate-muted font-normal uppercase">({lang.code})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Modal Trigger (Hidden on landing page, available in user panel) */}
          {!isLandingMode && onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 text-bis-slate-muted hover:text-bis-burgundy hover:bg-white/80 rounded-full transition-all border border-transparent hover:border-bis-border/50"
              title="Search Indian Standards (Ctrl+K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* User Profile Pill or Sign In */}
          {activeUser ? (
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-bis-border text-xs hover:border-bis-burgundy/40 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-bis-sage" />
                <span className="font-semibold text-bis-slate">{activeUser.name}</span>
                <span className="text-[10px] text-bis-slate-muted uppercase">({roleLabels[activeUser.role]})</span>
              </Link>
              {handleLogout && (
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-bis-slate-muted hover:text-bis-burgundy hover:bg-white rounded-full transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-bis-slate border border-bis-slate/30 rounded-full hover:bg-bis-slate hover:text-white transition-all duration-200"
            >
              {t("signIn", "Sign In")}
            </button>
          )}

          {/* Mobile hamburger button (Hidden on landing page, shown in user panel) */}
          {!isLandingMode && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-bis-slate hover:text-bis-burgundy focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {!isLandingMode && mobileMenuOpen && (
        <div className="xl:hidden bg-bis-cream border-b border-bis-border px-4 pt-3 pb-6 space-y-4 shadow-lg max-h-[85vh] overflow-y-auto">
          
          {/* Core Navigation */}
          <div>
            <div className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider mb-2 px-2">
              Core Modules
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {primaryNav.map((item) => {
                const active = isCurrentActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? "bg-bis-burgundy text-white font-semibold shadow-xs"
                        : "text-bis-slate hover:bg-bis-cream-dark"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Regulatory & Compliance Tools */}
          <div>
            <div className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider mb-2 px-2">
              Compliance & Diagnostics
            </div>
            <div className="space-y-1">
              {secondaryNav.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = pathname?.startsWith(sub.href);
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSubActive
                        ? "bg-bis-burgundy text-white font-semibold"
                        : "text-bis-slate hover:bg-bis-cream-dark"
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{sub.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Session & Search */}
          <div className="pt-3 border-t border-bis-border flex items-center justify-between text-xs">
            {onOpenSearch && (
              <button
                onClick={() => {
                  onOpenSearch();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 text-bis-burgundy font-semibold py-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Standards</span>
              </button>
            )}

            {activeUser ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1 text-xs font-semibold text-bis-burgundy border border-bis-burgundy/30 rounded-full"
              >
                My Dashboard
              </Link>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal?.();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-bis-slate border border-bis-slate/30 rounded-full"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
