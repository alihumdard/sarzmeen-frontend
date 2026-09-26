"use client";

import { useEffect, useMemo, useState } from "react";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/components/admin/AdminTable";
import ProjectCategoryFormModal from "@/components/admin/ProjectCategoryFormModal";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  createProjectCategory,
  deleteProjectCategory,
  listProjectCategories,
  updateProjectCategory,
} from "@/lib/api/projectCategories";
import type {
  ProjectCategory,
  ProjectCategoryInput,
} from "@/types/projectCategory";

const PER_PAGE = 8;

export default function ProjectCategoriesPage() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectCategory | null>(null);
  const [deleting, setDeleting] = useState<ProjectCategory | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /** Pulls the list from the API layer. Called after each write. */
  async function refresh() {
    setLoading(true);
    try {
      setCategories(await listProjectCategories());
    } finally {
      setLoading(false);
    }
  }

  // Initial load. `loading` already starts true, so this only sets state
  // once the request resolves rather than synchronously on mount.
  useEffect(() => {
    let active = true;

    listProjectCategories()
      .then((data) => {
        if (active) setCategories(data);
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

    return categories.filter((category) => {
      if (statusFilter && category.status !== statusFilter) return false;

      if (featuredFilter === "yes" && !category.featured) return false;
      if (featuredFilter === "no" && category.featured) return false;

      if (!term) return true;
      return [category.name, category.slug, category.description].some(
        (field) => field.toLowerCase().includes(term),
      );
    });
  }, [categories, search, statusFilter, featuredFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const stats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((c) => c.status === "active").length,
      projects: categories.reduce((sum, c) => sum + c.projectCount, 0),
      featured: categories.filter((c) => c.featured).length,
    }),
    [categories],
  );

  async function handleSubmit(input: ProjectCategoryInput) {
    if (editing) {
      await updateProjectCategory(editing.id, input);
    } else {
      await createProjectCategory(input);
    }
    await refresh();
  }

  async function handleDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    try {
      await deleteProjectCategory(deleting.id);
      await refresh();
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("");
    setFeaturedFilter("");
    setPage(1);
  }

  const columns: AdminTableColumn<ProjectCategory>[] = [
    {
      key: "name",
      label: "Category",
      render: (category) => (
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-900">
            {category.name}
            {category.featured && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                Featured
              </span>
            )}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-gray-400">
            /{category.slug}
          </p>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (category) => (
        <p className="line-clamp-1 max-w-[320px] text-[11px] text-gray-500">
          {category.description || "—"}
        </p>
      ),
    },
    {
      key: "count",
      label: "Projects",
      align: "right",
      render: (category) => (
        <span className="text-[12px] font-semibold text-gray-700">
          {category.projectCount.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (category) => (
        <StatusBadge
          status={category.status === "active" ? "Active" : "Inactive"}
          variant={category.status === "active" ? "success" : "neutral"}
          size="sm"
          dot
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (category) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label={`Edit ${category.name}`}
            onClick={() => {
              setEditing(category);
              setFormOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EditIcon />
          </button>

          <button
            type="button"
            aria-label={`Delete ${category.name}`}
            onClick={() => setDeleting(category)}
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
        title="Project Categories"
        description="Organise the categories that projects are filed under."
        breadcrumbs={[
          { label: "Projects", href: "/admin/projects" },
          { label: "Project Categories" },
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
            Add New Category
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard label="Total Categories" value={stats.total} />
        <SummaryCard label="Active" value={stats.active} />
        <SummaryCard label="Total Projects" value={stats.projects} />
        <SummaryCard label="Featured" value={stats.featured} />
      </section>

      <AdminFilterBar
        searchPlaceholder="Search project categories..."
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
            value: featuredFilter,
            options: [
              { label: "Featured only", value: "yes" },
              { label: "Not featured", value: "no" },
            ],
            onChange: (value) => {
              setFeaturedFilter(value);
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
        rowKey={(category) => category.id}
        emptyMessage="No project categories match these filters."
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
      <ProjectCategoryFormModal
        key={editing?.id ?? "new"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        category={editing}
        onSubmit={handleSubmit}
      />

      <AdminModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete Project Category"
        description={`"${deleting?.name}" will be removed. Projects in it keep their data but lose this category.`}
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
              {deleteBusy ? "Deleting…" : "Delete Category"}
            </button>
          </div>
        }
      >
        <p className="text-[12px] leading-relaxed text-gray-600">
          This cannot be undone.
          {deleting && deleting.projectCount > 0 && (
            <>
              {" "}
              <span className="font-semibold text-gray-800">
                {deleting.projectCount.toLocaleString("en-US")} projects
              </span>{" "}
              are currently filed under it.
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
