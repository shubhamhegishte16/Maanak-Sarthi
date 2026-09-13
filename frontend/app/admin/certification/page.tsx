"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminModal } from "@/components/admin/AdminModal";
import { useLanguage } from "@/context/LanguageContext";

interface SchemeItem {
  id: string;
  schemeCode: string;
  nameKey: string;
  name: string;
  audienceKey: string;
  targetAudience: string;
  standardsMapped: number;
  status: string;
  ruleKey: string;
  surveillanceInterval: string;
}

const MOCK_SCHEMES: SchemeItem[] = [
  {
    id: "sch-1",
    schemeCode: "SCHEME-I",
    nameKey: "schName1",
    name: "Product Certification Scheme (ISI Mark)",
    audienceKey: "schAudience1",
    targetAudience: "Domestic Manufacturers & Factories",
    standardsMapped: 850,
    status: "Active",
    ruleKey: "schRule1",
    surveillanceInterval: "Annual Audit & Market Sampling",
  },
  {
    id: "sch-2",
    schemeCode: "SCHEME-II",
    nameKey: "schName2",
    name: "Compulsory Registration Scheme (CRS)",
    audienceKey: "schAudience2",
    targetAudience: "Electronics & IT Goods Manufacturers",
    standardsMapped: 240,
    status: "Active",
    ruleKey: "schRule2",
    surveillanceInterval: "Self-Declaration with Lab Test",
  },
  {
    id: "sch-3",
    schemeCode: "SCHEME-IV",
    nameKey: "schName3",
    name: "Foreign Manufacturers Certification Scheme (FMCS)",
    audienceKey: "schAudience3",
    targetAudience: "Overseas Exporters to India",
    standardsMapped: 410,
    status: "Active",
    ruleKey: "schRule3",
    surveillanceInterval: "Pre-Licence Foreign Factory Inspection",
  },
  {
    id: "sch-4",
    schemeCode: "SCHEME-HM",
    nameKey: "schName4",
    name: "Hallmarking of Precious Metals (HUID)",
    audienceKey: "schAudience4",
    targetAudience: "Jewellers & Hallmarking Centers",
    standardsMapped: 12,
    status: "Active",
    ruleKey: "schRule4",
    surveillanceInterval: "Real-time Portal Audit & Sampling",
  },
];

export default function CertificationPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = MOCK_SCHEMES.filter(
    (s) =>
      s.schemeCode.toLowerCase().includes(search.toLowerCase()) ||
      t(s.nameKey, s.name).toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<SchemeItem>[] = [
    {
      key: "schemeCode",
      header: t("colSchemeCode", "SCHEME CODE"),
      accessor: (item) => (
        <span className="font-semibold text-[#5A102A] font-mono text-xs">{item.schemeCode}</span>
      ),
    },
    {
      key: "name",
      header: t("colConformityScheme", "CONFORMITY ASSESSMENT SCHEME"),
      accessor: (item) => (
        <div>
          <p className="font-semibold text-[#243B3B]">{t(item.nameKey, item.name)}</p>
          <span className="text-[11px] text-[#6F7F7D]">{t(item.audienceKey, item.targetAudience)}</span>
        </div>
      ),
    },
    {
      key: "standardsMapped",
      header: t("colMappedStandards", "MAPPED STANDARDS"),
      accessor: (item) => (
        <span className="text-xs font-medium text-[#243B3B]">
          {item.standardsMapped} {t("standards", "Standards")}
        </span>
      ),
    },
    {
      key: "surveillanceInterval",
      header: t("colSurveillanceRule", "AUDIT / SURVEILLANCE RULE"),
      accessor: (item) => (
        <span className="text-xs text-[#6F7F7D]">{t(item.ruleKey, item.surveillanceInterval)}</span>
      ),
    },
    {
      key: "status",
      header: t("colOpStatus", "OPERATIONAL STATUS"),
      accessor: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={t("certPageTitle", "Statutory Certification Schemes")}
        description={t(
          "certPageDesc",
          "Configure BIS conformity assessment lifecycle frameworks, factory surveillance rules, and product licensing guidelines."
        )}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FEEDE1] bg-[#5A102A] hover:bg-[#3E0B1C] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addSchemeBtn", "Add Scheme Framework")}</span>
        </button>
      </PageHeader>

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchCertPlaceholder", "Search certification schemes...")}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => item.id}
        totalItems={filteredData.length}
        onActionClick={(item, action) => alert(`Action "${action}" on scheme ${item.schemeCode}`)}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("addSchemeBtn", "Add Certification Scheme Framework")}
        subtitle="Define a new BIS conformity assessment scheme into the system registry."
        onSubmit={() => alert("Scheme created successfully!")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colSchemeCode", "Scheme Code")} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SCHEME-VI"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colConformityScheme", "Scheme Official Name")} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Management Systems Certification"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            />
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}

