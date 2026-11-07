"use client";

import { useEffect, useMemo, useState } from "react";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/components/admin/AdminTable";
import ServiceFormModal from "@/components/admin/ServiceFormModal";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  createService,
  deleteService,
  listServices,
  updateService,
} from "@/lib/api/services";
import type { Service, ServiceInput } from "@/types/service";

const PER_PAGE = 10;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /** Pulls the list from the API layer. Called after each write. */
  async function refresh() {
    setLoading(true);
    try {
      setServices(await listServices());
      setLoadError(null);
    } catch {
      setLoadError("Could not load the services. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    listServices()
      .then((data) => {
        if (active) setServices(data);
      })
      .catch(() => {
        if (active) {
          setLoadError("Could not load the services. Please refresh the page.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return services.filter((service) => {
      if (statusFilter && service.status !== statusFilter) return false;
      if (!term) return true;
      return [service.title, service.summary, service.outcome, service.slug]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [services, search, statusFilter]);

  /*
   * Clamped rather than reset: deleting the last row of the final page would
   * otherwise leave the table empty on a page that no longer exists.
   */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const stats = useMemo(
    () => ({
      total: services.length,
      published: services.filter((s) => s.status === "published").length,
      hidden: services.filter((s) => s.status === "hidden").length,
      featured: services.filter((s) => s.featured).length,
    }),
    [services],
  );

  async function handleSubmit(input: ServiceInput) {
    if (editing) {
      await updateService(editing.id, input);
    } else {
      await createService(input);
    }
    await refresh();
  }

  async function handleDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    try {
      await deleteService(deleting.id);
      await refresh();
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  const columns: AdminTableColumn<Service>[] = [
    {
      key: "service",
      label: "Service",
      render: (service) => (
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-[12px] font-semibold text-gray-900">
            {service.title}
            {service.featured && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                Featured
              </span>
            )}
          </p>
          <p className="truncate text-[11px] text-gray-400">{service.slug}</p>
        </div>
      ),
    },
    {
      key: "summary",
      label: "Summary",
      render: (service) => (
        <div className="max-w-[340px]">
          <p className="truncate text-[11px] font-medium text-gray-600">
            {service.outcome}
          </p>
          <p className="line-clamp-1 text-[11px] text-gray-400">
            {service.summary}
          </p>
        </div>
      ),
    },
    {
      key: "points",
      label: "Points",
      render: (service) => (
        <span className="text-[11px] text-gray-500">
          {service.points.length}
        </span>
      ),
    },
    {
      key: "position",
      label: "Order",
      render: (service) => (
        <span className="text-[11px] text-gray-500">{service.position}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (service) => (
        <StatusBadge
          status={service.status === "published" ? "Published" : "Hidden"}
          variant={service.status === "published" ? "success" : "neutral"}
          size="sm"
          dot
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (service) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label={`Edit ${service.title}`}
            onClick={() => {
              setEditing(service);
              setFormOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EditIcon />
          </button>

          <button
            type="button"
            aria-label={`Delete ${service.title}`}
            onClick={() => setDeleting(service)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services"
        description="Manage the services shown on the public Services page."
        breadcrumbs={[{ label: "Services" }]}
        action={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90"
          >
            <PlusIcon />
            Add New Service
          </button>
        }
      />

      {loadError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
          {loadError}
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard label="Total" value={stats.total} />
        <SummaryCard label="Published" value={stats.published} />
        <SummaryCard label="Hidden" value={stats.hidden} />
        <SummaryCard label="Featured" value={stats.featured} />
      </section>

      <AdminFilterBar
        searchPlaceholder="Search services by title or summary..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={[
          {
            label: "All Statuses",
            value: statusFilter,
            options: [
              { label: "Published", value: "published" },
              { label: "Hidden", value: "hidden" },
            ],
            onChange: (value) => {
              setStatusFilter(value);
              setPage(1);
            },
          },
        ]}
        onReset={() => {
          setSearch("");
          setStatusFilter("");
          setPage(1);
        }}
      />

      <AdminTable
        columns={columns}
        data={visible}
        loading={loading}
        rowKey={(service) => service.id}
        emptyMessage="No services match these filters."
      />

      {filtered.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={PER_PAGE}
          onPageChange={setPage}
        />
      )}

      {/* Keyed so each open starts from the right record's values. */}
      <ServiceFormModal
        key={editing?.id ?? "new"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        service={editing}
        onSubmit={handleSubmit}
      />

      <AdminModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete Service"
        description={`"${deleting?.title}" will be removed from the Services page.`}
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteBusy}
              className="inline-flex h-10 items-center rounded-md bg-red-600 px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {deleteBusy ? "Deleting…" : "Delete Service"}
            </button>
          </div>
        }
      >
        <p className="text-[12px] leading-relaxed text-gray-600">
          This cannot be undone. To take it off the page without losing the
          wording, set its status to Hidden instead.
        </p>
      </AdminModal>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="mt-1 text-[22px] font-bold text-gray-900">
        {value.toLocaleString("en-US")}
      </p>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}
