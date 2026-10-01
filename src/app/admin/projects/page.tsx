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
import { listAdminProjects, deleteAdminProject, type AdminProject } from "@/lib/api/adminProjects";

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

const statusVariant: Record<string, "success" | "info" | "warning" | "neutral"> = {
  active: "success",
  upcoming: "info",
  completed: "neutral",
  "on hold": "warning",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (search) params.set("search", search);
      const res = await listAdminProjects(params.toString());
      setProjects(res.data);
      setMeta(res.meta);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminProject(id);
      load();
    } catch {
      // handle
    }
  };

  const columns: AdminTableColumn<AdminProject>[] = [
    {
      key: "name",
      label: "Project",
      width: "30%",
      render: (project) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
            {project.image && <Image src={project.image} alt={project.name} fill sizes="56px" className="object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-gray-800">{project.name}</p>
            <p className="mt-1 text-[9px] text-gray-400">ID: {project.id}</p>
          </div>
        </div>
      ),
    },
    { key: "category", label: "Category", render: (p) => <span className="text-[10px] text-gray-600">{p.category || "—"}</span> },
    { key: "city", label: "City", render: (p) => <span className="text-gray-600">{p.city || "—"}</span> },
    { key: "developer", label: "Developer", render: (p) => <span className="text-gray-600">{p.developer || "—"}</span> },
    { key: "priceFrom", label: "Price From", render: (p) => <span className="font-medium text-gray-700">{p.priceFrom || "—"}</span> },
    {
      key: "status",
      label: "Status",
      render: (p) => (
        <StatusBadge
          status={p.status.charAt(0).toUpperCase() + p.status.slice(1)}
          variant={statusVariant[p.status.toLowerCase()] ?? "neutral"}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (project) => (
        <div onClick={(e) => e.stopPropagation()}>
          <AdminActionMenu
            actions={[
              { label: "Delete", onClick: () => handleDelete(project.id), icon: <TrashIcon />, variant: "danger" },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects Management"
        description="Manage all real estate projects."
        breadcrumbs={[{ label: "Projects" }, { label: "All Projects" }]}
        action={
          <Link href="/admin/projects/add" className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90">
            <PlusIcon /> Add New Project
          </Link>
        }
      />

      <AdminFilterBar
        searchPlaceholder="Search projects..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filters={[]}
        onReset={() => { setSearch(""); setPage(1); }}
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
            <AdminTable columns={columns} data={projects} rowKey={(p) => p.id} emptyMessage="No projects found." />
            {meta && (
              <AdminPagination currentPage={meta.current_page} totalPages={meta.last_page} totalItems={meta.total} itemsPerPage={meta.per_page} onPageChange={setPage} />
            )}
          </>
        )}
      </section>
    </div>
  );
}

function PlusIcon() { return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>; }
function TrashIcon() { return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg>; }
