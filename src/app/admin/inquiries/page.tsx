"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import StatusBadge from "@/components/admin/StatusBadge";

type InquiryStatus = "New" | "Pending" | "Contacted" | "Closed";

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

const initialInquiries: Inquiry[] = [
  {
    id: 1,
    name: "Ali Raza",
    email: "ali.raza@email.com",
    phone: "+92 300 1234567",
    property: "5 Marla House",
    propertyType: "House",
    location: "DHA Lahore",
    message: "I am interested in this property, please share more details.",
    source: "Website",
    status: "New",
    date: "May 20, 2024 10:30 AM",
    image: "/images/property-1.jpg",
  },
  {
    id: 2,
    name: "Sarah Khan",
    email: "sarah.khan@email.com",
    phone: "+92 321 9876543",
    property: "Bahria Town Plot",
    propertyType: "Plot",
    location: "Lahore",
    message: "Please share more details about payment plan.",
    source: "Contact Form",
    status: "Contacted",
    date: "May 19, 2024 09:15 AM",
    image: "/images/city-1.jpg",
  },
  {
    id: 3,
    name: "Usman Ahmed",
    email: "usman.ahmed@email.com",
    phone: "+92 333 4567890",
    property: "The Oaks Residence",
    propertyType: "Apartment",
    location: "Islamabad",
    message: "Is this project still available?",
    source: "Website",
    status: "Pending",
    date: "May 18, 2024 05:40 PM",
    image: "/images/project-1.jpg",
  },
  {
    id: 4,
    name: "Ayesha Malik",
    email: "ayesha.malik@email.com",
    phone: "+92 300 1122334",
    property: "3 Marla Plot",
    propertyType: "Plot",
    location: "Karachi",
    message: "Can you guide about payment options?",
    source: "WhatsApp",
    status: "Contacted",
    date: "May 18, 2024 11:10 AM",
    image: "/images/property-1.jpg",
  },
  {
    id: 5,
    name: "Fahad Hussain",
    email: "fahad.hussain@email.com",
    phone: "+92 321 6677889",
    property: "Apartment for Rent",
    propertyType: "Apartment",
    location: "Gulberg Lahore",
    message: "What is the monthly rent?",
    source: "Phone",
    status: "New",
    date: "May 17, 2024 10:00 AM",
    image: "/images/interior-1.jpg",
  },
  {
    id: 6,
    name: "Zainab Fatima",
    email: "zainab.fatima@email.com",
    phone: "+92 333 9988776",
    property: "Commercial Plot",
    propertyType: "Commercial",
    location: "Islamabad",
    message: "Interested in commercial plots in this sector.",
    source: "Website",
    status: "Pending",
    date: "May 16, 2024 02:30 PM",
    image: "/images/city-1.jpg",
  },
  {
    id: 7,
    name: "Bilal Khan",
    email: "bilal.khan@email.com",
    phone: "+92 300 5544332",
    property: "House for Sale",
    propertyType: "House",
    location: "Johar Town",
    message: "Kindly share location details.",
    source: "Facebook",
    status: "Contacted",
    date: "May 15, 2024 04:20 PM",
    image: "/images/property-1.jpg",
  },
  {
    id: 8,
    name: "Hira Noor",
    email: "hira.noor@email.com",
    phone: "+92 321 2233445",
    property: "New Metro City",
    propertyType: "Plot",
    location: "Kharian",
    message: "I want to book a visit.",
    source: "Website",
    status: "New",
    date: "May 14, 2024 09:30 AM",
    image: "/images/project-1.jpg",
  },
  {
    id: 9,
    name: "Ahmad Ali",
    email: "ahmad.ali@email.com",
    phone: "+92 333 7766554",
    property: "Farm House",
    propertyType: "House",
    location: "Islamabad",
    message: "Please send complete brochure.",
    source: "Email",
    status: "Contacted",
    date: "May 13, 2024 11:20 AM",
    image: "/images/interior-1.jpg",
  },
  {
    id: 10,
    name: "Maria Ahmed",
    email: "maria.ahmed@email.com",
    phone: "+92 300 8899001",
    property: "Plots on Installment",
    propertyType: "Plot",
    location: "Faisalabad",
    message: "What are the installment plans?",
    source: "Website",
    status: "Pending",
    date: "May 12, 2024 03:45 PM",
    image: "/images/city-1.jpg",
  },
];

const sourceBadgeClasses: Record<string, string> = {
  Website: "bg-blue-50 text-blue-600",
  "Contact Form": "bg-violet-50 text-violet-600",
  WhatsApp: "bg-emerald-50 text-emerald-600",
  Phone: "bg-red-50 text-red-600",
  Facebook: "bg-sky-50 text-sky-600",
  Email: "bg-amber-50 text-amber-600",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const locationOptions = useMemo(
    () => Array.from(new Set(inquiries.map((item) => item.location))),
    [inquiries],
  );

  const sourceOptions = useMemo(
    () => Array.from(new Set(inquiries.map((item) => item.source))),
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

      const matchesStatus = !status || inquiry.status === status;
      const matchesLocation = !location || inquiry.location === location;
      const matchesSource = !source || inquiry.source === source;
      const matchesPropertyType =
        !propertyType || inquiry.propertyType === propertyType;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesSource &&
        matchesPropertyType
      );
    });
  }, [inquiries, search, status, location, source, propertyType]);

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

  const deleteInquiry = (id: number) => {
    setInquiries((current) => current.filter((inquiry) => inquiry.id !== id));
  };

  const markContacted = (id: number) => {
    setInquiries((current) =>
      current.map((inquiry) =>
        inquiry.id === id ? { ...inquiry, status: "Contacted" } : inquiry,
      ),
    );
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
            sourceBadgeClasses[inquiry.source] ?? "bg-gray-100 text-gray-600",
          ].join(" ")}
        >
          {inquiry.source}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (inquiry) => <StatusBadge status={inquiry.status} />,
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

            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <CalendarIcon />
              May 01, 2024 - May 31, 2024
              <ChevronDownIcon />
            </button>
          </div>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Inquiries"
          value={inquiries.length}
          trend="+15.4%"
          icon={<InquiryIcon />}
          iconClassName="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="New Inquiries"
          value={inquiries.filter((i) => i.status === "New").length}
          trend="+22.1%"
          icon={<UserIcon />}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          label="Pending"
          value={inquiries.filter((i) => i.status === "Pending").length}
          trend="-12.5%"
          negative
          icon={<ClockIcon />}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          label="Contacted"
          value={inquiries.filter((i) => i.status === "Contacted").length}
          trend="+18.7%"
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
              { label: "New", value: "New" },
              { label: "Pending", value: "Pending" },
              { label: "Contacted", value: "Contacted" },
              { label: "Closed", value: "Closed" },
            ],
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
          },
          {
            label: "All Property Types",
            value: propertyType,
            options: [
              { label: "House", value: "House" },
              { label: "Plot", value: "Plot" },
              { label: "Apartment", value: "Apartment" },
              { label: "Commercial", value: "Commercial" },
            ],
            onChange: (value) => {
              setPropertyType(value);
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
            options: sourceOptions.map((value) => ({ label: value, value })),
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
  trend,
  negative,
  icon,
  iconClassName,
}: {
  label: string;
  value: number;
  trend: string;
  negative?: boolean;
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
        <p
          className={[
            "mt-1.5 text-[9px] font-medium",
            negative ? "text-red-500" : "text-emerald-600",
          ].join(" ")}
        >
          {negative ? "↓" : "↑"} {trend}
          <span className="ml-1 font-normal text-gray-400">
            from last month
          </span>
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

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
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
