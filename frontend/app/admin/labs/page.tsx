"use client";

import React, { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminModal } from "@/components/admin/AdminModal";
import { useLanguage } from "@/context/LanguageContext";

interface LabItem {
  id: string;
  code: string;
  nameKey: string;
  name: string;
  location: string;
  scopeKey: string;
  testingScope: string;
  status: string;
  validUntil: string;
}

const MOCK_LABS: LabItem[] = [
  {
    id: "lab-1",
    code: "LAB-MUM-01",
    nameKey: "labName1",
    name: "Thermo Test Labs Private Limited",
    location: "Mumbai, Maharashtra",
    scopeKey: "labScope1",
    testingScope: "Pumps, Motors & Industrial Cables (IS 17431, IS 694)",
    status: "Recognized",
    validUntil: "31 Dec 2026",
  },
  {
    id: "lab-2",
    code: "LAB-DEL-04",
    nameKey: "labName2",
    name: "National Testing House (NTH)",
    location: "Ghaziabad / New Delhi",
    scopeKey: "labScope2",
    testingScope: "Electronics, IT Devices & Batteries (IS 13252)",
    status: "Recognized",
    validUntil: "15 Oct 2027",
  },
  {
    id: "lab-3",
    code: "LAB-BLR-09",
    nameKey: "labName3",
    name: "Apex Precision Calibration & Test Facility",
    location: "Bengaluru, Karnataka",
    scopeKey: "labScope3",
    testingScope: "Toy Safety, Chemical Analysis (IS 9873)",
    status: "Recognized",
    validUntil: "20 Aug 2025",
  },
  {
    id: "lab-4",
    code: "LAB-CH-02",
    nameKey: "labName4",
    name: "Sun Energy PV Test Center",
    location: "Chennai, Tamil Nadu",
    scopeKey: "labScope4",
    testingScope: "Solar Modules & Inverters (IS 14286)",
    status: "Under Review",
    validUntil: "Pending Renewal",
  },
];

export default function LabsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = MOCK_LABS.filter((l) => {
    const matchesSearch =
      t(l.nameKey, l.name).toLowerCase().includes(search.toLowerCase()) ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      l.testingScope.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || l.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns: Column<LabItem>[] = [
    {
      key: "code",
      header: t("colLabCode", "LAB CODE"),
      accessor: (item) => (
        <span className="font-semibold text-[#5A102A] font-mono text-xs">{item.code}</span>
      ),
    },
    {
      key: "name",
      header: t("colLabNameLoc", "LABORATORY NAME & LOCATION"),
      accessor: (item) => (
        <div>
          <p className="font-semibold text-[#243B3B]">{t(item.nameKey, item.name)}</p>
          <div className="flex items-center gap-1 text-[11px] text-[#6F7F7D] mt-0.5">
            <MapPin className="w-3 h-3 text-[#889794]" />
            <span>{item.location}</span>
          </div>
        </div>
      ),
    },
    {
      key: "testingScope",
      header: t("colTestingScope", "RECOGNIZED TESTING SCOPE"),
      accessor: (item) => (
        <p className="text-xs text-[#243B3B] max-w-xs">{t(item.scopeKey, item.testingScope)}</p>
      ),
    },
    {
      key: "validUntil",
      header: t("colValidity", "RECOGNITION VALIDITY"),
      accessor: (item) => <span className="text-xs text-[#6F7F7D]">{item.validUntil}</span>,
    },
    {
      key: "status",
      header: t("colStatus", "STATUS"),
      accessor: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={t("labPageTitle", "BIS-Recognized Laboratories")}
        description={t(
          "labPageDesc",
          "Manage accredited testing facilities, NABL alignment, and recognized laboratory testing scopes."
        )}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FEEDE1] bg-[#5A102A] hover:bg-[#3E0B1C] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("registerLabBtn", "Register Laboratory")}</span>
        </button>
      </PageHeader>

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchLabPlaceholder", "Search lab name, location, or standards...")}
        filterGroups={[
          {
            id: "status",
            label: t("allStatuses", "All Statuses"),
            options: [
              { label: t("statusRecognized", "Recognized"), value: "recognized" },
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
        onActionClick={(item, action) => alert(`Action "${action}" on ${t(item.nameKey, item.name)}`)}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("registerLabBtn", "Register Testing Laboratory")}
        subtitle="Add a BIS recognized testing facility to the network."
        onSubmit={() => alert("Laboratory registered!")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colLabNameLoc", "Laboratory Legal Name")} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Thermo Test Labs Pvt Ltd"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            />
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}

