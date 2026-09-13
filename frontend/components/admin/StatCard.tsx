"use client";

import React from "react";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, trend, icon: Icon }: StatCardProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-[#889794]/60 transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className="text-xs font-medium text-[#6F7F7D] font-inter">
            {title}
          </span>
          <div className="font-editorial text-3xl sm:text-4xl font-normal text-[#243B3B] tracking-tight pt-1">
            {value}
          </div>
        </div>

        {/* Circular Subtle Icon Badge */}
        <div className="w-10 h-10 rounded-full bg-[#FEEDE1] text-[#5A102A] flex items-center justify-center shrink-0 border border-[#DDD7D0]/60">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Trend indicator */}
      <div className="flex items-center gap-1.5 pt-4 text-xs font-medium text-emerald-700 font-inter">
        <ArrowUpRight className="w-3.5 h-3.5" />
        <span>{trend.replace("this month", t("thisMonth", "this month"))}</span>
      </div>
    </div>
  );
}
