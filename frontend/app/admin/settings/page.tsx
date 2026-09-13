"use client";

import React, { useState } from "react";
import { User, Shield, Bell, Database, Save, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"account" | "platform" | "security" | "notifications">("account");
  const [savedNotice, setSavedNotice] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState("System Admin");
  const [officialEmail, setOfficialEmail] = useState("admin@bisguidance.gov.in");
  const [department, setDepartment] = useState("Technical Directorate & Digital Infrastructure");
  const [timezone, setTimezone] = useState("IST (UTC+05:30)");

  const [aiModel, setAiModel] = useState("gemini-1.5-pro");
  const [threshold, setThreshold] = useState("0.85");
  const [autoIndex, setAutoIndex] = useState(true);
  const [maxCitations, setMaxCitations] = useState("5");

  const [enable2FA, setEnable2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [ipRestriction, setIpRestriction] = useState(false);

  const [qcoAlerts, setQcoAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [labExpiryAlerts, setLabExpiryAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  return (
    <AdminLayout>
      <PageHeader
        title={t("setPageTitle", "System & Platform Settings")}
        description={t(
          "setPageDesc",
          "Configure admin profile credentials, AI vector index grounding parameters, and security policies."
        )}
      />

      {/* Tabs Header */}
      <div className="flex border-b border-[#DDD7D0] mb-8 gap-6 overflow-x-auto font-inter">
        {[
          { id: "account", label: t("tabAccount", "Account Profile"), icon: User },
          { id: "platform", label: t("tabPlatform", "Platform & AI Grounding"), icon: Database },
          { id: "security", label: t("tabSecurity", "Security & Access"), icon: Shield },
          { id: "notifications", label: t("tabNotifications", "Notifications & Alerts"), icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? "border-[#5A102A] text-[#5A102A]"
                  : "border-transparent text-[#6F7F7D] hover:text-[#243B3B]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {savedNotice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t("settingsUpdatedMsg", "Settings updated successfully!")}</span>
        </div>
      )}

      {/* Tab Content Form */}
      <form onSubmit={handleSave} className="max-w-3xl space-y-8 font-inter">
        {/* TAB 1: ACCOUNT PROFILE */}
        {activeTab === "account" && (
          <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDD7D0]/60">
              <div>
                <h3 className="font-editorial text-xl text-[#243B3B] font-medium">
                  {t("adminProfileTitle", "Administrator Profile")}
                </h3>
                <p className="text-xs text-[#6F7F7D] mt-0.5">Manage official credentials and organizational details.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FEEDE1] text-[#5A102A] text-xs font-semibold">
                Super Admin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#243B3B] mb-1">
                  {t("displayName", "Display Name")} *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:ring-2 focus:ring-[#889794]/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243B3B] mb-1">
                  {t("officialEmail", "Official Email")} *
                </label>
                <input
                  type="email"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:ring-2 focus:ring-[#889794]/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243B3B] mb-1">
                  {t("deptDivision", "Department / Division")}
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:ring-2 focus:ring-[#889794]/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243B3B] mb-1">
                  {t("timezoneLabel", "Timezone")}
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:ring-2 focus:ring-[#889794]/40 outline-none"
                >
                  <option value="IST (UTC+05:30)">IST (UTC+05:30) India Standard Time</option>
                  <option value="UTC">UTC Universal Time Coordinated</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLATFORM & AI GROUNDING */}
        {activeTab === "platform" && (
          <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="pb-4 border-b border-[#DDD7D0]/60">
              <h3 className="font-editorial text-xl text-[#243B3B] font-medium">
                {t("tabPlatform", "Platform & AI Knowledge Grounding")}
              </h3>
              <p className="text-xs text-[#6F7F7D] mt-0.5">Control vector index retrieval, AI model thresholds, and citation rules.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#243B3B] mb-1">
                  {t("aiGroundingModel", "AI Grounding Model")}
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:ring-2 focus:ring-[#889794]/40 outline-none"
                >
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Source Grounded, High Precision)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast Real-time Response)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243B3B] mb-1">
                  {t("confidenceThreshold", "Confidence Threshold")}
                </label>
                <select
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:ring-2 focus:ring-[#889794]/40 outline-none"
                >
                  <option value="0.85">High Precision (0.85 Minimum Similarity Score)</option>
                  <option value="0.75">Balanced (0.75 Score)</option>
                  <option value="0.65">Flexible (0.65 Score)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243B3B] mb-1">
                  {t("maxCitations", "Max Citations Per Query")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={maxCitations}
                  onChange={(e) => setMaxCitations(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:ring-2 focus:ring-[#889794]/40 outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD7D0]">
                <div>
                  <p className="text-xs font-semibold text-[#243B3B]">{t("autoIndexPdf", "Auto-Index Gazette PDFs")}</p>
                  <p className="text-[11px] text-[#6F7F7D]">Automatically extract and embed newly uploaded BIS gazette documents.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoIndex}
                  onChange={(e) => setAutoIndex(e.target.checked)}
                  className="w-4 h-4 accent-[#5A102A] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & ACCESS */}
        {activeTab === "security" && (
          <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="pb-4 border-b border-[#DDD7D0]/60">
              <h3 className="font-editorial text-xl text-[#243B3B] font-medium">
                {t("tabSecurity", "Security & Access Controls")}
              </h3>
              <p className="text-xs text-[#6F7F7D] mt-0.5">Enforce multi-factor authentication, session limits, and access policies.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD7D0]">
                <div>
                  <p className="text-xs font-semibold text-[#243B3B]">{t("enable2FA", "Two-Factor Authentication (2FA)")}</p>
                  <p className="text-[11px] text-[#6F7F7D]">Require TOTP authenticator app code on every admin login.</p>
                </div>
                <input
                  type="checkbox"
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                  className="w-4 h-4 accent-[#5A102A] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243B3B] mb-1">
                  {t("sessionTimeout", "Session Inactivity Timeout")}
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B] focus:ring-2 focus:ring-[#889794]/40 outline-none"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD7D0]">
                <div>
                  <p className="text-xs font-semibold text-[#243B3B]">{t("ipRestriction", "IP Access Restriction")}</p>
                  <p className="text-[11px] text-[#6F7F7D]">Restrict administrative portal logins to authorized institutional CIDR blocks.</p>
                </div>
                <input
                  type="checkbox"
                  checked={ipRestriction}
                  onChange={(e) => setIpRestriction(e.target.checked)}
                  className="w-4 h-4 accent-[#5A102A] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS & ALERTS */}
        {activeTab === "notifications" && (
          <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="pb-4 border-b border-[#DDD7D0]/60">
              <h3 className="font-editorial text-xl text-[#243B3B] font-medium">
                {t("tabNotifications", "Notifications & System Alerts")}
              </h3>
              <p className="text-xs text-[#6F7F7D] mt-0.5">Configure email broadcast triggers for administrative events.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD7D0]">
                <div>
                  <p className="text-xs font-semibold text-[#243B3B]">{t("qcoAlerts", "QCO Gazette Email Alerts")}</p>
                  <p className="text-[11px] text-[#6F7F7D]">Send notification when a new Quality Control Order is added or modified.</p>
                </div>
                <input
                  type="checkbox"
                  checked={qcoAlerts}
                  onChange={(e) => setQcoAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#5A102A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD7D0]">
                <div>
                  <p className="text-xs font-semibold text-[#243B3B]">{t("securityAlerts", "Security & Login Alerts")}</p>
                  <p className="text-[11px] text-[#6F7F7D]">Notify administrator upon unauthorized or failed authentication attempts.</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityAlerts}
                  onChange={(e) => setSecurityAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#5A102A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD7D0]">
                <div>
                  <p className="text-xs font-semibold text-[#243B3B]">{t("labExpiryAlerts", "Lab Renewal Expiry Alerts")}</p>
                  <p className="text-[11px] text-[#6F7F7D]">30-day advance notice for BIS lab recognition validity renewal dates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={labExpiryAlerts}
                  onChange={(e) => setLabExpiryAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#5A102A] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-[#FEEDE1] bg-[#5A102A] hover:bg-[#3E0B1C] transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t("saveSettingsBtn", "Save Settings")}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
