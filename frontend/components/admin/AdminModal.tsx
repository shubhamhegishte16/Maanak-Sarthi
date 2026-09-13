"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitText?: string;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitText = "Save Record",
}: AdminModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-inter">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#DDD7D0]/60 flex items-start justify-between bg-[#FEEDE1]/40">
          <div>
            <h2 className="font-editorial text-2xl font-normal text-[#243B3B]">{title}</h2>
            {subtitle && <p className="text-xs text-[#6F7F7D] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6F7F7D] hover:text-[#5A102A] hover:bg-[#FEEDE1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body & Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onSubmit) onSubmit(e);
            onClose();
          }}
        >
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>

          {/* Modal Actions */}
          <div className="px-6 py-4 border-t border-[#DDD7D0]/60 bg-[#FAF7F2] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#243B3B] hover:bg-[#FEEDE1]/60 border border-[#DDD7D0] transition-colors"
            >
              {t("cancel", "Cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-medium text-[#FEEDE1] bg-[#5A102A] hover:bg-[#3E0B1C] transition-colors shadow-xs"
            >
              {t("saveRecord", submitText)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
