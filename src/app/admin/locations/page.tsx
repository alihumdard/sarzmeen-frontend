"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import StatusBadge from "@/components/admin/StatusBadge";
import AddLocationModal from "@/components/admin/AddLocationModal";

type LocationType = "City" | "Area" | "Society";
type LocationStatus = "Published" | "Draft";

type LocationRow = {
  id: number;
  name: string;
  type: LocationType;
  parent: string | null;
  properties: number;
  projects: number;
  status: LocationStatus;
  featured: boolean;
  date: string;
  image: string;
};

const initialLocations: LocationRow[] = [
  {
    id: 1,
    name: "Lahore",
    type: "City",
    parent: null,
    properties: 4520,
    projects: 48,
    status: "Published",
    featured: true,
    date: "May 20, 2024 10:30 AM",
    image: "/images/city-1.jpg",
  },
  {
    id: 2,
    name: "Karachi",
    type: "City",
    parent: null,
    properties: 3980,
    projects: 36,
    status: "Published",
    featured: true,
    date: "May 19, 2024 09:15 AM",
    image: "/images/city-1.jpg",
  },
  {
    id: 3,
    name: "Islamabad",
    type: "City",
    parent: null,
    properties: 2450,
    projects: 28,
    status: "Published",
    featured: true,
    date: "May 18, 2024 05:40 PM",
    image: "/images/city-1.jpg",
  },
  {
    id: 4,
    name: "DHA Lahore",
    type: "Society",
    parent: "Lahore",
    properties: 1250,
    projects: 18,
    status: "Published",
    featured: true,
    date: "May 18, 2024 11:10 AM",
    image: "/images/property-1.jpg",
  },
  {
    id: 5,
    name: "Bahria Town Karachi",
    type: "Society",
    parent: "Karachi",
    properties: 1980,
    projects: 22,
    status: "Published",
    featured: true,
    date: "May 17, 2024 10:00 AM",
    image: "/images/property-1.jpg",
  },
  {
    id: 6,
    name: "Gulberg",
    type: "Area",
    parent: "Lahore",
    properties: 980,
    projects: 12,
    status: "Published",
    featured: false,
    date: "May 16, 2024 02:30 PM",
    image: "/images/interior-1.jpg",
  },
  {
    id: 7,
    name: "Johar Town",
    type: "Area",
    parent: "Lahore",
    properties: 760,
    projects: 8,
    status: "Published",
    featured: true,
    date: "May 15, 2024 04:20 PM",
    image: "/images/interior-1.jpg",
  },
  {
    id: 8,
    name: "Model Town",
    type: "Area",
    parent: "Lahore",
    properties: 680,
    projects: 6,
    status: "Draft",
    featured: false,
    date: "May 14, 2024 09:30 AM",
    image: "/images/interior-1.jpg",
  },
  {
    id: 9,
    name: "Clifton",
    type: "Area",
    parent: "Karachi",
    properties: 620,
    projects: 7,
    status: "Published",
    featured: false,
    date: "May 13, 2024 11:20 AM",
    image: "/images/interior-1.jpg",
  },
  {
    id: 10,
    name: "Faisal Town",
    type: "Society",
    parent: "Islamabad",
    properties: 540,
    projects: 5,
    status: "Published",
    featured: false,
    date: "May 12, 2024 03:45 PM",
    image: "/images/property-1.jpg",
  },
];

const typeBadgeClasses: Record<LocationType, string> = {
  City: "bg-blue-50 text-blue-600",
  Area: "bg-violet-50 text-violet-600",
  Society: "bg-emerald-50 text-emerald-600",
};

