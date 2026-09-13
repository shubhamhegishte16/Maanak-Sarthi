"use client";

import React from "react";
import { ArrowRight, FileText, ShieldCheck, Award, FlaskConical } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface QuickActionCardProps {
  onActionSelect?: (actionKey: string) => void;
}

export function QuickActionCard({ onActionSelect }: QuickActionCardProps) {
  const { t } = useLanguage();

  const actions = [
    {
      key: "add-standard",
      label: t("addNewStandard", "Add New Standard"),
      icon: FileText,
    },
    {
      key: "create-qco",
      label: t("createQco", "Create QCO"),
      icon: ShieldCheck,
    },
    {
      key: "add-scheme",
      label: t("addCertScheme", "Add Certification Scheme"),
      icon: Award,
    },
    {
      key: "register-lab",
      label: t("registerLab", "Register Lab"),
      icon: FlaskConical,
    },
  ];

  return (
    <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl p-6 h-full flex flex-col justify-between shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDD7D0]/60">
        <h3 className="font-editorial text-xl font-medium text-[#243B3B]">
          {t("quickActions", "Quick Actions")}
        </h3>
        <button
          className="text-[#5A102A] hover:text-[#3E0B1C] transition-colors p-1"
          title="Quick actions"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Action Rows matching reference image */}
      <div className="space-y-2.5 pt-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              onClick={() => onActionSelect && onActionSelect(action.key)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#FAF7F2] hover:bg-[#FEEDE1]/60 border border-[#DDD7D0]/80 hover:border-[#889794] rounded-xl text-xs font-medium text-[#243B3B] transition-all duration-200 group text-left cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-[#5A102A]/5 text-[#5A102A] group-hover:bg-[#5A102A] group-hover:text-[#FEEDE1] transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1 font-inter">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
