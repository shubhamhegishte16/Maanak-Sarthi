"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminModal } from "@/components/admin/AdminModal";
import { useLanguage } from "@/context/LanguageContext";
import { adminApi } from "@/lib/api";

interface StandardItem {
  id: string;
  isNumber: string;
  titleKey: string;
  title: string;
  sectorKey: string;
  sector: string;
  status: string;
  lastRevised: string;
  clausesCount: number;
}

export default function StandardsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [standards, setStandards] = useState<StandardItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({ is_number: '', title: '', sector: 'Mechanical' });

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    try {
      const res = await adminApi.getStandards();
      if (res.data.success) {
        const mapped = res.data.standards.map((s: any) => ({
          id: s.id,
          isNumber: s.is_number,
          titleKey: s.is_number, // fallback key
          title: s.title,
          sectorKey: `sector${s.sector.replace(/\s+/g, '')}`,
          sector: s.sector,
          status: s.status || 'Active',
          lastRevised: s.last_revised || 'Unknown',
          clausesCount: s.clauses_count || 0,
        }));
        setStandards(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch standards", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createStandard(formData);
      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({ is_number: '', title: '', sector: 'Mechanical' });
        fetchStandards();
      }
    } catch (error) {
      console.error("Failed to add standard", error);
      alert("Failed to add standard");
    }
  };

  const filteredData = standards.filter((item) => {
    const translatedTitle = t(item.titleKey, item.title);
    const matchesSearch =
      item.isNumber.toLowerCase().includes(search.toLowerCase()) ||
      translatedTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase());
    const matchesSector = !sectorFilter || item.sector === sectorFilter;
    const matchesStatus = !statusFilter || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesSector && matchesStatus;
  });

  const columns: Column<StandardItem>[] = [
    {
      key: "isNumber",
      header: t("colIsNumber", "IS NUMBER"),
      accessor: (item) => (
        <span className="font-semibold text-[#5A102A] font-mono text-xs">{item.isNumber}</span>
      ),
    },
    {
      key: "title",
      header: t("colStdTitleScope", "STANDARD TITLE & SCOPE"),
      accessor: (item) => (
        <div>
          <p className="font-medium text-[#243B3B]">{t(item.titleKey, item.title)}</p>
          <span className="text-[11px] text-[#6F7F7D]">
            {item.clausesCount} {t("techClauses", "Technical Clauses")}
          </span>
        </div>
      ),
    },
    {
      key: "sector",
      header: t("colSector", "SECTOR"),
      accessor: (item) => (
        <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#DDD7D0] text-xs font-medium text-[#243B3B]">
          {t(item.sectorKey, item.sector)}
        </span>
      ),
    },
    {
      key: "status",
      header: t("colStatus", "STATUS"),
      accessor: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "lastRevised",
      header: t("colLastRevised", "LAST REVISED"),
      accessor: (item) => <span className="text-xs text-[#6F7F7D]">{item.lastRevised}</span>,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={t("stdPageTitle", "Indian Standards Directory")}
        description={t(
          "stdPageDesc",
          "Manage verified Indian Standards (IS), clause index, and technical specifications across sectors."
        )}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FEEDE1] bg-[#5A102A] hover:bg-[#3E0B1C] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addNewStandardBtn", "Add New Standard")}</span>
        </button>
      </PageHeader>

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchByIsOrTitle", "Search by IS number or title...")}
        filterGroups={[
          {
            id: "sector",
            label: t("allSectors", "All Sectors"),
            options: [
              { label: t("sectorMechanical", "Mechanical"), value: "Mechanical" },
              { label: t("sectorElectronics", "Electronics"), value: "Electronics" },
              { label: t("sectorElectrical", "Electrical"), value: "Electrical" },
              { label: t("sectorConsumerGoods", "Consumer Goods"), value: "Consumer Goods" },
            ],
          },
          {
            id: "status",
            label: t("allStatuses", "All Statuses"),
            options: [
              { label: t("statusActive", "Active"), value: "active" },
              { label: t("statusUnderReview", "Under Review"), value: "under_review" },
              { label: t("statusDraft", "Draft"), value: "draft" },
            ],
          },
        ]}
        activeFilters={{ sector: sectorFilter, status: statusFilter }}
        onFilterChange={(id, val) => {
          if (id === "sector") setSectorFilter(val);
          if (id === "status") setStatusFilter(val);
        }}
        onResetFilters={() => {
          setSearch("");
          setSectorFilter("");
          setStatusFilter("");
        }}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => item.id}
        currentPage={currentPage}
        totalPages={1}
        totalItems={filteredData.length}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
        onActionClick={(item, action) => {
          alert(`Action "${action}" on standard ${item.isNumber}`);
        }}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("addNewStandardBtn", "Add New Indian Standard")}
        subtitle={t("adminSubStandard", "Register a new Indian Standard or amendment into the directory.")}
        onSubmit={handleAddStandard as any}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colIsNumber", "IS Number")} *
            </label>
            <input
              type="text"
              required
              value={formData.is_number}
              onChange={e => setFormData({...formData, is_number: e.target.value})}
              placeholder="e.g. IS 17431:2024"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colStdTitleScope", "Standard Title")} *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Full official title of the standard..."
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colSector", "Technical Sector")} *
            </label>
            <select 
              value={formData.sector}
              onChange={e => setFormData({...formData, sector: e.target.value})}
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            >
              <option value="Mechanical">{t("sectorMechanical", "Mechanical")}</option>
              <option value="Electronics">{t("sectorElectronics", "Electronics")}</option>
              <option value="Electrical">{t("sectorElectrical", "Electrical")}</option>
              <option value="Consumer Goods">{t("sectorConsumerGoods", "Consumer Goods")}</option>
            </select>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}

