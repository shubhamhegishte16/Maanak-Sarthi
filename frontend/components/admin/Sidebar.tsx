"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Award,
  FlaskConical,
  FileCode,
  Users,
  ScrollText,
  Settings,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const mainNav = [
    { name: t("dashboard", "Dashboard"), href: "/admin", icon: LayoutDashboard },
    { name: t("standards", "Standards"), href: "/admin/standards", icon: FileText },
    { name: t("qcos", "QCOs"), href: "/admin/qcos", icon: ShieldCheck },
    { name: t("certificationSchemes", "Certification Schemes"), href: "/admin/certification", icon: Award },
    { name: t("labs", "Labs"), href: "/admin/labs", icon: FlaskConical },
    { name: t("documents", "Documents"), href: "/admin/documents", icon: FileCode },
  ];

  const adminNav = [
    { name: t("userManagement", "User Management"), href: "/admin/users", icon: Users },
    { name: t("systemLogs", "System Logs"), href: "/admin/logs", icon: ScrollText },
    { name: t("settings", "Settings"), href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[265px] h-full bg-[#5A102A] text-[#FAF7F2] flex flex-col justify-between select-none font-inter shadow-xl relative z-30">
      {/* Top Header & Brand */}
      <div>
        <div className="h-20 px-7 flex items-center justify-between border-b border-[#721837]/50">
          <Link href="/admin" className="group flex items-center gap-2">
            <span className="font-editorial text-2xl font-normal tracking-wide text-[#FEEDE1] group-hover:text-white transition-colors">
              BIS GUIDANCE
            </span>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-[#FEEDE1]/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="p-4 space-y-6">
          {/* Main Module Nav */}
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-white/15 text-white shadow-xs font-semibold"
                      : "text-[#DDD7D0]/80 hover:text-white hover:bg-white/8"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? "scale-110 text-[#FEEDE1]" : "text-[#DDD7D0]/70"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-[#721837]/60 my-2 mx-3" />

          {/* Admin Nav */}
          <div className="space-y-1">
            <div className="px-4 pb-2 text-[10px] font-bold tracking-widest uppercase text-[#FEEDE1]/50">
              {t("adminSection", "ADMIN")}
            </div>

            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-white/15 text-white shadow-xs font-semibold"
                      : "text-[#DDD7D0]/80 hover:text-white hover:bg-white/8"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? "scale-110 text-[#FEEDE1]" : "text-[#DDD7D0]/70"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-6 border-t border-[#721837]/50 text-xs text-[#FEEDE1]/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#889794] animate-pulse" />
          <span className="font-medium">{t("systemOnline", "System Online")}</span>
        </div>
        <span className="text-[11px] opacity-60 font-mono">v1.0.0</span>
      </div>
    </aside>
  );
}
