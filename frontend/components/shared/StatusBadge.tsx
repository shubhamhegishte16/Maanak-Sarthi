"use client";

import React from "react";
import { Award, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export type StandardStatus =
  | "mandatory_qco"
  | "mandatory_isi"
  | "mandatory_crs"
  | "voluntary"
  | "under_revision"
  | "amended";

interface StatusBadgeProps {
  status: StandardStatus;
  label?: string;
  className?: string;
}

export default function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const configs: Record<
    StandardStatus,
    { text: string; bg: string; color: string; border: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    mandatory_qco: {
      text: label || "Mandatory QCO",
      bg: "bg-bis-burgundy/10",
      color: "text-bis-burgundy",
      border: "border-bis-burgundy/20",
      icon: Award,
    },
    mandatory_isi: {
      text: label || "Mandatory ISI (Scheme I)",
      bg: "bg-bis-burgundy/10",
      color: "text-bis-burgundy",
      border: "border-bis-burgundy/20",
      icon: Award,
    },
    mandatory_crs: {
      text: label || "Mandatory CRS (Scheme II)",
      bg: "bg-bis-sage/20",
      color: "text-bis-sage-dark",
      border: "border-bis-sage/30",
      icon: CheckCircle,
    },
    voluntary: {
      text: label || "Voluntary Standard",
      bg: "bg-bis-cream-dark",
      color: "text-bis-slate-muted",
      border: "border-bis-border",
      icon: Clock,
    },
    under_revision: {
      text: label || "Draft / Under Revision",
      bg: "bg-bis-gold-light",
      color: "text-bis-slate",
      border: "border-bis-gold/30",
      icon: AlertTriangle,
    },
    amended: {
      text: label || "Amendment Notified",
      bg: "bg-bis-terracotta/10",
      color: "text-bis-terracotta",
      border: "border-bis-terracotta/20",
      icon: AlertTriangle,
    },
  };

  const current = configs[status] || configs.voluntary;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${current.bg} ${current.color} ${current.border} ${className}`}
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span>{current.text}</span>
    </span>
  );
}
