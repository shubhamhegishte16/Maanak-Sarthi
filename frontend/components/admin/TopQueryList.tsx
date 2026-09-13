"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export interface QueryItem {
  rank: number;
  query: string;
  views: string;
}

const DEFAULT_QUERIES: QueryItem[] = [
  { rank: 1, query: "BIS certification for mobile chargers", views: "1.2k views" },
  { rank: 2, query: "QCO applicability for electrical items", views: "980 views" },
  { rank: 3, query: "Find BIS recognized labs near me", views: "760 views" },
  { rank: 4, query: "IS standards for food packaging", views: "542 views" },
  { rank: 5, query: "Harmful substances in toys (QCO)", views: "430 views" },
];

interface TopQueryListProps {
  queries?: QueryItem[];
}

export function TopQueryList({ queries = DEFAULT_QUERIES }: TopQueryListProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full font-inter">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDD7D0]/60">
        <h3 className="font-editorial text-2xl font-medium text-[#243B3B]">
          {t("topQueries", "Top Queries")}
        </h3>
        <Link
          href="/admin/documents"
          className="text-xs font-medium text-[#5A102A] hover:text-[#3E0B1C] flex items-center gap-1 transition-colors"
        >
          <span>{t("viewAll", "View all →")}</span>
        </Link>
      </div>

      {/* Ranked Queries List matching reference image */}
      <div className="divide-y divide-[#DDD7D0]/50 pt-2">
        {queries.map((item) => (
          <div
            key={item.rank}
            className="py-3.5 flex items-center gap-4 hover:bg-[#FEEDE1]/30 px-2 rounded-xl transition-colors"
          >
            {/* Numbered subtle circle */}
            <div className="w-7 h-7 rounded-full bg-[#FEEDE1] text-[#5A102A] font-medium text-xs flex items-center justify-center shrink-0 border border-[#DDD7D0]/60 font-inter">
              {item.rank}
            </div>

            {/* Query text */}
            <p className="flex-1 text-xs sm:text-sm font-medium text-[#243B3B] truncate">
              {t(`query${item.rank}`, item.query)}
            </p>

            {/* View count */}
            <span className="text-xs text-[#6F7F7D] font-normal shrink-0">
              {item.views}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
