"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterGroups?: FilterGroup[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (filterId: string, value: string) => void;
  onResetFilters?: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  filterGroups = [],
  activeFilters = {},
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  const { t } = useLanguage();
  const resolvedSearchPlaceholder = searchPlaceholder || t("filterRecords", "Filter records...");

  return (
    <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-inter">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F7F7D]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={resolvedSearchPlaceholder}
          className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] text-xs sm:text-sm text-[#243B3B] placeholder-[#6F7F7D]/70 border border-[#DDD7D0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#889794]/40 focus:border-[#889794] transition-all"
        />
      </div>

      {/* Select Dropdowns & Reset */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {filterGroups.map((group) => (
          <div key={group.id} className="relative">
            <select
              value={activeFilters[group.id] || ""}
              onChange={(e) => onFilterChange && onFilterChange(group.id, e.target.value)}
              className="appearance-none bg-[#FAF7F2] text-xs text-[#243B3B] font-medium border border-[#DDD7D0] rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#889794]/40 cursor-pointer"
            >
              <option value="">{group.label}</option>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-[#6F7F7D] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ))}

        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6F7F7D] hover:text-[#5A102A] bg-[#FAF7F2] hover:bg-[#FEEDE1]/50 border border-[#DDD7D0] rounded-xl transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("reset", "Reset")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
