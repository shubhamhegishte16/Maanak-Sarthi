"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";

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

const MOCK_LOGS: LogItem[] = [
  {
    id: "log-1",
    timestamp: "2025-02-13 22:45:12",
    actor: "Admin (AD)",
    actionKey: "logAct1",
    action: "Gazette Standard Published",
    target: "IS 17431:2024",
    ipAddress: "10.14.22.81",
    severity: "info",
  },
  {
    id: "log-2",
    timestamp: "2025-02-13 20:12:05",
    actor: "System Audit Service",
    actionKey: "logAct2",
    action: "Automated Vector Index Sync",
    target: "QCO Knowledge Index",
    ipAddress: "127.0.0.1",
    severity: "info",
  },
  {
    id: "log-3",
    timestamp: "2025-02-13 18:30:40",
    actor: "Ananya Deshmukh (DPIIT)",
    actionKey: "logAct3",
    action: "QCO Enforcement Date Updated",
    target: "QCO-2025-17",
    ipAddress: "14.98.112.4",
    severity: "warning",
  },
  {
    id: "log-4",
    timestamp: "2025-02-13 15:02:18",
    actor: "Security Guardian",
    actionKey: "logAct4",
    action: "Failed Auth Attempt",
    target: "Admin Login Portal",
    ipAddress: "185.220.101.4",
    severity: "suspended",
  },
];

export default function LogsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  const filteredData = MOCK_LOGS.filter((l) => {
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

