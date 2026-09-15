"use client";

import { ReactNode } from "react";

export type AdminTableColumn<T> = {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: T, index: number) => ReactNode;
};

type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  data: T[];
  rowKey?: (item: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
};

export default function AdminTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "No records found.",
  className = "",
  onRowClick,
}: AdminTableProps<T>) {
  const getAlignClass = (align?: AdminTableColumn<T>["align"]) => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <div
      className={[
        "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
        className,
      ].join(" ")}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={[
                    "px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500",
                    getAlignClass(column.align),
                  ].join(" ")}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <LoadingRows columns={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-14 text-center text-[12px] text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <EmptyIcon />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={rowKey ? rowKey(item, index) : index}
                  onClick={() => onRowClick?.(item)}
                  className={[
                    "group transition-colors hover:bg-gray-50/70",
                    onRowClick ? "cursor-pointer" : "",
                  ].join(" ")}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={[
                        "px-4 py-3.5 align-middle text-[12px] text-gray-600",
                        getAlignClass(column.align),
                      ].join(" ")}
                    >
                      {column.render
                        ? column.render(item, index)
                        : getNestedValue(item, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getNestedValue<T>(item: T, key: string): ReactNode {
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (
      current !== null &&
      typeof current === "object" &&
      part in (current as Record<string, unknown>)
    ) {
      return (current as Record<string, unknown>)[part];
    }

    return undefined;
  }, item);

  if (value === null || value === undefined) {
    return "—";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return "—";
}

function LoadingRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <td key={columnIndex} className="px-4 py-4">
              <div className="h-4 w-full max-w-[150px] animate-pulse rounded bg-gray-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyIcon() {
  return (
    <svg
      className="h-8 w-8 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M8 9h8M8 13h5M8 17h3" />
    </svg>
  );
}