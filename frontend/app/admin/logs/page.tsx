"use client";

import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { adminApi } from "@/lib/api";

interface LogItem {
  id: string;
  timestamp: string;
  actor: string;
  actionKey: string;
  action: string;
  target: string;
  ipAddress: string;
  severity: "info" | "warning" | "enforced" | "suspended";
}

export default function LogsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await adminApi.getLogs();
      if (res.data.success) {
        const mapped = res.data.logs.map((l: any) => ({
          id: l.id,
          timestamp: l.created_at ? new Date(l.created_at).toLocaleString() : 'Unknown',
          actor: l.user_name || 'System',
          actionKey: l.id,
          action: l.action,
          target: l.module,
          ipAddress: '127.0.0.1', // Mock or add to schema if needed
          severity: 'info' as any, // Simple mapping for now
        }));
        setLogs(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = logs.filter((l) => {
    const matchesSearch =
      t(l.actionKey, l.action).toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase());
    const matchesSev = !severityFilter || l.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  const columns: Column<LogItem>[] = [
    {
      key: "timestamp",
      header: t("colTimestamp", "TIMESTAMP"),
      accessor: (item) => (
        <span className="font-mono text-xs text-[#243B3B] font-medium">{item.timestamp}</span>
      ),
    },
    {
      key: "actor",
      header: t("colActorSystem", "ACTOR / SYSTEM"),
      accessor: (item) => (
        <div>
          <p className="font-semibold text-[#243B3B]">{item.actor}</p>
          <span className="text-[10px] text-[#6F7F7D] font-mono">{item.ipAddress}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: t("colEventAction", "EVENT ACTION"),
      accessor: (item) => <span className="font-medium text-[#243B3B]">{t(item.actionKey, item.action)}</span>,
    },
    {
      key: "target",
      header: t("colTargetResource", "TARGET RESOURCE"),
      accessor: (item) => (
        <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#DDD7D0] text-xs font-mono text-[#5A102A]">
          {item.target}
        </span>
      ),
    },
    {
      key: "severity",
      header: t("colSeverity", "SEVERITY"),
      accessor: (item) => <StatusBadge status={item.severity} variant={item.severity} />,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={t("logPageTitle", "System Audit Logs & Security Trail")}
        description={t(
          "logPageDesc",
          "Immutable record of administrative actions, QCO gazette edits, security events, and AI index synchronization."
        )}
      >
        <button
          onClick={() => alert("Audit log report generated.")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#243B3B] bg-[#FDFBF7] hover:bg-[#FEEDE1]/60 border border-[#DDD7D0] transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t("exportLogBtn", "Export Audit Log (CSV)")}</span>
        </button>
      </PageHeader>

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchLogPlaceholder", "Search audit events, actors, or target resources...")}
        filterGroups={[
          {
            id: "severity",
            label: t("allSeverities", "All Severities"),
            options: [
              { label: "Info", value: "info" },
              { label: "Warning", value: "warning" },
              { label: "Critical", value: "suspended" },
            ],
          },
        ]}
        activeFilters={{ severity: severityFilter }}
        onFilterChange={(_, val) => setSeverityFilter(val)}
        onResetFilters={() => {
          setSearch("");
          setSeverityFilter("");
        }}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => item.id}
        totalItems={filteredData.length}
        actions={[{ label: "View Payload", key: "payload" }]}
        onActionClick={(item) => alert(`Log entry ID: ${item.id}\nAction: ${t(item.actionKey, item.action)}`)}
      />
    </AdminLayout>
  );
}

