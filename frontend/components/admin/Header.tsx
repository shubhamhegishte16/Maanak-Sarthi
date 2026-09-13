"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, Bell, ChevronDown, Menu, Globe } from "lucide-react";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const { language, setLanguage, languages, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="h-20 bg-[#FAF7F2] border-b border-[#DDD7D0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 font-inter">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[#243B3B] hover:bg-[#FEEDE1] transition-colors border border-[#DDD7D0]"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Field matching reference image */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F7F7D]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("searchAdminPlaceholder", "Search standards, QCOs, certifications...")}
            className="w-full pl-10 pr-10 py-2.5 bg-[#FDFBF7] text-sm text-[#243B3B] placeholder-[#6F7F7D]/70 border border-[#DDD7D0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#889794]/40 focus:border-[#889794] transition-all shadow-xs"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6F7F7D] hover:text-[#243B3B] transition-colors"
            title="Filter options"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-[#243B3B] bg-[#FDFBF7] hover:bg-[#FEEDE1]/60 border border-[#DDD7D0] transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#889794]" />
            <span className="hidden md:inline">{currentLang.nativeName}</span>
            <span className="md:hidden uppercase">{currentLang.code}</span>
            <ChevronDown className="w-3 h-3 text-[#6F7F7D]" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold text-[#6F7F7D] uppercase tracking-wider">
                Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as LanguageCode);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#FEEDE1]/80 transition-colors ${
                    language === lang.code ? "font-semibold text-[#5A102A] bg-[#FEEDE1]/50" : "text-[#243B3B]"
                  }`}
                >
                  <span>{lang.name}</span>
                  <span className="text-[11px] text-[#6F7F7D]">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Icon */}
        <button
          className="relative p-2.5 text-[#243B3B] hover:text-[#5A102A] hover:bg-[#FEEDE1]/50 rounded-full border border-[#DDD7D0] bg-[#FDFBF7] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#5A102A] rounded-full ring-2 ring-[#FAF7F2]" />
        </button>

        {/* Admin Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-[#FEEDE1]/50 transition-colors border border-[#DDD7D0]/60 bg-[#FDFBF7]"
          >
            <div className="w-8 h-8 rounded-full bg-[#5A102A] text-[#FEEDE1] text-xs font-semibold flex items-center justify-center shadow-xs">
              AD
            </div>
            <span className="hidden sm:inline text-xs font-medium text-[#243B3B]">
              {t("adminProfile", "Admin")}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6F7F7D]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl shadow-lg py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-[#DDD7D0]/60">
                <p className="font-semibold text-[#243B3B]">System Admin</p>
                <p className="text-[11px] text-[#6F7F7D]">admin@bisguidance.gov.in</p>
              </div>
              <a
                href="/admin/settings"
                className="block px-4 py-2 text-[#243B3B] hover:bg-[#FEEDE1]/60 transition-colors"
              >
                {t("settings", "Settings")}
              </a>
              <a
                href="/admin/logs"
                className="block px-4 py-2 text-[#243B3B] hover:bg-[#FEEDE1]/60 transition-colors"
              >
                {t("systemLogs", "System Logs")}
              </a>
              <div className="border-t border-[#DDD7D0]/60 my-1" />
              <button
                onClick={() => alert("Logged out successfully")}
                className="w-full text-left px-4 py-2 text-rose-700 hover:bg-rose-50 font-medium transition-colors"
              >
                {t("signOut", "Sign Out")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
