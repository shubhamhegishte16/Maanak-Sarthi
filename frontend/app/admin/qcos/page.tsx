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

interface QCOItem {
  id: string;
  qcoCode: string;
  titleKey: string;
  title: string;
  ministryKey: string;
  ministry: string;
  notifiedDate: string;
  enforcementDate: string;
  status: string;
}

const MOCK_QCOS: QCOItem[] = [
  {
    id: "qco-1",
    qcoCode: "QCO-2025-17",
    titleKey: "qcoTitle1",
    title: "Electrical Equipment (Quality Control) Amendment Order, 2025",
    ministryKey: "qcoMin1",
    ministry: "DPIIT / Ministry of Heavy Industries",
    notifiedDate: "15 Jan 2025",
    enforcementDate: "15 Jul 2025",
    status: "Enforced",
  },
  {
    id: "qco-2",
    qcoCode: "QCO-2024-88",
    titleKey: "qcoTitle2",
    title: "Toys (Quality Control) Order, 2024 Mandate",
    ministryKey: "qcoMin2",
    ministry: "Ministry of Commerce & Industry",
    notifiedDate: "01 Dec 2024",
    enforcementDate: "01 Jun 2025",
    status: "Active",
  },
  {
    id: "qco-3",
    qcoCode: "QCO-2024-42",
    titleKey: "qcoTitle3",
    title: "Solar PV Systems and Component Quality Order",
    ministryKey: "qcoMin3",
    ministry: "Ministry of New & Renewable Energy",
    notifiedDate: "20 Sep 2024",
    enforcementDate: "20 Mar 2025",
    status: "Under Review",
  },
  {
    id: "qco-4",
    qcoCode: "QCO-2024-12",
    titleKey: "qcoTitle4",
    title: "Chemicals & Petrochemicals (Quality Control) Mandate",
    ministryKey: "qcoMin4",
    ministry: "Department of Chemicals & Petrochemicals",
    notifiedDate: "10 May 2024",
    enforcementDate: "10 Nov 2024",
    status: "Enforced",
  },
];

export default function QCOsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = MOCK_QCOS.filter((item) => {
    const translatedTitle = t(item.titleKey, item.title);
    const matchesSearch =
      item.qcoCode.toLowerCase().includes(search.toLowerCase()) ||
      translatedTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns: Column<QCOItem>[] = [
    {
      key: "qcoCode",
      header: t("colQcoRef", "QCO REFERENCE"),
      accessor: (item) => (
        <span className="font-semibold text-[#5A102A] font-mono text-xs">{item.qcoCode}</span>
      ),
    },
    {
      key: "title",
      header: t("colQcoSubject", "QCO SUBJECT & SCOPE"),
      accessor: (item) => (
        <div>
          <p className="font-medium text-[#243B3B] max-w-md">{t(item.titleKey, item.title)}</p>
          <span className="text-[11px] text-[#6F7F7D]">{t(item.ministryKey, item.ministry)}</span>
        </div>
      ),
    },
    {
      key: "notifiedDate",
      header: t("colNotifiedDate", "NOTIFIED DATE"),
      accessor: (item) => <span className="text-xs text-[#6F7F7D]">{item.notifiedDate}</span>,
    },
    {
      key: "enforcementDate",
      header: t("colEnforcementDate", "ENFORCEMENT DATE"),
      accessor: (item) => (
        <span className="text-xs font-semibold text-[#243B3B]">{item.enforcementDate}</span>
      ),
    },
    {
      key: "status",
      header: t("colMandateStatus", "MANDATE STATUS"),
      accessor: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={t("qcoPageTitle", "Quality Control Orders (QCOs)")}
        description={t(
          "qcoPageDesc",
          "Monitor statutory gazette notifications, compulsory certification mandates, and Ministry enforcement dates."
        )}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FEEDE1] bg-[#5A102A] hover:bg-[#3E0B1C] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("createQcoBtn", "Create QCO Order")}</span>
        </button>
      </PageHeader>

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchQcoPlaceholder", "Search QCO code, title, or ministry...")}
        filterGroups={[
          {
            id: "status",
            label: t("allMandateStatuses", "All Mandate Statuses"),
            options: [
              { label: t("statusEnforced", "Enforced"), value: "enforced" },
              { label: t("statusActive", "Active"), value: "active" },
              { label: t("statusUnderReview", "Under Review"), value: "under_review" },
            ],
          },
        ]}
        activeFilters={{ status: statusFilter }}
        onFilterChange={(_, val) => setStatusFilter(val)}
        onResetFilters={() => {
          setSearch("");
          setStatusFilter("");
        }}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => item.id}
        totalItems={filteredData.length}
        onActionClick={(item, action) => {
          alert(`Action "${action}" on QCO ${item.qcoCode}`);
        }}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("createQcoBtn", "Create Quality Control Order")}
        subtitle="Issue a statutory QCO mandate into the compliance index."
        onSubmit={() => alert("QCO published successfully!")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colQcoRef", "QCO Reference")} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. QCO-2025-19"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colQcoSubject", "Order Title / Subject")} *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Full text title of the Quality Control Order notification..."
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            />
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}

