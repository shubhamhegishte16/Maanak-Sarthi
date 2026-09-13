"use client";

import React, { useState } from "react";
import { Upload, FileCode } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { AdminModal } from "@/components/admin/AdminModal";
import { useLanguage } from "@/context/LanguageContext";

interface DocItem {
  id: string;
  name: string;
  categoryKey: string;
  category: string;
  size: string;
  uploadedAt: string;
  standardsCount: number;
  status: string;
}

const MOCK_DOCS: DocItem[] = [
  {
    id: "doc-1",
    name: "Gazette_Notification_QCO_Electrical_2025.pdf",
    categoryKey: "docCatQco",
    category: "QCO Notification",
    size: "2.4 MB",
    uploadedAt: "Yesterday, 14:30",
    standardsCount: 14,
    status: "Active",
  },
  {
    id: "doc-2",
    name: "IS_17431_2024_Technical_Specification_Draft.pdf",
    categoryKey: "docCatStd",
    category: "Standard Gazette",
    size: "5.8 MB",
    uploadedAt: "10 Feb 2025",
    standardsCount: 1,
    status: "Active",
  },
  {
    id: "doc-3",
    name: "NABL_Test_Protocol_Guideline_Pumps.pdf",
    categoryKey: "docCatTest",
    category: "Testing Protocol",
    size: "1.1 MB",
    uploadedAt: "05 Feb 2025",
    standardsCount: 6,
    status: "Active",
  },
  {
    id: "doc-4",
    name: "Toys_QCO_Amendment_2024_Official.pdf",
    categoryKey: "docCatQco",
    category: "QCO Notification",
    size: "3.2 MB",
    uploadedAt: "28 Jan 2025",
    standardsCount: 8,
    status: "Active",
  },
];

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = MOCK_DOCS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      t(d.categoryKey, d.category).toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<DocItem>[] = [
    {
      key: "name",
      header: t("colFileName", "DOCUMENT FILE NAME"),
      accessor: (item) => (
        <div className="flex items-center gap-2.5">
          <FileCode className="w-4 h-4 text-[#5A102A] shrink-0" />
          <span className="font-medium text-[#243B3B]">{item.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: t("colCategory", "CATEGORY"),
      accessor: (item) => (
        <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#DDD7D0] text-xs font-medium text-[#243B3B]">
          {t(item.categoryKey, item.category)}
        </span>
      ),
    },
    {
      key: "size",
      header: t("colFileSize", "FILE SIZE"),
      accessor: (item) => <span className="text-xs text-[#6F7F7D]">{item.size}</span>,
    },
    {
      key: "standardsCount",
      header: t("colIndexedStandards", "INDEXED STANDARDS"),
      accessor: (item) => (
        <span className="text-xs font-semibold text-[#5A102A]">
          {item.standardsCount} {t("docCited", "Cited")}
        </span>
      ),
    },
    {
      key: "uploadedAt",
      header: t("colUploadedDate", "UPLOADED DATE"),
      accessor: (item) => <span className="text-xs text-[#6F7F7D]">{item.uploadedAt}</span>,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={t("docPageTitle", "Document Repository & Gazette Index")}
        description={t(
          "docPageDesc",
          "Upload official BIS gazette notifications, standard documents, and test protocol manuals for AI index extraction."
        )}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FEEDE1] bg-[#5A102A] hover:bg-[#3E0B1C] transition-colors shadow-xs cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>{t("uploadGazetteBtn", "Upload Gazette / PDF")}</span>
        </button>
      </PageHeader>

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchDocPlaceholder", "Search document name or category...")}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => item.id}
        totalItems={filteredData.length}
        onActionClick={(item, action) => alert(`Action "${action}" on document ${item.name}`)}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("uploadGazetteBtn", "Upload Gazette / Standard Document")}
        subtitle="Upload official PDF or DOCX file to run AI citation indexing."
        onSubmit={() => alert("Document uploaded and indexed successfully!")}
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[#DDD7D0] rounded-2xl p-6 text-center bg-[#FAF7F2]">
            <Upload className="w-8 h-8 text-[#5A102A] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#243B3B]">Drag and drop your PDF / DOCX file</p>
            <p className="text-[11px] text-[#6F7F7D] mt-1">Maximum file size: 50MB</p>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}

