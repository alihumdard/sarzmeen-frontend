"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminActionMenu from "@/components/admin/AdminActionMenu";
import StatusBadge from "@/components/admin/StatusBadge";
import { api } from "@/lib/api/client";

type InquiryStatus = "new" | "pending" | "contacted" | "closed";

type InquiryStats = {
  total: number;
  new: number;
  pending: number;
  contacted: number;
  closed: number;
};

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  project: string;
  propertyType: string;
  location: string;
  message: string;
  source: string;
  status: InquiryStatus;
  date: string;
  image: string;
};

const sourceBadgeClasses: Record<string, string> = {
  website: "bg-blue-50 text-blue-600",
  "contact form": "bg-violet-50 text-violet-600",
  whatsapp: "bg-emerald-50 text-emerald-600",
  phone: "bg-red-50 text-red-600",
  facebook: "bg-sky-50 text-sky-600",
  email: "bg-amber-50 text-amber-600",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function replySubject(inquiry: Inquiry) {
  const listing = inquiry.property || inquiry.project;
  return listing ? `Re: your inquiry - ${listing}` : "Re: your inquiry";
}

/*
 * Gmail web compose rather than mailto: — a mailto click is silently dropped
 * when the OS has no mail client registered, which looks like a dead button.
 */
function gmailComposeUrl(inquiry: Inquiry) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: inquiry.email,
    su: replySubject(inquiry),
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<InquiryStats>({
    total: 0,
    new: 0,
    pending: 0,
    contacted: 0,
    closed: 0,
  });
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Inquiry | null>(null);
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Debounce so each keystroke does not fire a request.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const [reloadKey, setReloadKey] = useState(0);

  const fetchInquiries = useCallback(async (signal?: AbortSignal) => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("per_page", String(itemsPerPage));
      if (status) params.set("status", status);
      if (source) params.set("source", source);
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      const qs = params.toString();
      const res = await api<{
        data: Array<{
          id: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          source: string;
          status: string;
          property: string;
          project: string;
          propertyType: string;
          location: string;
          image: string;
          date: string;
          createdAt: string;
        }>;
        meta: { total: number; last_page: number };
      }>(`/admin/inquiries${qs ? `?${qs}` : ""}`);
      setInquiries(
        res.data.map((i) => ({
          id: Number(i.id),
          name: i.name,
          email: i.email,
          phone: i.phone || "",
          property: i.property || "",
          project: i.project || "",
          propertyType: i.propertyType || "",
          location: i.location || "",
          message: i.message,
          source: i.source || "website",
          status: i.status as InquiryStatus,
          date: i.date || new Date(i.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }),
          image: i.image || "/images/property-1.jpg",
        }))
      );
      if (signal?.aborted) return;
      setTotalItems(res.meta?.total ?? 0);
      setTotalPages(Math.max(1, res.meta?.last_page ?? 1));
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, [status, source, debouncedSearch, page]);

  const fetchStats = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await api<{ data: InquiryStats }>("/admin/inquiries/stats");
      if (signal?.aborted) return;
      setStats(res.data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchInquiries(controller.signal);
    return () => controller.abort();
  }, [fetchInquiries, reloadKey]);

  useEffect(() => {
    const controller = new AbortController();
    fetchStats(controller.signal);
    return () => controller.abort();
  }, [fetchStats, reloadKey]);


  const locationOptions = useMemo(
    () => Array.from(new Set(inquiries.map((item) => item.location).filter(Boolean))),
    [inquiries],
  );

  const sourceOptions = useMemo(
    () => Array.from(new Set(inquiries.map((item) => item.source).filter(Boolean))),
    [inquiries],
  );

  /*
   * Search, status and source are resolved by the API across all pages.
   * Location and property type have no API filter yet, so they narrow the
   * current page only.
   */
  const filteredInquiries = useMemo(
    () =>
      inquiries.filter(
        (inquiry) =>
          (!location || inquiry.location === location) &&
          (!propertyType || inquiry.propertyType === propertyType),
      ),
    [inquiries, location, propertyType],
  );

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setPropertyType("");
    setLocation("");
    setSource("");
    setPage(1);
  };

  const deleteInquiry = async (id: number) => {
    setConfirmDelete(null);
    try {
      await api(`/admin/inquiries/${id}`, { method: "DELETE" });
      setInquiries((current) => current.filter((inquiry) => inquiry.id !== id));
      setReloadKey((k) => k + 1);
      setToast({ kind: "success", text: "Inquiry deleted." });
    } catch {
      setToast({ kind: "error", text: "Could not delete the inquiry." });
    }
  };

  const changeStatus = async (id: number, next: InquiryStatus) => {
    try {
      await api(`/admin/inquiries/${id}/status`, {
        method: "PATCH",
        body: { status: next } as unknown as Record<string, unknown>,
      });
      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, status: next } : inquiry,
        ),
      );
      setReloadKey((k) => k + 1);
      setToast({ kind: "success", text: `Marked as ${next}.` });
    } catch {
      setToast({ kind: "error", text: "Could not update the status." });
    }
  };

  const columns: AdminTableColumn<Inquiry>[] = [
    {
      key: "date",
      label: "Date",
      width: "120px",
      align: "left",
      render: (inquiry) => (
        <span className="whitespace-nowrap text-[11px] text-gray-500">
          {inquiry.date}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer Details",
      width: "34%",
      align: "left",
      render: (inquiry) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            {getInitials(inquiry.name)}
          </span>

          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-gray-800">
              {inquiry.name}
            </p>

            <a
              href={gmailComposeUrl(inquiry)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500 transition-colors hover:text-primary"
              title={`Reply to ${inquiry.email}`}
            >
              <MailIcon />
              <span className="truncate">{inquiry.email}</span>
            </a>

            {inquiry.phone && (
              <a
                href={`tel:${inquiry.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400 transition-colors hover:text-primary"
              >
                <PhoneIcon />
                <span className="truncate">{inquiry.phone}</span>
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "source",
      label: "Source",
      align: "center",
      render: (inquiry) => (
        <span
          className={[
            "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium",
            sourceBadgeClasses[inquiry.source.toLowerCase()] ?? "bg-gray-100 text-gray-600",
          ].join(" ")}
        >
          {capitalize(inquiry.source)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (inquiry) => <StatusBadge status={capitalize(inquiry.status)} />,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      headerAlign: "right",
      render: (inquiry) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="View Inquiry"
            onClick={() => setSelected(inquiry)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EyeIcon />
          </button>

          <a
            href={gmailComposeUrl(inquiry)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reply by email"
            title={`Reply to ${inquiry.email}`}
            onClick={() => changeStatus(inquiry.id, "contacted")}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ReplyIcon />
          </a>

          <button
            type="button"
            aria-label="Delete Inquiry"
            title="Delete inquiry"
            onClick={() => setConfirmDelete(inquiry)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
          >
            <TrashIcon />
          </button>

          <AdminActionMenu
            actions={[
              {
                label: "View details",
                onClick: () => setSelected(inquiry),
                icon: <EyeIcon />,
              },
              {
                label: "Copy email",
                onClick: () => {
                  navigator.clipboard
                    ?.writeText(inquiry.email)
                    .then(() => setToast({ kind: "success", text: "Email copied." }))
                    .catch(() => setToast({ kind: "error", text: "Could not copy." }));
                },
                icon: <CopyIcon />,
              },
              ...(inquiry.phone
                ? [
                    {
                      label: "Call",
                      onClick: () => {
                        window.location.href = `tel:${inquiry.phone}`;
                      },
                      icon: <PhoneIcon />,
                    },
                  ]
                : []),
              {
                label: "Mark as new",
                onClick: () => changeStatus(inquiry.id, "new"),
                dividerBefore: true,
                disabled: inquiry.status === "new",
              },
              {
                label: "Mark as pending",
                onClick: () => changeStatus(inquiry.id, "pending"),
                disabled: inquiry.status === "pending",
              },
              {
                label: "Mark as contacted",
                onClick: () => changeStatus(inquiry.id, "contacted"),
                disabled: inquiry.status === "contacted",
              },
              {
                label: "Mark as closed",
                onClick: () => changeStatus(inquiry.id, "closed"),
                disabled: inquiry.status === "closed",
              },
              {
                label: "Delete",
                onClick: () => setConfirmDelete(inquiry),
                icon: <TrashIcon />,
                variant: "danger" as const,
                dividerBefore: true,
              },
            ]}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inquiries Management"
        breadcrumbs={[
          { label: "Inquiries" },
          { label: "All Inquiries" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportInquiries(filteredInquiries)}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <DownloadIcon />
              Export
            </button>
          </div>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Inquiries"
          value={stats.total}
          icon={<InquiryIcon />}
          iconClassName="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="New Inquiries"
          value={stats.new}
          icon={<UserIcon />}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          label="Pending"
          value={stats.pending}
          icon={<ClockIcon />}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          label="Contacted"
          value={stats.contacted}
          icon={<CheckIcon />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* Filters */}
      <AdminFilterBar
        searchPlaceholder="Search inquiries by name, email, phone..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={[
          {
            label: "All Status",
            value: status,
            options: [
              { label: "New", value: "new" },
              { label: "Pending", value: "pending" },
              { label: "Contacted", value: "contacted" },
              { label: "Closed", value: "closed" },
            ],
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
          },
          {
            label: "All Locations",
            value: location,
            options: locationOptions.map((value) => ({ label: value, value })),
            onChange: (value) => {
              setLocation(value);
              setPage(1);
            },
          },
          {
            label: "All Sources",
            value: source,
            options: sourceOptions.map((value) => ({ label: capitalize(value), value })),
            onChange: (value) => {
              setSource(value);
              setPage(1);
            },
          },
        ]}
        onReset={resetFilters}
      />

      {/* Table */}
      <section>
        <AdminTable
          columns={columns}
          data={filteredInquiries}
          centerHeaders
          rowKey={(inquiry) => inquiry.id}
          onRowClick={(inquiry) => setSelected(inquiry)}
          emptyMessage="No inquiries match your filters."
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        />
      </section>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-[60] rounded-lg px-4 py-3 text-[12px] font-semibold shadow-lg ${
            toast.kind === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[15px] font-bold text-gray-900">
              Delete this inquiry?
            </h2>
            <p className="mt-1.5 text-[12px] leading-5 text-gray-500">
              The inquiry from{" "}
              <span className="font-semibold text-gray-700">
                {confirmDelete.name}
              </span>{" "}
              will be permanently removed. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="h-9 rounded-md border border-gray-200 px-4 text-[12px] font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteInquiry(confirmDelete.id)}
                className="h-9 rounded-md bg-red-600 px-4 text-[12px] font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <InquiryDetailModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onCopyEmail={() => {
            navigator.clipboard
              ?.writeText(selected.email)
              .then(() => setToast({ kind: "success", text: "Email copied." }))
              .catch(() => setToast({ kind: "error", text: "Could not copy." }));
          }}
          onStatusChange={async (next) => {
            try {
              await api(`/admin/inquiries/${selected.id}/status`, {
                method: "PATCH",
                body: { status: next } as unknown as Record<string, unknown>,
              });
              setInquiries((current) =>
                current.map((i) =>
                  i.id === selected.id ? { ...i, status: next } : i,
                ),
              );
              setSelected({ ...selected, status: next });
              setReloadKey((k) => k + 1);
            } catch {
              // silent
            }
          }}
        />
      )}
    </div>
  );
}

const statusChoices: InquiryStatus[] = ["new", "pending", "contacted", "closed"];

function InquiryDetailModal({
  inquiry,
  onClose,
  onStatusChange,
  onCopyEmail,
}: {
  inquiry: Inquiry;
  onClose: () => void;
  onStatusChange: (status: InquiryStatus) => void;
  onCopyEmail: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Inquiry details"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-bold text-primary">
              {getInitials(inquiry.name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-bold text-gray-900">
                {inquiry.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StatusBadge status={capitalize(inquiry.status)} />
                <span className="text-[11px] text-gray-400">{inquiry.date}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailRow
              label="Email"
              value={inquiry.email}
              href={gmailComposeUrl(inquiry)}
              external
            />
            <DetailRow
              label="Phone"
              value={inquiry.phone || "—"}
              href={inquiry.phone ? `tel:${inquiry.phone}` : undefined}
            />
            <DetailRow label="Source" value={capitalize(inquiry.source)} />
            <DetailRow label="Received" value={inquiry.date} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Inquired About
            </p>

            {inquiry.property ? (
              <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-gray-200">
                  <Image
                    src={inquiry.image}
                    alt={inquiry.property}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-600">
                    Property
                  </span>
                  <p className="mt-1 truncate text-[12px] font-semibold text-gray-800">
                    {inquiry.property}
                  </p>
                  {inquiry.location && (
                    <p className="mt-0.5 truncate text-[11px] text-gray-400">
                      {inquiry.location}
                    </p>
                  )}
                  {inquiry.propertyType && (
                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                      {inquiry.propertyType}
                    </p>
                  )}
                </div>
              </div>
            ) : inquiry.project ? (
              <div className="mt-1.5 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-600">
                  Project
                </span>
                <p className="mt-1 truncate text-[12px] font-semibold text-gray-800">
                  {inquiry.project}
                </p>
              </div>
            ) : (
              <p className="mt-1.5 rounded-lg border border-dashed border-gray-200 p-3 text-[11px] text-gray-400">
                General inquiry — not linked to a property or project.
              </p>
            )}
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Message
            </p>
            <p className="mt-1.5 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-[12px] leading-6 text-gray-700">
              {inquiry.message}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Status
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {statusChoices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => onStatusChange(choice)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    inquiry.status === choice
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {capitalize(choice)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-5 py-3">
          <button
            type="button"
            onClick={onCopyEmail}
            className="inline-flex h-9 items-center rounded-md border border-gray-200 px-3 text-[12px] font-semibold text-gray-600 hover:bg-gray-50"
          >
            Copy address
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${inquiry.email}?subject=${encodeURIComponent(replySubject(inquiry))}`}
              className="inline-flex h-9 items-center rounded-md border border-gray-200 px-3 text-[12px] font-semibold text-gray-600 hover:bg-gray-50"
            >
              Mail app
            </a>
            <a
              href={gmailComposeUrl(inquiry)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onStatusChange("contacted")}
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-[12px] font-semibold text-white hover:opacity-90"
            >
              Reply in Gmail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-0.5 block truncate text-[12px] font-medium text-primary hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-0.5 truncate text-[12px] font-medium text-gray-700">
          {value}
        </p>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  iconClassName,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <span
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
          iconClassName ?? "bg-primary/10 text-primary",
        ].join(" ")}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[11px] text-gray-500">{label}</p>
        <p className="mt-0.5 text-[19px] font-bold leading-none text-gray-900">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function exportInquiries(data: Inquiry[]) {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Property",
    "Location",
    "Message",
    "Source",
    "Status",
    "Date",
  ];

  const rows = data.map((inquiry) => [
    inquiry.name,
    inquiry.email,
    inquiry.phone,
    inquiry.property,
    inquiry.location,
    inquiry.message,
    inquiry.source,
    inquiry.status,
    inquiry.date,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "inquiries.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function DownloadIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function InquiryIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v12H8l-4 4V5Z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 10 4 15l5 5" />
      <path d="M4 15h10a6 6 0 0 0 6-6V7" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

