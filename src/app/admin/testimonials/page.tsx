"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import TestimonialFormModal from "@/components/admin/TestimonialFormModal";
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  updateTestimonial,
} from "@/lib/api/testimonials";
import type {
  AdminTestimonial,
  TestimonialInput,
} from "@/types/testimonial";

const PER_PAGE = 8;

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [deleting, setDeleting] = useState<AdminTestimonial | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /** Pulls the list from the API layer. Called after each write. */
  async function refresh() {
    setLoading(true);
    try {
      setTestimonials(await listTestimonials());
    } finally {
      setLoading(false);
    }
  }

  // Initial load. `loading` already starts true, so this only sets state
  // once the request resolves rather than synchronously on mount.
  useEffect(() => {
    let active = true;

    listTestimonials()
      .then((data) => {
        if (active) setTestimonials(data);
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

    return testimonials.filter((testimonial) => {
      if (statusFilter && testimonial.status !== statusFilter) return false;
      if (ratingFilter && testimonial.rating !== Number(ratingFilter)) {
        return false;
      }

      if (!term) return true;
      return [
        testimonial.name,
        testimonial.city,
        testimonial.purchase,
        testimonial.quote,
      ].some((field) => field.toLowerCase().includes(term));
    });
  }, [testimonials, search, statusFilter, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const stats = useMemo(
    () => ({
      total: testimonials.length,
      published: testimonials.filter((t) => t.status === "published").length,
      hidden: testimonials.filter((t) => t.status === "hidden").length,
      featured: testimonials.filter((t) => t.featured).length,
    }),
    [testimonials],
  );

  async function handleSubmit(input: TestimonialInput) {
    if (editing) {
      await updateTestimonial(editing.id, input);
    } else {
      await createTestimonial(input);
    }
    await refresh();
  }

  async function handleDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    try {
      await deleteTestimonial(deleting.id);
      await refresh();
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("");
    setRatingFilter("");
    setPage(1);
  }

  const columns: AdminTableColumn<AdminTestimonial>[] = [
    {
      key: "client",
      label: "Client",
      render: (testimonial) => (
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src={testimonial.avatar}
              alt=""
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-[12px] font-semibold text-gray-900">
              {testimonial.name}
              {testimonial.featured && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                  Featured
                </span>
              )}
            </p>
            <p className="truncate text-[11px] text-gray-400">
              {testimonial.city}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "quote",
      label: "Review",
      render: (testimonial) => (
        <div className="max-w-[320px]">
          <p className="truncate text-[11px] font-medium text-gray-600">
            {testimonial.purchase}
          </p>
          <p className="line-clamp-1 text-[11px] text-gray-400">
            {testimonial.quote}
          </p>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (testimonial) => <RatingStars rating={testimonial.rating} />,
    },
    {
      key: "status",
      label: "Status",
      render: (testimonial) => (
        <StatusBadge
          status={testimonial.status === "published" ? "Published" : "Hidden"}
          variant={testimonial.status === "published" ? "success" : "neutral"}
          size="sm"
          dot
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (testimonial) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label={`Edit testimonial from ${testimonial.name}`}
            onClick={() => {
              setEditing(testimonial);
              setFormOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EditIcon />
          </button>

          <button
            type="button"
            aria-label={`Delete testimonial from ${testimonial.name}`}
            onClick={() => setDeleting(testimonial)}
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
        title="Testimonials"
        description="Manage the client reviews shown on the home page."
        breadcrumbs={[{ label: "Testimonials" }]}
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
            Add New Testimonial
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard label="Total" value={stats.total} />
        <SummaryCard label="Published" value={stats.published} />
        <SummaryCard label="Hidden" value={stats.hidden} />
        <SummaryCard label="Featured" value={stats.featured} />
      </section>

      <AdminFilterBar
        searchPlaceholder="Search testimonials by name, city or quote..."
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
            label: "All Ratings",
            value: ratingFilter,
            options: [5, 4, 3, 2, 1].map((value) => ({
              label: `${value} Star${value !== 1 ? "s" : ""}`,
              value: String(value),
            })),
            onChange: (value) => {
              setRatingFilter(value);
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
        rowKey={(testimonial) => testimonial.id}
        emptyMessage="No testimonials match these filters."
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
      <TestimonialFormModal
        key={editing?.id ?? "new"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        testimonial={editing}
        onSubmit={handleSubmit}
      />

      <AdminModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete Testimonial"
        description={`The review from "${deleting?.name}" will be removed from the home page.`}
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
              {deleteBusy ? "Deleting…" : "Delete Testimonial"}
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

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          className={`h-3.5 w-3.5 ${index < rating ? "fill-current" : "fill-gray-200"}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
        </svg>
      ))}
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
