"use client";

import React from "react";
import { MoreHorizontal, FileQuestion } from "lucide-react";
import { Pagination } from "./Pagination";
import { useLanguage } from "@/context/LanguageContext";

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  onActionClick?: (item: T, actionKey: string) => void;
  actions?: { label: string; key: string; destructive?: boolean }[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  onActionClick,
  actions = [{ label: "Edit", key: "edit" }, { label: "Delete", key: "delete", destructive: true }],
  currentPage = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  emptyStateTitle,
  emptyStateMessage,
}: DataTableProps<T>) {
  const { t } = useLanguage();
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  const resolvedEmptyTitle = emptyStateTitle || t("noRecordsFound", "No records found");
  const resolvedEmptyMsg = emptyStateMessage || t("noRecordsMsg", "There are no entries matching your search criteria.");

  return (
    <div className="bg-[#FDFBF7] border border-[#DDD7D0] rounded-2xl shadow-xs overflow-hidden font-inter">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#FEEDE1]/60 border-b border-[#DDD7D0] text-[11px] font-bold text-[#6F7F7D] uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-5 py-3.5 ${
                    col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-5 py-3.5 text-right w-16">{t("actions", "Actions")}</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD7D0]/60 text-xs text-[#243B3B]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="max-w-xs mx-auto space-y-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FEEDE1] text-[#5A102A] flex items-center justify-center mx-auto">
                      <FileQuestion className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-sm text-[#243B3B]">{resolvedEmptyTitle}</p>
                    <p className="text-xs text-[#6F7F7D]">{resolvedEmptyMsg}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = keyExtractor(item);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`hover:bg-[#FEEDE1]/30 transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-5 py-4 ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {col.accessor ? col.accessor(item) : (item as any)[col.key]}
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="px-5 py-4 text-right relative">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === id ? null : id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-[#FEEDE1] text-[#6F7F7D] hover:text-[#5A102A] transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {activeMenuId === id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 mt-1 w-32 bg-[#FDFBF7] border border-[#DDD7D0] rounded-xl shadow-lg py-1 z-30 text-xs"
                            >
                              {actions.map((act) => {
                                const translatedLabel =
                                  act.key === "edit"
                                    ? t("edit", act.label)
                                    : act.key === "delete"
                                    ? t("delete", act.label)
                                    : t(act.key, act.label);
                                return (
                                  <button
                                    key={act.key}
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      if (onActionClick) onActionClick(item, act.key);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 hover:bg-[#FEEDE1]/60 transition-colors ${
                                      act.destructive ? "text-rose-700 font-medium" : "text-[#243B3B]"
                                    }`}
                                  >
                                    {translatedLabel}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Optional Pagination Footer */}
      {onPageChange && totalItems !== undefined && (
        <div className="p-4 border-t border-[#DDD7D0]/60">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
