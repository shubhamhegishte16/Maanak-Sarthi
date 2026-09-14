"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Shield, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminModal } from "@/components/admin/AdminModal";
import { useLanguage } from "@/context/LanguageContext";
import { adminApi } from "@/lib/api";

interface UserItem {
  id: string;
  name: string;
  email: string;
  roleKey: string;
  role: string;
  organization: string;
  status: string;
  lastLogin: string;
}

export default function UsersPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminApi.getUsers();
        if (res.data.success) {
          const mapped = res.data.users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            roleKey: `role${u.role}`,
            role: u.role,
            organization: 'BIS Headquarters', // Mock default or fetch from DB if available
            status: u.status || 'Active',
            lastLogin: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Unknown',
          }));
          setUsers(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredData = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.organization.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const columns: Column<UserItem>[] = [
    {
      key: "name",
      header: t("colUserProfile", "USER PROFILE & EMAIL"),
      accessor: (item) => (
        <div>
          <p className="font-semibold text-[#243B3B]">{item.name}</p>
          <span className="text-[11px] text-[#6F7F7D] font-mono">{item.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: t("colAccessRole", "ACCESS ROLE"),
      accessor: (item) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEEDE1] text-[#5A102A] text-xs font-semibold">
          <Shield className="w-3 h-3" />
          {t(item.roleKey, item.role)}
        </span>
      ),
    },
    {
      key: "organization",
      header: t("colOrgDept", "ORGANIZATION / DEPARTMENT"),
      accessor: (item) => <span className="text-xs text-[#243B3B]">{item.organization}</span>,
    },
    {
      key: "lastLogin",
      header: t("colLastActive", "LAST ACTIVE"),
      accessor: (item) => <span className="text-xs text-[#6F7F7D]">{item.lastLogin}</span>,
    },
    {
      key: "status",
      header: t("colAccountStatus", "ACCOUNT STATUS"),
      accessor: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={t("usrPageTitle", "User Management & Access Control")}
        description={t(
          "usrPageDesc",
          "Manage system administrator privileges, ministry nodal accounts, and lab auditor permissions."
        )}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FEEDE1] bg-[#5A102A] hover:bg-[#3E0B1C] transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t("provisionUserBtn", "Provision New User")}</span>
        </button>
      </PageHeader>

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchUserPlaceholder", "Search user name, email, or department...")}
        filterGroups={[
          {
            id: "role",
            label: t("allUserRoles", "All User Roles"),
            options: [
              { label: t("roleAdmin", "System Administrator"), value: "administrator" },
              { label: t("roleNodal", "Ministry Nodal Officer"), value: "nodal" },
              { label: t("roleLabAdmin", "Lab Administrator"), value: "lab" },
            ],
          },
        ]}
        activeFilters={{ role: roleFilter }}
        onFilterChange={(_, val) => setRoleFilter(val)}
        onResetFilters={() => {
          setSearch("");
          setRoleFilter("");
        }}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => item.id}
        totalItems={filteredData.length}
        onActionClick={(item, action) => alert(`Action "${action}" on user ${item.name}`)}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("provisionUserBtn", "Provision Admin User")}
        subtitle="Grant platform administrative or auditor privileges."
        onSubmit={() => alert("User account provisioned!")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243B3B] mb-1">
              {t("colUserProfile", "Full Name")} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Rajesh Sharma"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD7D0] rounded-xl text-[#243B3B]"
            />
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}

