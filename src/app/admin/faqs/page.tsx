"use client";

import { useEffect, useMemo, useState } from "react";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/components/admin/AdminTable";
import FaqFormModal from "@/components/admin/FaqFormModal";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  createFaq,
  deleteFaq,
  listFaqs,
  updateFaq,
} from "@/lib/api/faqs";
import type { Faq, FaqInput } from "@/types/faq";

const PER_PAGE = 8;

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [deleting, setDeleting] = useState<Faq | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /** Pulls the list from the API layer. Called after each write. */
  async function refresh() {
    setLoading(true);
    try {
      setFaqs(await listFaqs());
    } finally {
      setLoading(false);
    }
  }

  // Initial load. `loading` already starts true, so this only sets state
  // once the request resolves rather than synchronously on mount.
  useEffect(() => {
    let active = true;

    listFaqs()
      .then((data) => {
        if (active) setFaqs(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(faqs.map((faq) => faq.category))].sort(),
    [faqs],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      if (statusFilter && faq.status !== statusFilter) return false;
      if (categoryFilter && faq.category !== categoryFilter) return false;

      if (!term) return true;
      return [faq.question, faq.answer, faq.category].some((field) =>
        field.toLowerCase().includes(term),
      );
    });
  }, [faqs, search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const stats = useMemo(
    () => ({
      total: faqs.length,
      published: faqs.filter((f) => f.status === "published").length,
      hidden: faqs.filter((f) => f.status === "hidden").length,
      categories: categories.length,
    }),
    [faqs, categories],
  );

  async function handleSubmit(input: FaqInput) {
    if (editing) {
      await updateFaq(editing.id, input);
    } else {
      await createFaq(input);
    }
    await refresh();
  }

  async function handleDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    try {
      await deleteFaq(deleting.id);
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

  const columns: AdminTableColumn<Faq>[] = [
    {
      key: "question",
      label: "Question",
      render: (faq) => (
        <div className="max-w-[380px]">
          <p className="text-[12px] font-semibold text-gray-900">
            {faq.question}
          </p>
          <p className="line-clamp-1 text-[11px] text-gray-400">
            {faq.answer}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (faq) => (
        <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
          {faq.category}
        </span>
      ),
    },
    {
      key: "order",
      label: "Order",
      align: "right",
      render: (faq) => (
        <span className="text-[12px] font-semibold text-gray-700">
          {faq.order}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (faq) => (
        <StatusBadge
          status={faq.status === "published" ? "Published" : "Hidden"}
          variant={faq.status === "published" ? "success" : "neutral"}
          size="sm"
          dot
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (faq) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label="Edit FAQ"
            onClick={() => {
              setEditing(faq);
              setFormOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EditIcon />
          </button>

          <button
            type="button"
            aria-label="Delete FAQ"
            onClick={() => setDeleting(faq)}
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
        title="FAQs"
        description="Manage the frequently asked questions shown on the contact page."
        breadcrumbs={[{ label: "FAQs" }]}
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
            Add New FAQ
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard label="Total" value={stats.total} />
        <SummaryCard label="Published" value={stats.published} />
        <SummaryCard label="Hidden" value={stats.hidden} />
        <SummaryCard label="Categories" value={stats.categories} />
      </section>

      <AdminFilterBar
        searchPlaceholder="Search FAQs by question or answer..."
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
          {
            label: "All Categories",
            value: categoryFilter,
            options: categories.map((category) => ({
              label: category,
              value: category,
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
        rowKey={(faq) => faq.id}
        emptyMessage="No FAQs match these filters."
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
      <FaqFormModal
        key={editing?.id ?? "new"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        faq={editing}
        categories={categories}
        onSubmit={handleSubmit}
      />

      <AdminModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete FAQ"
        description="This question will be removed from the contact page."
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
              {deleteBusy ? "Deleting…" : "Delete FAQ"}
            </button>
          </div>
        }
      >
        <p className="text-[12px] leading-relaxed text-gray-600">
          This cannot be undone.
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
