"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export type StatusVariant =
  | "active"
  | "published"
  | "enforced"
  | "recognized"
  | "draft"
  | "pending"
  | "under_review"
  | "suspended"
  | "cancelled"
  | "warning"
  | "info";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
}

const VARIANT_STYLES: Record<StatusVariant, string> = {
  active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  published: "bg-emerald-50 text-emerald-800 border-emerald-200",
  enforced: "bg-emerald-50 text-emerald-800 border-emerald-200",
  recognized: "bg-[#889794]/15 text-[#243B3B] border-[#889794]/30",
  draft: "bg-[#FEEDE1] text-[#5A102A] border-[#DDD7D0]",
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  under_review: "bg-amber-50 text-amber-800 border-amber-200",
  suspended: "bg-rose-50 text-rose-800 border-rose-200",
  cancelled: "bg-rose-50 text-rose-800 border-rose-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  info: "bg-sky-50 text-sky-800 border-sky-200",
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const { t } = useLanguage();
  const normKey = (variant || status.toLowerCase().replace(/\s+/g, "_")) as StatusVariant;
  const classes = VARIANT_STYLES[normKey] || "bg-[#FAF7F2] text-[#6F7F7D] border-[#DDD7D0]";

  const getTranslatedStatus = (st: string) => {
    const norm = st.toLowerCase().replace(/\s+/g, "_");
    if (norm === "active") return t("statusActive", st);
    if (norm === "under_review") return t("statusUnderReview", st);
    if (norm === "draft") return t("statusDraft", st);
    if (norm === "enforced") return t("statusEnforced", st);
    if (norm === "recognized") return t("statusRecognized", st);
    if (norm === "suspended") return t("statusSuspended", st);
    return st;
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border font-inter shadow-xs capitalize ${classes}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {getTranslatedStatus(status)}
    </span>
  );
}
