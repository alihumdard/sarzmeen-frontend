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
import { listAdminBlogs, deleteAdminBlog, type AdminBlog } from "@/lib/api/adminBlogs";

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

const statusVariant: Record<string, "success" | "info" | "warning" | "neutral"> = {
  published: "success",
  draft: "neutral",
  pending: "warning",
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      const res = await listAdminBlogs(params.toString());
      setBlogs(res.data);
      setMeta(res.meta);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminBlog(id);
      load();
    } catch {
      // handle
    }
  };

  const columns: AdminTableColumn<AdminBlog>[] = [
    {
      key: "title",
      label: "Blog Post",
      width: "35%",
      render: (blog) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
            {blog.image && <Image src={blog.image} alt={blog.title} fill sizes="56px" className="object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-gray-800">{blog.title}</p>
            <p className="mt-1 text-[9px] text-gray-400">{blog.category || "Uncategorized"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      render: (blog) => <span className="text-gray-600">{blog.author?.name ?? "—"}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (blog) => (
        <StatusBadge
          status={blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
          variant={statusVariant[blog.status] ?? "neutral"}
        />
      ),
    },
    {
      key: "publishedAt",
      label: "Published",
      render: (blog) => <span className="text-[11px] text-gray-400">{blog.publishedAt ?? "—"}</span>,
    },
    {
      key: "readTime",
      label: "Read Time",
      render: (blog) => <span className="text-gray-500">{blog.readTime} min</span>,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (blog) => (
        <div onClick={(e) => e.stopPropagation()}>
          <AdminActionMenu
            actions={[
              { label: "Delete", onClick: () => handleDelete(blog.id), icon: <TrashIcon />, variant: "danger" },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Management"
        description="Manage blog posts."
        breadcrumbs={[{ label: "Content" }, { label: "Blogs" }]}
        action={
          <Link href="/admin/blogs" className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90">
            <PlusIcon /> New Blog Post
          </Link>
        }
      />

      <AdminFilterBar
        searchPlaceholder="Search blogs..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filters={[
          {
            label: "All Statuses",
            value: status,
            options: [
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Pending", value: "pending" },
            ],
            onChange: (v) => { setStatus(v); setPage(1); },
          },
        ]}
        onReset={() => { setSearch(""); setStatus(""); setPage(1); }}
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
            <AdminTable columns={columns} data={blogs} rowKey={(b) => b.id} emptyMessage="No blogs found." />
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
