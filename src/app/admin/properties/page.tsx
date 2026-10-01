"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable, { AdminTableColumn } from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminActionMenu from "@/components/admin/AdminActionMenu";
import StatusBadge from "@/components/admin/StatusBadge";
import { api } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";

type Property = {
  id: string;
  slug: string;
  title: string;
  type: string;
  location: string;
  purpose: string;
  price: number;
  status: string;
  featured: boolean;
  views: number;
  image: string;
  listedAgo: string | null;
  beds: number | null;
  baths: number | null;
  area: string;
};

type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const statusVariant: Record<string, "success" | "info" | "warning" | "neutral"> = {
  published: "success",
  pending: "warning",
  draft: "neutral",
  expired: "info",
  rejected: "info",
};

function formatPKR(price: number): string {
  if (price >= 10_000_000) return `PKR ${(price / 10_000_000).toFixed(1)} Cr`;
  if (price >= 100_000) return `PKR ${(price / 100_000).toFixed(1)} Lac`;
  return `PKR ${price.toLocaleString()}`;
}

export default function PropertiesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [properties, setProperties] = useState<Property[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (status) params.set("status", status);
      if (search) params.set("search", search);

      // Admins moderate every listing; everyone else only owns theirs, and
      // /admin/properties 403s for them.
      const base = isAdmin ? "/admin/properties" : "/my/properties";

      const res = await api<{ data: Property[]; meta: PaginationMeta }>(
        `${base}?${params.toString()}`
      );
      setProperties(res.data);
      setMeta(res.meta);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [page, status, search, isAdmin]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api(`/admin/properties/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      loadProperties();
    } catch {
      // handle error
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const handleExport = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/admin/reports/properties?status=${status}`,
      "_blank"
    );
  };

  const columns: AdminTableColumn<Property>[] = [
    {
      key: "title",
      label: "Property",
      width: "30%",
      render: (property) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
            {property.image && (
              <Image src={property.image} alt={property.title} fill sizes="56px" className="object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-gray-800">{property.title}</p>
            <p className="mt-1 text-[9px] text-gray-400">ID: {property.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (property) => (
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <BuildingIcon />
          </span>
          <span className="text-[10px]">{property.type || "—"}</span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (property) => (
        <span className="max-w-[120px] leading-4 text-gray-600">{property.location || "—"}</span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (property) => (
        <span className="whitespace-nowrap font-medium text-gray-700">{formatPKR(property.price)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (property) => (
        <StatusBadge
          status={property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          variant={statusVariant[property.status] ?? "neutral"}
        />
      ),
    },
    {
      key: "views",
      label: "Views",
      align: "right",
      render: (property) => (
        <span className="font-medium text-gray-600">{property.views.toLocaleString()}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (property) => (
        <div onClick={(event) => event.stopPropagation()}>
          <AdminActionMenu
            actions={[
              // Status moderation is an admin-only endpoint.
              ...(!isAdmin ? [] : property.status === "pending"
                ? [
                    {
                      label: "Approve",
                      onClick: () => updateStatus(property.id, "published"),
                      icon: <CheckIcon />,
                    },
                    {
                      label: "Reject",
                      onClick: () => updateStatus(property.id, "rejected"),
                      icon: <CloseIcon />,
                      variant: "danger" as const,
                    },
                  ]
                : []),
              ...(!isAdmin ? [] : property.status === "published"
                ? [
                    {
                      label: "Mark Expired",
                      onClick: () => updateStatus(property.id, "expired"),
                      icon: <ExpiredIcon />,
                    },
                    {
                      label: "Mark Sold",
                      onClick: () => updateStatus(property.id, "sold"),
                      icon: <CheckIcon />,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Properties Management"
        description="Manage all property listings, statuses and featured properties."
        breadcrumbs={[{ label: "Properties" }, { label: "All Properties" }]}
        action={
          <Link
            href="/admin/properties/add"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90"
          >
            <PlusIcon />
            Add New Property
          </Link>
        }
      />

      {meta && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          <SummaryCard label="Total Properties" value={meta.total} icon={<BuildingIcon />} />
          <SummaryCard
            label="Current Page"
            value={properties.length}
            icon={<CheckIcon />}
          />
          <SummaryCard label="Page" value={meta.current_page} icon={<ClockIcon />} />
          <SummaryCard label="Total Pages" value={meta.last_page} icon={<DraftIcon />} />
        </section>
      )}

      <AdminFilterBar
        searchPlaceholder="Search properties..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={[
          {
            label: "All Statuses",
            value: status,
            options: [
              { label: "Published", value: "published" },
              { label: "Pending", value: "pending" },
              { label: "Draft", value: "draft" },
              { label: "Expired", value: "expired" },
              { label: "Rejected", value: "rejected" },
            ],
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
          },
        ]}
        onReset={resetFilters}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <section>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <AdminTable
              columns={columns}
              data={properties}
              rowKey={(property) => property.id}
              emptyMessage="No properties found."
            />
            {meta && (
              <AdminPagination
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                totalItems={meta.total}
                itemsPerPage={meta.per_page}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">{icon}</span>
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>
      <p className="mt-2 text-[19px] font-semibold leading-none text-gray-800">{value.toLocaleString()}</p>
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5l8-3 8 3v16" />
      <path d="M8 9h1M8 13h1M8 17h1M15 9h1M15 13h1M15 17h1M10 21v-4h4v4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function DraftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 4h14v16H5zM8 8h8M8 12h6M8 16h4" />
    </svg>
  );
}

function ExpiredIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5M12 16h.01" />
    </svg>
  );
}
