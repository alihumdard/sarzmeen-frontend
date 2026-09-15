"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import AdminActionMenu from "@/components/admin/AdminActionMenu";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";

type RecentProperty = {
  id: number;
  title: string;
  location: string;
  type: string;
  price: string;
  status: "Active" | "Pending" | "Inactive";
  date: string;
};

type RecentInquiry = {
  id: number;
  name: string;
  property: string;
  phone: string;
  status: "New" | "Contacted" | "Pending";
  date: string;
};

const recentProperties: RecentProperty[] = [
  {
    id: 1,
    title: "Modern Family House",
    location: "DHA Phase 6, Lahore",
    type: "House",
    price: "PKR 4.85 Cr",
    status: "Active",
    date: "Sep 15, 2026",
  },
  {
    id: 2,
    title: "Luxury Apartment",
    location: "Bahria Town, Islamabad",
    type: "Apartment",
    price: "PKR 2.15 Cr",
    status: "Active",
    date: "Sep 14, 2026",
  },
  {
    id: 3,
    title: "Commercial Plaza",
    location: "Gulberg III, Lahore",
    type: "Commercial",
    price: "PKR 8.50 Cr",
    status: "Pending",
    date: "Sep 13, 2026",
  },
  {
    id: 4,
    title: "5 Marla Residential Plot",
    location: "Wapda Town, Lahore",
    type: "Plot",
    price: "PKR 1.25 Cr",
    status: "Active",
    date: "Sep 12, 2026",
  },
  {
    id: 5,
    title: "Executive Villa",
    location: "DHA Phase 5, Karachi",
    type: "Villa",
    price: "PKR 6.75 Cr",
    status: "Inactive",
    date: "Sep 11, 2026",
  },
];

const recentInquiries: RecentInquiry[] = [
  {
    id: 1,
    name: "Ahmed Khan",
    property: "Modern Family House",
    phone: "+92 300 1234567",
    status: "New",
    date: "Today, 10:42 AM",
  },
  {
    id: 2,
    name: "Sara Malik",
    property: "Luxury Apartment",
    phone: "+92 321 7654321",
    status: "Contacted",
    date: "Today, 09:18 AM",
  },
  {
    id: 3,
    name: "Usman Ali",
    property: "Commercial Plaza",
    phone: "+92 333 4567890",
    status: "Pending",
    date: "Yesterday",
  },
  {
    id: 4,
    name: "Hina Shah",
    property: "Executive Villa",
    phone: "+92 301 9876543",
    status: "New",
    date: "Yesterday",
  },
];

