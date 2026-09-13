"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  badgeColor?: string;
}

export default function ActionCard({
  title,
  description,
  href,
  icon: Icon,
  tag = "Next Workflow Step",
  badgeColor = "text-bis-burgundy bg-bis-burgundy/10",
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group block p-5 sm:p-6 bg-white rounded-2xl border border-bis-border hover:border-bis-burgundy shadow-custom-sm hover:shadow-custom-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${badgeColor} group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-bis-cream-dark text-bis-slate-muted">
          {tag}
        </span>
      </div>

      <h3 className="font-serif-title text-base sm:text-lg font-semibold text-bis-slate group-hover:text-bis-burgundy transition-colors">
        {title}
      </h3>
      <p className="mt-1 text-xs text-bis-slate-muted leading-relaxed line-clamp-2">
        {description}
      </p>

      <div className="mt-4 pt-3 border-t border-bis-border/50 flex items-center justify-between text-xs font-semibold text-bis-burgundy">
        <span>Proceed</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