export default function LocationsPage() {
  const [locations, setLocations] = useState(initialLocations);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const itemsPerPage = 10;

  const cityOptions = useMemo(
    () =>
      Array.from(
        new Set(locations.filter((l) => l.type === "City").map((l) => l.name)),
      ),
    [locations],
  );

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return locations.filter((location) => {
      const matchesSearch =
        !query ||
        location.name.toLowerCase().includes(query) ||
        (location.parent ?? "").toLowerCase().includes(query);

      const matchesType = !type || location.type === type;

      const matchesCity =
        !city ||
        location.name === city ||
        location.parent === city;

      const matchesStatus = !status || location.status === status;

      return matchesSearch && matchesType && matchesCity && matchesStatus;
    });
  }, [locations, search, type, city, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLocations.length / itemsPerPage),
  );

  const paginatedLocations = filteredLocations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const resetFilters = () => {
    setSearch("");
    setType("");
    setCity("");
    setStatus("");
    setPage(1);
  };

  const deleteLocation = (id: number) => {
    setLocations((current) => current.filter((location) => location.id !== id));
  };

  const toggleFeatured = (id: number) => {
    setLocations((current) =>
      current.map((location) =>
        location.id === id
          ? { ...location, featured: !location.featured }
          : location,
      ),
    );
  };

  const columns: AdminTableColumn<LocationRow>[] = [
    {
      key: "index",
      label: "#",
      width: "44px",
      render: (_location, index) => (
        <span className="text-gray-400">
          {(page - 1) * itemsPerPage + index + 1}
        </span>
      ),
    },
    {
      key: "name",
      label: "Location Name",
      width: "22%",
      render: (location) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={location.image}
              alt={location.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>

          <Link
            href={`/admin/locations/${location.id}`}
            onClick={(event) => event.stopPropagation()}
            className="truncate text-[12px] font-semibold text-gray-800 hover:text-primary"
          >
            {location.name}
          </Link>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (location) => (
        <span
          className={[
            "inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium",
            typeBadgeClasses[location.type],
          ].join(" ")}
        >
          {location.type}
        </span>
      ),
    },
    {
      key: "parent",
      label: "Parent Location",
      render: (location) => (
        <span className="text-gray-500">{location.parent ?? "—"}</span>
      ),
    },
    {
      key: "properties",
      label: "Properties",
      align: "right",
      render: (location) => (
        <span className="font-medium text-gray-700">
          {location.properties.toLocaleString()}
        </span>
      ),
    },
    {
      key: "projects",
      label: "Projects",
      align: "right",
      render: (location) => (
        <span className="font-medium text-gray-700">
          {location.projects.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (location) => <StatusBadge status={location.status} />,
    },
    {
      key: "featured",
      label: "Featured",
      align: "center",
      render: (location) => (
        <button
          type="button"
          aria-label={
            location.featured ? "Remove from featured" : "Mark as featured"
          }
          onClick={(event) => {
            event.stopPropagation();
            toggleFeatured(location.id);
          }}
          className={[
            "transition-colors",
            location.featured
              ? "text-primary"
              : "text-gray-300 hover:text-primary",
          ].join(" ")}
        >
          <StarIcon filled={location.featured} />
        </button>
      ),
    },
    {
      key: "date",
      label: "Date Added",
      render: (location) => (
        <span className="whitespace-nowrap text-[11px] text-gray-400">
          {location.date}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (location) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(event) => event.stopPropagation()}
        >
          <Link
            href={`/admin/locations/${location.id}/edit`}
            aria-label="Edit Location"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EditIcon />
          </Link>

          <button
            type="button"
            aria-label="Delete Location"
            onClick={() => deleteLocation(location.id)}
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
        title="Locations Management"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Locations" },
          { label: "All Locations" },
        ]}
        action={
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <PlusIcon />
            Add New Location
          </button>
        }
      />

      <AddLocationModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Locations"
          value={locations.length}
          trend="+12.5%"
          icon={<LocationIcon />}
        />
        <SummaryCard
          label="Cities"
          value={locations.filter((l) => l.type === "City").length}
          trend="+7.7%"
          icon={<CityIcon />}
        />
        <SummaryCard
          label="Areas"
          value={locations.filter((l) => l.type === "Area").length}
          trend="+15.3%"
          icon={<AreaIcon />}
        />
        <SummaryCard
          label="Societies"
          value={locations.filter((l) => l.type === "Society").length}
          trend="+10.2%"
          icon={<SocietyIcon />}
        />
      </section>

      {/* Filters */}
      <AdminFilterBar
        searchPlaceholder="Search locations, cities, areas, societies..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={[
          {
            label: "All Types",
            value: type,
            options: [
              { label: "City", value: "City" },
              { label: "Area", value: "Area" },
              { label: "Society", value: "Society" },
            ],
            onChange: (value) => {
              setType(value);
              setPage(1);
            },
          },
          {
            label: "All Cities",
            value: city,
            options: cityOptions.map((value) => ({ label: value, value })),
            onChange: (value) => {
              setCity(value);
              setPage(1);
            },
          },
          {
            label: "All Status",
            value: status,
            options: [
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
            ],
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
          },
        ]}
        onReset={resetFilters}
        onExport={() => exportLocations(filteredLocations)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Table */}
      <section>
        <AdminTable
          columns={columns}
          data={paginatedLocations}
          rowKey={(location) => location.id}
          emptyMessage="No locations match your filters."
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredLocations.length}
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
  icon,
}: {
  label: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[11px] text-gray-500">{label}</p>
        <p className="mt-0.5 text-[19px] font-bold leading-none text-gray-900">
          {value.toLocaleString()}
        </p>
        <p className="mt-1.5 text-[9px] font-medium text-emerald-600">
          ↑ {trend}
          <span className="ml-1 font-normal text-gray-400">
            from last month
          </span>
        </p>
      </div>
    </div>
  );
}

function exportLocations(data: LocationRow[]) {
  const headers = [
    "Location Name",
    "Type",
    "Parent Location",
    "Properties",
    "Projects",
    "Status",
    "Featured",
    "Date Added",
  ];

  const rows = data.map((location) => [
    location.name,
    location.type,
    location.parent ?? "",
    location.properties,
    location.projects,
    location.status,
    location.featured ? "Yes" : "No",
    location.date,
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
  link.download = "locations.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s6.5-5.4 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.8" r="2.4" />
    </svg>
  );
}

function CityIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5l8-3 8 3v16" />
      <path d="M8 9h1M8 13h1M8 17h1M15 9h1M15 13h1M15 17h1M10 21v-4h4v4" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

function SocietyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 10.5 8.5-7 8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" />
      <path d="m14.5 6.5 3 3" />
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

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}