const propertyColumns: AdminTableColumn<RecentProperty>[] = [
  {
    key: "title",
    label: "Property",
    width: "28%",
    render: (property) => (
      <div>
        <p className="font-semibold text-gray-800">{property.title}</p>
        <p className="mt-0.5 text-[10px] text-gray-400">
          {property.location}
        </p>
      </div>
    ),
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "price",
    label: "Price",
    render: (property) => (
      <span className="font-medium text-gray-700">{property.price}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (property) => <StatusBadge status={property.status} />,
  },
  {
    key: "date",
    label: "Added",
  },
  {
    key: "actions",
    label: "",
    align: "right",
    render: () => (
      <AdminActionMenu
        actions={[
          {
            label: "View Property",
            onClick: () => {},
          },
          {
            label: "Edit Property",
            onClick: () => {},
          },
          {
            label: "Delete Property",
            onClick: () => {},
            variant: "danger",
            dividerBefore: true,
          },
        ]}
      />
    ),
  },
];

const inquiryColumns: AdminTableColumn<RecentInquiry>[] = [
  {
    key: "name",
    label: "Contact",
    width: "24%",
    render: (inquiry) => (
      <div>
        <p className="font-semibold text-gray-800">{inquiry.name}</p>
        <p className="mt-0.5 text-[10px] text-gray-400">{inquiry.phone}</p>
      </div>
    ),
  },
  {
    key: "property",
    label: "Property",
  },
  {
    key: "status",
    label: "Status",
    render: (inquiry) => <StatusBadge status={inquiry.status} />,
  },
  {
    key: "date",
    label: "Received",
  },
  {
    key: "actions",
    label: "",
    align: "right",
    render: () => (
      <AdminActionMenu
        actions={[
          {
            label: "View Inquiry",
            onClick: () => {},
          },
          {
            label: "Mark Contacted",
            onClick: () => {},
          },
          {
            label: "Delete Inquiry",
            onClick: () => {},
            variant: "danger",
            dividerBefore: true,
          },
        ]}
      />
    ),
  },
];

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("7");

  const chartData = useMemo(() => {
    if (period === "30") {
      return [
        { label: "W1", value: 42 },
        { label: "W2", value: 58 },
        { label: "W3", value: 51 },
        { label: "W4", value: 76 },
      ];
    }

    if (period === "90") {
      return [
        { label: "Jun", value: 48 },
        { label: "Jul", value: 61 },
        { label: "Aug", value: 74 },
        { label: "Sep", value: 86 },
      ];
    }

    return [
      { label: "Mon", value: 32 },
      { label: "Tue", value: 45 },
      { label: "Wed", value: 38 },
      { label: "Thu", value: 61 },
      { label: "Fri", value: 52 },
      { label: "Sat", value: 72 },
      { label: "Sun", value: 65 },
    ];
  }, [period]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your real estate platform."
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Properties"
          value="1,284"
          trend="+12.5%"
          trendDirection="up"
          trendText="vs last month"
          icon={<PropertyIcon />}
          iconClassName="bg-primary/10 text-primary"
        />

        <StatCard
          title="Active Listings"
          value="936"
          trend="+8.2%"
          trendDirection="up"
          trendText="vs last month"
          icon={<HomeIcon />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Total Inquiries"
          value="3,642"
          trend="+18.7%"
          trendDirection="up"
          trendText="vs last month"
          icon={<InquiryIcon />}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Total Agents"
          value="86"
          trend="+4.3%"
          trendDirection="up"
          trendText="vs last month"
          icon={<UsersIcon />}
          iconClassName="bg-violet-50 text-violet-600"
        />
      </section>

      {/* Analytics */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-gray-800">
                Inquiries Overview
              </h2>
              <p className="mt-0.5 text-[10px] text-gray-400">
                Inquiry activity across the platform
              </p>
            </div>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-8 rounded-md border border-gray-200 bg-white px-2.5 text-[10px] text-gray-600 outline-none focus:border-primary"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>

          <div className="px-5 pb-5 pt-6">
            <div className="flex h-[220px] items-end gap-2 sm:gap-4">
              {chartData.map((item) => (
                <div
                  key={item.label}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="mb-2 text-center text-[9px] font-medium text-gray-400">
                    {item.value}
                  </div>

                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                    style={{ height: `${item.value * 2.25}px` }}
                  />

                  <div className="mt-2 text-center text-[9px] text-gray-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-[13px] font-semibold text-gray-800">
                Property Distribution
              </h2>
              <p className="mt-0.5 text-[10px] text-gray-400">
                Listings by property type
              </p>
            </div>
          </div>

          <div className="space-y-5 px-5 py-5">
            <DistributionItem
              label="Houses"
              value="42%"
              percentage={42}
              count="539"
            />
            <DistributionItem
              label="Apartments"
              value="27%"
              percentage={27}
              count="347"
            />
            <DistributionItem
              label="Plots"
              value="18%"
              percentage={18}
              count="231"
            />
            <DistributionItem
              label="Commercial"
              value="13%"
              percentage={13}
              count="167"
            />
          </div>
        </div>
      </section>

      {/* Recent Properties */}
      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-gray-800">
              Recent Properties
            </h2>
            <p className="mt-0.5 text-[10px] text-gray-400">
              Recently added property listings
            </p>
          </div>

          <Link
            href="/admin/properties"
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            View All Properties
          </Link>
        </div>

        <AdminTable
          columns={propertyColumns}
          data={recentProperties}
          rowKey={(item) => item.id}
        />
      </section>

      {/* Recent Inquiries */}
      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-gray-800">
              Recent Inquiries
            </h2>
            <p className="mt-0.5 text-[10px] text-gray-400">
              Latest customer inquiries
            </p>
          </div>

          <Link
            href="/admin/inquiries"
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            View All Inquiries
          </Link>
        </div>

        <AdminTable
          columns={inquiryColumns}
          data={recentInquiries}
          rowKey={(item) => item.id}
        />
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-3">
          <h2 className="text-[14px] font-semibold text-gray-800">
            Quick Actions
          </h2>
          <p className="mt-0.5 text-[10px] text-gray-400">
            Frequently used admin actions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/admin/properties/new"
            icon={<PlusIcon />}
            title="Add Property"
            description="Create a new property listing"
          />

          <QuickAction
            href="/admin/projects/new"
            icon={<ProjectIcon />}
            title="Add Project"
            description="Create a real estate project"
          />

          <QuickAction
            href="/admin/blogs/new"
            icon={<BlogIcon />}
            title="Write Blog"
            description="Publish a new blog article"
          />

          <QuickAction
            href="/admin/inquiries"
            icon={<InboxIcon />}
            title="View Inquiries"
            description="Review customer inquiries"
          />
        </div>
      </section>
    </div>
  );
}

function DistributionItem({
  label,
  value,
  percentage,
  count,
}: {
  label: string;
  value: string;
  percentage: number;
  count: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-700">{label}</span>
          <span className="text-[9px] text-gray-400">({count})</span>
        </div>

        <span className="text-[10px] font-semibold text-gray-600">{value}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary/30 hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-[11px] font-semibold text-gray-800">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-[9px] text-gray-400">
          {description}
        </span>
      </span>
    </Link>
  );
}

function PropertyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5M9 21v-6h6v6" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9M9 20v-6h6v6" />
    </svg>
  );
}

function InquiryIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 5h16v12H8l-4 4V5Z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c.5-3.5 2.3-5 5.5-5s5 1.5 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17 15c2.2.4 3.5 2 3.8 5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V7l9-4 9 4v14" />
      <path d="M7 21v-7h10v7M8 10h2M14 10h2" />
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14v18H5z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v14H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}