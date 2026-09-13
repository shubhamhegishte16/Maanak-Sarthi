"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export interface TimelineStep {
  number: string;
  title: string;
  subtitle?: string;
  description?: string;
  status: "completed" | "current" | "upcoming";
}

interface StepTimelineProps {
  steps: TimelineStep[];
  currentStepIndex?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function StepTimeline({
  steps,
  currentStepIndex = 0,
  orientation = "horizontal",
  className = "",
}: StepTimelineProps) {
  if (orientation === "vertical") {
    return (
      <div className={`space-y-6 ${className}`}>
        {steps.map((step, idx) => {
          const isDone = step.status === "completed" || idx < currentStepIndex;
          const isCurrent = step.status === "current" || idx === currentStepIndex;

          return (
            <div key={idx} className="relative flex items-start space-x-4">
              {/* Vertical connecting bar */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-full -ml-[1px] transition-colors ${
                    isDone ? "bg-bis-burgundy" : "bg-bis-border"
                  }`}
                />
              )}

              {/* Step indicator node */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                  isDone
                    ? "bg-bis-burgundy text-white shadow-sm"
                    : isCurrent
                    ? "bg-bis-burgundy/10 text-bis-burgundy ring-2 ring-bis-burgundy"
                    : "bg-bis-cream-dark text-bis-slate-muted border border-bis-border"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.number}
              </div>

              {/* Step content */}
              <div className="pt-0.5 space-y-1">
                <div className="flex items-center space-x-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent ? "text-bis-burgundy" : isDone ? "text-bis-slate" : "text-bis-slate-muted"
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.subtitle && (
                    <span className="text-[11px] font-normal text-bis-slate-muted">
                      • {step.subtitle}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-xs text-bis-slate-muted leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal for desktop, responsive wrap on mobile
  return (
    <div className={`w-full overflow-x-auto pb-2 ${className}`}>
      <div className="flex items-center min-w-[640px] justify-between">
        {steps.map((step, idx) => {
          const isDone = step.status === "completed" || idx < currentStepIndex;
          const isCurrent = step.status === "current" || idx === currentStepIndex;

          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center text-center space-y-1.5 flex-1 px-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isDone
                      ? "bg-bis-burgundy text-white shadow-sm"
                      : isCurrent
                      ? "bg-bis-burgundy/15 text-bis-burgundy ring-2 ring-bis-burgundy font-bold"
                      : "bg-bis-cream-dark text-bis-slate-muted border border-bis-border"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.number}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isCurrent ? "text-bis-burgundy" : isDone ? "text-bis-slate" : "text-bis-slate-muted"
                  }`}
                >
                  {step.title}
                </span>
                {step.subtitle && (
                  <span className="text-[10px] text-bis-slate-muted line-clamp-1">
                    {step.subtitle}
                  </span>
                )}
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 max-w-[60px] mx-1 transition-colors ${
                    isDone ? "bg-bis-burgundy" : "bg-bis-border"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
