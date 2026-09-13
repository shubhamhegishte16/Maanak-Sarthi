"use client";

import React from "react";
import { ShieldCheck, AlertCircle, HelpCircle } from "lucide-react";

export type ConfidenceLevel = "high" | "medium" | "low" | "verified";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  label?: string;
  className?: string;
}

export default function ConfidenceBadge({ level, label, className = "" }: ConfidenceBadgeProps) {
  const configs: Record<
    ConfidenceLevel,
    { text: string; bg: string; border: string; color: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    high: {
      text: label || "High Confidence",
      bg: "bg-bis-sage-light/80",
      border: "border-bis-sage/30",
      color: "text-bis-sage-dark",
      icon: ShieldCheck,
    },
    verified: {
      text: label || "BIS Gazette Verified",
      bg: "bg-bis-sage-light",
      border: "border-bis-sage/40",
      color: "text-bis-sage-dark",
      icon: ShieldCheck,
    },
    medium: {
      text: label || "Moderate Match",
      bg: "bg-bis-gold-light",
      border: "border-bis-gold/30",
      color: "text-bis-slate",
      icon: AlertCircle,
    },
    low: {
      text: label || "Requires Verification",
      bg: "bg-bis-cream-dark",
      border: "border-bis-border",
      color: "text-bis-slate-muted",
      icon: HelpCircle,
    },
  };

  const current = configs[level] || configs.medium;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${current.bg} ${current.border} ${current.color} ${className}`}
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span>{current.text}</span>
    </span>
  );
}
