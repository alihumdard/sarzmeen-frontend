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
import AdminActionMenu from "@/components/admin/AdminActionMenu";
import StatusBadge from "@/components/admin/StatusBadge";

type PropertyStatus =
  | "Published"
  | "Pending"
  | "Draft"
  | "Expired";

type Property = {
  id: number;
  title: string;
  propertyId: string;
  type: string;
  location: string;
  price: string;
  status: PropertyStatus;
  featured: boolean;
  views: number;
  date: string;
  image: string;
};

const initialProperties: Property[] = [
  {
    id: 1,
    title: "Luxury Villa in DHA Lahore",
    propertyId: "PROP-1248",
    type: "House",
    location: "DHA Phase 6, Lahore",
    price: "PKR 8,50,00,000",
    status: "Published",
    featured: true,
    views: 2450,
    date: "May 20, 2024",
    image: "/images/property-1.jpg",
  },
  {
    id: 2,
    title: "Modern Apartment in Bahria Town",
    propertyId: "PROP-1247",
    type: "Apartment",
    location: "Bahria Town, Karachi",
    price: "PKR 2,25,00,000",
    status: "Published",
    featured: false,
    views: 1890,
    date: "May 20, 2024",
    image: "/images/interior-1.jpg",
  },
  {
    id: 3,
    title: "5 Marla House in DHA 9 Town",
    propertyId: "PROP-1246",
    type: "House",
    location: "DHA 9 Town, Lahore",
    price: "PKR 1,85,00,000",
    status: "Pending",
    featured: true,
    views: 1560,
    date: "May 19, 2024",
    image: "/images/property-1.jpg",
  },
  {
    id: 4,
    title: "Commercial Plaza in Gulberg",
    propertyId: "PROP-1245",
    type: "Commercial",
    location: "Gulberg III, Lahore",
    price: "PKR 12,50,00,000",
    status: "Published",
    featured: false,
    views: 1230,
    date: "May 19, 2024",
    image: "/images/city-1.jpg",
  },
  {
    id: 5,
    title: "10 Marla Plot in Park View City",
    propertyId: "PROP-1244",
    type: "Plot",
    location: "Park View City, Islamabad",
    price: "PKR 95,00,000",
    status: "Published",
    featured: true,
    views: 1120,
    date: "May 18, 2024",
    image: "/images/project-1.jpg",
  },
  {
    id: 6,
    title: "Luxury Apartment in Clifton",
    propertyId: "PROP-1243",
    type: "Apartment",
    location: "Clifton, Karachi",
    price: "PKR 3,75,00,000",
    status: "Draft",
    featured: false,
    views: 890,
    date: "May 18, 2024",
    image: "/images/interior-1.jpg",
  },
  {
    id: 7,
    title: "Farm House Land in Bedian Road",
    propertyId: "PROP-1242",
    type: "Plot",
    location: "Bedian Road, Lahore",
    price: "PKR 45,00,000",
    status: "Pending",
    featured: false,
    views: 650,
    date: "May 17, 2024",
    image: "/images/project-1.jpg",
  },
  {
    id: 8,
    title: "Office Space in Blue Area",
    propertyId: "PROP-1241",
    type: "Commercial",
    location: "Blue Area, Islamabad",
    price: "PKR 6,20,00,000",
    status: "Expired",
    featured: false,
    views: 430,
    date: "May 17, 2024",
    image: "/images/city-1.jpg",
  },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState(initialProperties);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const itemsPerPage = 8;

  const filteredProperties = useMemo(() => {
    const query = search.toLowerCase().trim();

    return properties.filter((property) => {
      const matchesSearch =
        !query ||
        property.title.toLowerCase().includes(query) ||
        property.propertyId.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query);

      const matchesStatus = !status || property.status === status;
      const matchesType = !type || property.type === type;

      const matchesCity =
        !city || property.location.toLowerCase().includes(city.toLowerCase());

      const matchesCategory =
        !category || property.type === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesCity &&
        matchesCategory
      );
    });
  }, [properties, search, status, type, city, category]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / itemsPerPage),
  );

  const paginatedProperties = filteredProperties.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setType("");
    setCity("");
    setCategory("");
    setPage(1);
  };

  const deleteProperty = (id: number) => {
    setProperties((current) =>
      current.filter((property) => property.id !== id),
    );
  };

  const toggleFeatured = (id: number) => {
    setProperties((current) =>
      current.map((property) =>
        property.id === id
          ? { ...property, featured: !property.featured }
          : property,
      ),
    );
  };

  const columns: AdminTableColumn<Property>[] = [
    {
      key: "title",
      label: "Property",
      width: "25%",
      render: (property) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={property.image}
              alt={property.title}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <Link
              href={`/admin/properties/${property.id}`}
              className="block truncate text-[11px] font-semibold text-gray-800 hover:text-primary"
              onClick={(event) => event.stopPropagation()}
            >
              {property.title}
            </Link>

            <p className="mt-1 text-[9px] text-gray-400">
              ID: {property.propertyId}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (property) => (
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <BuildingIcon />
          </span>
          <span className="text-[10px]">{property.type}</span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (property) => (
        <span className="max-w-[120px] leading-4 text-gray-600">
          {property.location}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (property) => (
        <span className="whitespace-nowrap font-medium text-gray-700">
          {property.price}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (property) => <StatusBadge status={property.status} />,
    },
    {
      key: "featured",
      label: "Featured",
      align: "center",
      render: (property) => (
        <button
          type="button"
          aria-label={
            property.featured
              ? "Remove from featured"
              : "Mark as featured"
          }
          onClick={(event) => {
            event.stopPropagation();
            toggleFeatured(property.id);
          }}
          className={[
            "transition-colors",
            property.featured
              ? "text-primary"
              : "text-gray-300 hover:text-primary",
          ].join(" ")}
        >
          <StarIcon filled={property.featured} />
        </button>
      ),
    },
    {
      key: "views",
      label: "Views",
      align: "right",
      render: (property) => (
        <span className="font-medium text-gray-600">
          {property.views.toLocaleString()}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (property) => (
        <div onClick={(event) => event.stopPropagation()}>
          <AdminActionMenu
            actions={[
              {
                label: "View Property",
                onClick: () => {},
                icon: <EyeIcon />,
              },
              {
                label: "Edit Property",
                onClick: () => {},
                icon: <EditIcon />,
              },
              {
                label: property.featured
                  ? "Remove Featured"
                  : "Make Featured",
                onClick: () => toggleFeatured(property.id),
                icon: <StarIcon />,
                dividerBefore: true,
              },
              {
                label: "Delete Property",
                onClick: () => deleteProperty(property.id),
                icon: <TrashIcon />,
                variant: "danger",
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Properties Management"
        description="Manage all property listings, statuses and featured properties."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Properties" },
          { label: "All Properties" },
        ]}
        action={
          <Link
            href="/admin/properties/new"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90"
          >
            <PlusIcon />
            Add New Property
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <SummaryCard
          label="Total Properties"
          value={properties.length}
          trend="+12.5%"
          icon={<BuildingIcon />}
        />
        <SummaryCard
          label="Published"
          value={properties.filter((p) => p.status === "Published").length}
          trend="+10.2%"
          icon={<CheckIcon />}
        />
        <SummaryCard
          label="Pending Review"
          value={properties.filter((p) => p.status === "Pending").length}
          trend="+15.3%"
          icon={<ClockIcon />}
        />
        <SummaryCard
          label="Draft"
          value={properties.filter((p) => p.status === "Draft").length}
          trend="-5.4%"
          negative
          icon={<DraftIcon />}
        />
        <SummaryCard
          label="Expired"
          value={properties.filter((p) => p.status === "Expired").length}
          trend="-8.7%"
          negative
          icon={<ExpiredIcon />}
        />
      </section>

      <AdminFilterBar
        searchPlaceholder="Search properties..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={[
          {
            label: "All Statuses",
            value: status,
            options: [
              { label: "Published", value: "Published" },
              { label: "Pending", value: "Pending" },
              { label: "Draft", value: "Draft" },
              { label: "Expired", value: "Expired" },
            ],
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
          },
          {
            label: "All Types",
            value: type,
            options: [
              { label: "House", value: "House" },
              { label: "Apartment", value: "Apartment" },
              { label: "Commercial", value: "Commercial" },
              { label: "Plot", value: "Plot" },
            ],
            onChange: (value) => {
              setType(value);
              setPage(1);
            },
          },
          {
            label: "All Cities",
            value: city,
            options: [
              { label: "Lahore", value: "Lahore" },
              { label: "Islamabad", value: "Islamabad" },
              { label: "Karachi", value: "Karachi" },
            ],
            onChange: (value) => {
              setCity(value);
              setPage(1);
            },
          },
          {
            label: "All Categories",
            value: category,
            options: [
              { label: "House", value: "House" },
              { label: "Apartment", value: "Apartment" },
              { label: "Commercial", value: "Commercial" },
              { label: "Plot", value: "Plot" },
            ],
            onChange: (value) => {
              setCategory(value);
              setPage(1);
            },
          },
        ]}
        onReset={resetFilters}
        onExport={() => exportProperties(filteredProperties)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <section>
        <AdminTable
          columns={columns}
          data={paginatedProperties}
          rowKey={(property) => property.id}
          emptyMessage="No properties found."
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredProperties.length}
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
}: {
  label: string;
  value: number;
  trend: string;
  negative?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>

      <p className="mt-2 text-[19px] font-semibold leading-none text-gray-800">
        {value.toLocaleString()}
      </p>

      <p
        className={[
          "mt-2 text-[9px] font-medium",
          negative ? "text-red-500" : "text-emerald-600",
        ].join(" ")}
      >
        {trend} <span className="ml-1 font-normal text-gray-400">from last month</span>
      </p>
    </div>
  );
}

function exportProperties(data: Property[]) {
  const headers = [
    "Property",
    "ID",
    "Type",
    "Location",
    "Price",
    "Status",
    "Featured",
    "Views",
    "Date",
  ];

  const rows = data.map((property) => [
    property.title,
    property.propertyId,
    property.type,
    property.location,
    property.price,
    property.status,
    property.featured ? "Yes" : "No",
    property.views,
    property.date,
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
  link.download = "properties.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function BuildingIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5l8-3 8 3v16" />
      <path d="M8 9h1M8 13h1M8 17h1M15 9h1M15 13h1M15 17h1M10 21v-4h4v4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
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

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function DraftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 4h14v16H5zM8 8h8M8 12h6M8 16h4" />
    </svg>
  );
}

function ExpiredIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5M12 16h.01" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" />
      <path d="m14.5 6.5 3 3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}