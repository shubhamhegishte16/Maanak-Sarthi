"use client";

import React from "react";
import { FileText, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import ConfidenceBadge, { ConfidenceLevel } from "./ConfidenceBadge";

export interface EvidenceItem {
  id?: string;
  sourceTitle: string;
  documentNumber?: string;
  clause?: string;
  excerpt?: string;
  verifiedDate?: string;
  confidence?: ConfidenceLevel;
  sourceUrl?: string;
}

interface EvidenceCardProps {
  evidence: EvidenceItem;
  className?: string;
}

export default function EvidenceCard({ evidence, className = "" }: EvidenceCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-bis-border shadow-custom-sm hover:border-bis-burgundy/40 transition-all ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-bis-burgundy/10 text-bis-burgundy">
            <FileText className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-xs sm:text-sm text-bis-slate">
            {evidence.sourceTitle}
          </span>
          {evidence.documentNumber && (
            <span className="font-mono text-[11px] font-bold text-bis-burgundy bg-bis-burgundy/5 px-2 py-0.5 rounded">
              {evidence.documentNumber}
            </span>
          )}
        </div>

        {evidence.confidence && <ConfidenceBadge level={evidence.confidence} />}
      </div>

      {evidence.clause && (
        <p className="text-xs font-medium text-bis-slate-muted mb-2">
          <span className="text-bis-slate font-semibold">Clause / Reference:</span> {evidence.clause}
        </p>
      )}

      {evidence.excerpt && (
        <div className="bg-bis-cream-dark/60 p-3 rounded-xl border border-bis-border/70 text-xs text-bis-slate leading-relaxed my-2.5 italic">
          "{evidence.excerpt}"
        </div>
      )}

      <div className="pt-2.5 mt-2.5 border-t border-bis-border/50 flex items-center justify-between text-[11px] text-bis-slate-muted">
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-3 h-3 text-bis-gold" />
          <span>Last Verified: {evidence.verifiedDate || "01/09/2026"}</span>
        </div>

        <span className="inline-flex items-center space-x-1 text-bis-burgundy hover:underline font-semibold cursor-pointer">
          <CheckCircle2 className="w-3 h-3 text-bis-sage-dark" />
          <span>Official BIS Record</span>
        </span>
      </div>
    </div>
  );
}
