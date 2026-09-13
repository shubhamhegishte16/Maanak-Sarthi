"use client";

import React, { useState } from "react";
import { FileText, ShieldCheck, Award, FlaskConical } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { WelcomeCard } from "@/components/admin/WelcomeCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { StatCard } from "@/components/admin/StatCard";
import { RecentActivityList } from "@/components/admin/RecentActivityList";
import { TopQueryList } from "@/components/admin/TopQueryList";
import { AdminModal } from "@/components/admin/AdminModal";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", code: "", category: "" });

  const handleActionSelect = (actionKey: string) => {
    setActiveModal(actionKey);
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case "add-standard":
        return t("addNewStandard", "Add New Standard");
      case "create-qco":
        return t("createQco", "Create QCO");
      case "add-scheme":
        return t("addCertScheme", "Add Certification Scheme");
      case "register-lab":
        return t("registerLab", "Register Lab");
      default:
        return "Quick Action";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8 pb-8">
        {/* Top Hero Grid: Welcome Card + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <WelcomeCard />
          </div>
          <div className="lg:col-span-1">
            <QuickActionCard onActionSelect={handleActionSelect} />
          </div>
        </div>

        {/* 4 Statistics Cards Grid matching reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t("totalStandards", "Total Standards")}
            value="1,248"
            trend="+12 this month"
            icon={FileText}
          />
          <StatCard
            title={t("activeQcos", "Active QCOs")}
            value="86"
            trend="+5 this month"
            icon={ShieldCheck}
          />
          <StatCard
            title={t("certificationSchemes", "Certification Schemes")}
            value="32"
            trend="+2 this month"
            icon={Award}
          />
          <StatCard
            title={t("recognizedLabs", "Recognized Labs")}
            value="124"
            trend="+9 this month"
            icon={FlaskConical}
          />
        </div>

        {/* Bottom Content Grid: Recent Activity + Top Queries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <RecentActivityList />
          <TopQueryList />
        </div>
      </div>

      {/* Quick Action Interactive Modal */}
      <AdminModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={getModalTitle()}
        subtitle="Fill in the required information to publish to the platform."
        onSubmit={() => {
          alert(`Successfully created: ${formData.title || getModalTitle()}`);
          setFormData({ title: "", code: "", category: "" });
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              Title / Name *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., IS 17431:2024 Safety Requirements"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:outline-none focus:ring-2 focus:ring-[#889794]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              Identifier / Gazette Reference *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., QCO-2025-18 or IS 17431"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:outline-none focus:ring-2 focus:ring-[#889794]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              Sector / Department
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:outline-none focus:ring-2 focus:ring-[#889794]"
            >
              <option value="">Select Sector...</option>
              <option value="Electrical & Electronics">Electrical & Electronics</option>
              <option value="Mechanical & Pumps">Mechanical & Industrial</option>
              <option value="Chemicals & Materials">Chemicals & Consumer Products</option>
              <option value="Food & Agriculture">Food Safety & Agriculture</option>
            </select>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}
