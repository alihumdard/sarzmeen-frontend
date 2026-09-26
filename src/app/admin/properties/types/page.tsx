"use client";

import { useEffect, useMemo, useState } from "react";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/components/admin/AdminTable";
import PropertyTypeFormModal from "@/components/admin/PropertyTypeFormModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { listCategories } from "@/lib/api/categories";
import {
  createPropertyType,
  deletePropertyType,
  listPropertyTypes,
  updatePropertyType,
} from "@/lib/api/propertyTypes";
import type { Category } from "@/types/category";
import type {
  PropertyTypeInput,
  PropertyTypeRecord,
} from "@/types/propertyType";

const PER_PAGE = 8;

export default function PropertyTypesPage() {
  const [types, setTypes] = useState<PropertyTypeRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PropertyTypeRecord | null>(null);
  const [deleting, setDeleting] = useState<PropertyTypeRecord | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /** Pulls the list from the API layer. Called after each write. */
  async function refresh() {
    setLoading(true);
    try {
      setTypes(await listPropertyTypes());
    } finally {
      setLoading(false);
    }
  }

  // Initial load. `loading` already starts true, so this only sets state
  // once the requests resolve rather than synchronously on mount.
  useEffect(() => {
    let active = true;

    Promise.all([listPropertyTypes(), listCategories()])
      .then(([typeRows, categoryRows]) => {
        if (!active) return;
        setTypes(typeRows);
        setCategories(categoryRows);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  /** Maps a category slug to its display name for the table column. */
  const categoryName = (slug: string) =>
    categories.find((category) => category.slug === slug)?.name ?? slug;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return types.filter((type) => {
      if (statusFilter && type.status !== statusFilter) return false;
      if (categoryFilter && type.category !== categoryFilter) return false;

      if (!term) return true;
      return [type.name, type.slug, type.description].some((field) =>
        field.toLowerCase().includes(term),
      );
    });
  }, [types, search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const stats = useMemo(
    () => ({
      total: types.length,
      active: types.filter((type) => type.status === "active").length,
      categories: new Set(types.map((type) => type.category)).size,
      featured: types.filter((type) => type.featured).length,
    }),
    [types],
  );

  async function handleSubmit(input: PropertyTypeInput) {
    if (editing) {
      await updatePropertyType(editing.id, input);
    } else {
      await createPropertyType(input);
    }
    await refresh();
  }

  async function handleDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    try {
      await deletePropertyType(deleting.id);
      await refresh();
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setPage(1);
  }

  const columns: AdminTableColumn<PropertyTypeRecord>[] = [
    {
      key: "name",
      label: "Property Type",
      render: (type) => (
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-900">
            {type.name}
            {type.featured && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                Featured
              </span>
            )}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-gray-400">
            /{type.slug}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (type) => (
        <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
          {categoryName(type.category)}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (type) => (
        <p className="line-clamp-1 max-w-[260px] text-[11px] text-gray-500">
          {type.description || "—"}
        </p>
      ),
    },
    {
      key: "count",
      label: "Listings",
      align: "right",
      render: (type) => (
        <span className="text-[12px] font-semibold text-gray-700">
          {type.propertyCount.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (type) => (
        <StatusBadge
          status={type.status === "active" ? "Active" : "Inactive"}
          variant={type.status === "active" ? "success" : "neutral"}
          size="sm"
          dot
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (type) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label={`Edit ${type.name}`}
            onClick={() => {
              setEditing(type);
              setFormOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EditIcon />
          </button>

          <button
            type="button"
            aria-label={`Delete ${type.name}`}
            onClick={() => setDeleting(type)}
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
        title="Property Types"
        description="Manage the types listings can be filed under inside each category."
        breadcrumbs={[
          { label: "Properties", href: "/admin/properties" },
          { label: "Property Types" },
        ]}
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
            Add New Type
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard label="Total Types" value={stats.total} />
        <SummaryCard label="Active" value={stats.active} />
        <SummaryCard label="Categories Used" value={stats.categories} />
        <SummaryCard label="Featured" value={stats.featured} />
      </section>

      <AdminFilterBar
        searchPlaceholder="Search property types..."
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
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            onChange: (value) => {
              setStatusFilter(value);
              setPage(1);
            },
          },
          {
            label: "All Categories",
            value: categoryFilter,
            options: categories.map((category) => ({
              label: category.name,
              value: category.slug,
            })),
            onChange: (value) => {
              setCategoryFilter(value);
              setPage(1);
            },
          },
        ]}
        onReset={resetFilters}
      />

      <AdminTable
        columns={columns}
        data={visible}
        loading={loading}
        rowKey={(type) => type.id}
        emptyMessage="No property types match these filters."
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
      <PropertyTypeFormModal
        key={editing?.id ?? "new"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        propertyType={editing}
        categories={categories}
        onSubmit={handleSubmit}
      />

      <AdminModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete Property Type"
        description={`"${deleting?.name}" will be removed. Listings using it keep their data but lose this type.`}
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
              {deleteBusy ? "Deleting…" : "Delete Type"}
            </button>
          </div>
        }
      >
        <p className="text-[12px] leading-relaxed text-gray-600">
          This cannot be undone.
          {deleting && deleting.propertyCount > 0 && (
            <>
              {" "}
              <span className="font-semibold text-gray-800">
                {deleting.propertyCount.toLocaleString("en-US")} listings
              </span>{" "}
              currently use it.
            </>
          )}
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
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}
