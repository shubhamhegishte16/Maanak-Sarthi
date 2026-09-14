"use client";

import React, { useState, useEffect } from "react";
import { Upload, FileCode } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { AdminModal } from "@/components/admin/AdminModal";
import { useLanguage } from "@/context/LanguageContext";
import { adminApi } from "@/lib/api";

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

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({ name: 'Uploaded Document', doc_type: 'PDF', size: '1.2 MB' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await adminApi.getDocuments();
      if (res.data.success) {
        const mapped = res.data.documents.map((d: any) => ({
          id: d.id,
          name: d.name,
          categoryKey: d.id,
          category: d.doc_type || 'Document',
          size: d.size || 'Unknown',
          uploadedAt: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Unknown',
          standardsCount: 0,
          status: d.status || 'Active',
        }));
        setDocuments(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createDocument({
        name: `New_Gazette_Document_${Date.now()}.pdf`,
        doc_type: 'PDF',
        size: '2.5 MB'
      });
      if (res.data.success) {
        setIsModalOpen(false);
        fetchDocuments();
      }
    } catch (error) {
      console.error("Failed to upload document", error);
      alert("Failed to upload document");
    }
  };

  const filteredData = documents.filter(
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
        onSubmit={handleAddDocument as any}
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[#DDD7D0] rounded-2xl p-6 text-center bg-[#FAF7F2]">
            <Upload className="w-8 h-8 text-[#5A102A] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#243B3B]">{t("docDragDrop", "Drag and drop your PDF / DOCX file")}</p>
            <p className="text-[11px] text-[#6F7F7D] mt-1">{t("docMaxFileSize", "Maximum file size: 50MB")}</p>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}

