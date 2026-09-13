"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const { t } = useLanguage();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DDD7D0]/60 text-xs font-inter text-[#6F7F7D]">
      <div>
        {t("showing", "Showing")} <span className="font-medium text-[#243B3B]">{totalItems > 0 ? startItem : 0}</span> {t("to", "to")}{" "}
        <span className="font-medium text-[#243B3B]">{endItem}</span> {t("of", "of")}{" "}
        <span className="font-medium text-[#243B3B]">{totalItems}</span> {t("entries", "entries")}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-[#DDD7D0] bg-[#FDFBF7] text-[#243B3B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FEEDE1]/50 transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-medium border transition-colors ${
              p === currentPage
                ? "bg-[#5A102A] text-[#FEEDE1] border-[#5A102A]"
                : "bg-[#FDFBF7] text-[#243B3B] border-[#DDD7D0] hover:bg-[#FEEDE1]/40"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-[#DDD7D0] bg-[#FDFBF7] text-[#243B3B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FEEDE1]/50 transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
