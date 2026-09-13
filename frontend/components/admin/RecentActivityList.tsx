"use client";

import React from "react";
import Link from "next/link";
import { FileText, ShieldCheck, Award, FlaskConical, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: "standard" | "qco" | "scheme" | "lab";
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    title: "New Indian Standard Added",
    subtitle: "IS 17431:2024 — Safety requirements for industrial pumps",
    timestamp: "2 hours ago",
    type: "standard",
  },
  {
    id: "act-2",
    title: "QCO Updated",
    subtitle: "QCO-2025-17 — Electrical equipment (Amendment)",
    timestamp: "4 hours ago",
    type: "qco",
  },
  {
    id: "act-3",
    title: "New Certification Scheme",
    subtitle: "CRS — Compulsory Registration Scheme (Amendment)",
    timestamp: "6 hours ago",
    type: "scheme",
  },
  {
    id: "act-4",
    title: "New Lab Registered",
    subtitle: "Thermo Test Labs — Mumbai",
    timestamp: "8 hours ago",
    type: "lab",
  },
];

const ICON_MAP = {
  standard: FileText,
  qco: ShieldCheck,
  scheme: Award,
  lab: FlaskConical,
};

interface RecentActivityListProps {
  activities?: ActivityItem[];
}

export function RecentActivityList({ activities = DEFAULT_ACTIVITIES }: RecentActivityListProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full font-inter">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDD7D0]/60">
        <h3 className="font-editorial text-2xl font-medium text-[#243B3B]">
          {t("recentActivity", "Recent Activity")}
        </h3>
        <Link
          href="/admin/logs"
          className="text-xs font-medium text-[#5A102A] hover:text-[#3E0B1C] flex items-center gap-1 transition-colors"
        >
          <span>{t("viewAll", "View all →")}</span>
        </Link>
      </div>

      {/* Activity Items List */}
      <div className="divide-y divide-[#DDD7D0]/50 pt-2">
        {activities.map((item) => {
          const IconComponent = ICON_MAP[item.type] || FileText;
          return (
            <div
              key={item.id}
              className="py-4 flex items-start gap-4 hover:bg-[#FEEDE1]/30 px-2 rounded-xl transition-colors"
            >
              {/* Icon badge */}
              <div className="w-9 h-9 rounded-full bg-[#FEEDE1] text-[#5A102A] flex items-center justify-center shrink-0 border border-[#DDD7D0]/60 mt-0.5">
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-[#243B3B]">
                  {item.type === "standard"
                    ? t("actNewStandard", item.title)
                    : item.type === "qco"
                    ? t("actQcoUpdated", item.title)
                    : item.type === "scheme"
                    ? t("actNewScheme", item.title)
                    : item.type === "lab"
                    ? t("actNewLab", item.title)
                    : item.title}
                </p>
                <p className="text-xs text-[#6F7F7D] truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              {/* Timestamp */}
              <div className="text-[11px] text-[#6F7F7D] whitespace-nowrap shrink-0">
                {item.timestamp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
