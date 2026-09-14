"use client";

import React, { useState, useEffect } from "react";
import { Plus, MapPin } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminModal } from "@/components/admin/AdminModal";
import { useLanguage } from "@/context/LanguageContext";
import { adminApi } from "@/lib/api";

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

export default function LabsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [labs, setLabs] = useState<LabItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({ name: '', city: '', state: '' });

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await adminApi.getLabs();
      if (res.data.success) {
        const mapped = res.data.labs.map((l: any) => ({
          id: l.id,
          code: l.recognition_id || `LAB-${l.id.substring(0, 5).toUpperCase()}`,
          nameKey: l.recognition_id || l.id,
          name: l.name,
          location: `${l.city || 'Unknown City'}, ${l.state || 'Unknown State'}`,
          scopeKey: l.id,
          testingScope: Array.isArray(l.supported_standards) ? l.supported_standards.join(', ') : (l.supported_standards || 'General Scope'),
          status: 'Recognized',
          validUntil: l.valid_through || 'Unknown',
        }));
        setLabs(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch labs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLab = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createLab(formData);
      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({ name: '', city: '', state: '' });
        fetchLabs();
      }
    } catch (error) {
      console.error("Failed to add lab", error);
      alert("Failed to add lab");
    }
  };

  const filteredData = labs.filter((l) => {
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
        onSubmit={handleAddLab as any}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colLabNameLoc", "Laboratory Legal Name")} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Thermo Test Labs Pvt Ltd"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#243B3B] mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                placeholder="e.g. Mumbai"
                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#243B3B] mb-1">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value})}
                placeholder="e.g. Maharashtra"
                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
              />
            </div>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}

