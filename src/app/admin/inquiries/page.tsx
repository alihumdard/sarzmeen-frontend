"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import StatusBadge from "@/components/admin/StatusBadge";
import { api } from "@/lib/api/client";

type InquiryStatus = "new" | "pending" | "contacted" | "closed";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
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

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const fetchInquiries = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
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
          propertyType: string;
          location: string;
          image: string;
          date: string;
          createdAt: string;
        }>;
      }>(`/admin/inquiries${qs ? `?${qs}` : ""}`);
      setInquiries(
        res.data.map((i) => ({
          id: Number(i.id),
          name: i.name,
          email: i.email,
          phone: i.phone || "",
          property: i.property || "N/A",
          propertyType: i.propertyType || "",
          location: i.location || "",
          message: i.message,
          source: i.source || "website",
          status: i.status as InquiryStatus,
          date: i.date || new Date(i.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }),
          image: i.image || "/images/property-1.jpg",
        }))
      );
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const locationOptions = useMemo(
    () => Array.from(new Set(inquiries.map((item) => item.location).filter(Boolean))),
    [inquiries],
  );

  const sourceOptions = useMemo(
    () => Array.from(new Set(inquiries.map((item) => item.source).filter(Boolean))),
    [inquiries],
  );

  const filteredInquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inquiries.filter((inquiry) => {
      const matchesSearch =
        !query ||
        inquiry.name.toLowerCase().includes(query) ||
        inquiry.email.toLowerCase().includes(query) ||
        inquiry.phone.toLowerCase().includes(query);

      const matchesLocation = !location || inquiry.location === location;
      const matchesSource = !source || inquiry.source === source;
      const matchesPropertyType =
        !propertyType || inquiry.propertyType === propertyType;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSource &&
        matchesPropertyType
      );
    });
  }, [inquiries, search, location, source, propertyType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInquiries.length / itemsPerPage),
  );

  const paginatedInquiries = filteredInquiries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPropertyType("");
    setLocation("");
    setSource("");
    setPage(1);
  };

  const deleteInquiry = async (id: number) => {
    try {
      await api(`/admin/inquiries/${id}`, { method: "DELETE" });
      setInquiries((current) => current.filter((inquiry) => inquiry.id !== id));
    } catch {
      // silent
    }
  };

  const markContacted = async (id: number) => {
    try {
      await api(`/admin/inquiries/${id}/status`, {
        method: "PATCH",
        body: { status: "contacted" } as unknown as Record<string, unknown>,
      });
      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, status: "contacted" as InquiryStatus } : inquiry,
        ),
      );
    } catch {
      // silent
    }
  };

  const columns: AdminTableColumn<Inquiry>[] = [
    {
      key: "index",
      label: "#",
      width: "40px",
      render: (_inquiry, index) => (
        <span className="text-gray-400">
          {(page - 1) * itemsPerPage + index + 1}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      width: "14%",
      render: (inquiry) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
            {getInitials(inquiry.name)}
          </span>
          <span className="truncate font-semibold text-gray-800">
            {inquiry.name}
          </span>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact Info",
      render: (inquiry) => (
        <div className="min-w-0">
          <p className="truncate text-gray-600">{inquiry.email}</p>
          <p className="mt-0.5 text-[10px] text-gray-400">{inquiry.phone}</p>
        </div>
      ),
    },
    {
      key: "property",
      label: "Property / Project",
      render: (inquiry) => (
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={inquiry.image}
              alt={inquiry.property}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-800">
              {inquiry.property}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-400">
              {inquiry.location}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (inquiry) => (
        <span className="block max-w-[180px] truncate text-gray-500">
          {inquiry.message}
        </span>
      ),
    },
    {
      key: "source",
      label: "Source",
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
      render: (inquiry) => <StatusBadge status={capitalize(inquiry.status)} />,
    },
    {
      key: "date",
      label: "Date",
      render: (inquiry) => (
        <span className="whitespace-nowrap text-[11px] text-gray-400">
          {inquiry.date}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (inquiry) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="View Inquiry"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EyeIcon />
          </button>

          <button
            type="button"
            aria-label="Mark Contacted"
            onClick={() => markContacted(inquiry.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ReplyIcon />
          </button>

          <button
            type="button"
            aria-label="Delete Inquiry"
            onClick={() => deleteInquiry(inquiry.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
          >
            <TrashIcon />
          </button>

          <button
            type="button"
            aria-label="More actions"
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <MoreIcon />
          </button>
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
          value={inquiries.length}
          icon={<InquiryIcon />}
          iconClassName="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="New Inquiries"
          value={inquiries.filter((i) => i.status === "new").length}
          icon={<UserIcon />}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          label="Pending"
          value={inquiries.filter((i) => i.status === "pending").length}
          icon={<ClockIcon />}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          label="Contacted"
          value={inquiries.filter((i) => i.status === "contacted").length}
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
          data={paginatedInquiries}
          rowKey={(inquiry) => inquiry.id}
          emptyMessage="No inquiries match your filters."
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredInquiries.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        />
      </section>
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

function MoreIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}
