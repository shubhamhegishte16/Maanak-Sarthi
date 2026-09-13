"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function WelcomeCard() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-[#FEEDE1]/60 border border-[#DDD7D0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full min-h-[200px] shadow-xs">
      {/* Abstract Geometric Vector Artwork matching approved reference image */}
      <div className="absolute right-4 bottom-0 top-0 w-48 sm:w-64 pointer-events-none opacity-90 hidden sm:block">
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain object-right-bottom"
        >
          {/* Subtle Sand/Beige Arc */}
          <path
            d="M 120,40 A 50,50 0 0,1 170,90 L 120,90 Z"
            fill="#EAD9CC"
            opacity="0.75"
          />
          {/* Sage Quadrant / Quarter Circle */}
          <path
            d="M 60,160 A 80,80 0 0,1 140,80 L 140,160 Z"
            fill="#889794"
            opacity="0.85"
          />
          {/* Subtle Sage Line Outline */}
          <circle
            cx="130"
            cy="110"
            r="45"
            stroke="#6F7F7D"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.4"
          />
          {/* Decorative Corner Line */}
          <path
            d="M 50,140 C 70,100 100,60 160,50"
            stroke="#5A102A"
            strokeWidth="0.8"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg space-y-2">
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#6F7F7D]">
          {t("welcomeBack", "WELCOME BACK,")}
        </p>

        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[40px] leading-[1.15] text-[#243B3B] font-normal tracking-tight">
          {t("welcomeHeading", "Here’s what’s happening with BIS Guidance today.")}
        </h1>

        <p className="text-xs sm:text-sm text-[#6F7F7D] font-normal pt-1">
          {t(
            "welcomeSubtext",
            "Key statistics and recent activity across the platform."
          )}
        </p>
      </div>
    </div>
  );
}
