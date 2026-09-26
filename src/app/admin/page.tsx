"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import DonutChart from "@/components/admin/DonutChart";
import AreaLineChart from "@/components/admin/AreaLineChart";

type TopProperty = {
  id: number;
  title: string;
  price: string;
  views: string;
  image: string;
};

type RecentInquiry = {
  id: number;
  name: string;
  email: string;
  property: string;
  type: string;
  status: "New" | "Contacted" | "In Progress" | "Closed";
  date: string;
};

type RecentBlog = {
  id: number;
  title: string;
  date: string;
  image: string;
};

const topProperties: TopProperty[] = [
  {
    id: 1,
    title: "Luxury Villa in DHA Lahore",
    price: "PKR 8,50,00,000",
    views: "2,450",
    image: "/images/property-1.jpg",
  },
  {
    id: 2,
    title: "Modern Apartment in Bahria Town",
    price: "PKR 2,25,00,000",
    views: "1,890",
    image: "/images/interior-1.jpg",
  },
  {
    id: 3,
    title: "5 Marla House in DHA 9 Town",
    price: "PKR 1,85,00,000",
    views: "1,560",
    image: "/images/property-1.jpg",
  },
  {
    id: 4,
    title: "Commercial Plaza in Gulberg",
    price: "PKR 12,50,00,000",
    views: "1,230",
    image: "/images/city-1.jpg",
  },
  {
    id: 5,
    title: "10 Marla Plot in Park View City",
    price: "PKR 95,00,000",
    views: "1,120",
    image: "/images/project-1.jpg",
  },
];

const recentInquiries: RecentInquiry[] = [
  {
    id: 1,
    name: "Ahmad Raza",
    email: "ahmad.raza@example.com",
    property: "Luxury Villa in DHA Lahore",
    type: "Buy",
    status: "New",
    date: "Sep 20, 2026 10:30 AM",
  },
  {
    id: 2,
    name: "Fatima Noor",
    email: "fatima.noor@example.com",
    property: "Bahria Town Apartment",
    type: "Rent",
    status: "Contacted",
    date: "Sep 20, 2026 09:15 AM",
  },
  {
    id: 3,
    name: "Usman Tariq",
    email: "usman.tariq@example.com",
    property: "Commercial Plaza Gulberg",
    type: "Buy",
    status: "In Progress",
    date: "Sep 19, 2026 05:40 PM",
  },
  {
    id: 4,
    name: "Zain Ali",
    email: "zain.ali@example.com",
    property: "5 Marla House DHA 9 Town",
    type: "Buy",
    status: "New",
    date: "Sep 19, 2026 02:20 PM",
  },
  {
    id: 5,
    name: "Sana Khan",
    email: "sana.khan@example.com",
    property: "10 Marla Plot Park View City",
    type: "Buy",
    status: "Closed",
    date: "Sep 18, 2026 11:10 AM",
  },
];

const recentBlogs: RecentBlog[] = [
  {
    id: 1,
    title: "Real Estate Market Trends in Pakistan 2026",
    date: "Sep 18, 2026",
    image: "/images/blog-1.jpg",
  },
  {
    id: 2,
    title: "Top 10 Investment Areas in Lahore",
    date: "Sep 16, 2026",
    image: "/images/city-1.jpg",
  },
  {
    id: 3,
    title: "How to Buy Property in Pakistan (Complete Guide)",
    date: "Sep 14, 2026",
    image: "/images/property-1.jpg",
  },
  {
    id: 4,
    title: "Commercial vs Residential Property Investment",
    date: "Sep 12, 2026",
    image: "/images/interior-1.jpg",
  },
];

const inquiryStatusVariant: Record<
  RecentInquiry["status"],
  "info" | "neutral" | "warning" | "success"
> = {
  New: "info",
  Contacted: "neutral",
  "In Progress": "warning",
  Closed: "success",
};

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("30");

  const chart = useMemo(() => {
    if (period === "7") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [32, 45, 38, 61, 52, 72, 65],
      };
    }

    if (period === "90") {
      return {
        labels: ["Jul", "Aug", "Sep"],
        values: [48, 74, 86],
      };
    }

    return {
      labels: ["Apr 20", "Apr 25", "Apr 30", "May 5", "May 10", "May 15", "May 20"],
      values: [4200, 5600, 3800, 7100, 5200, 7600, 6300],
    };
  }, [period]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Dashboard" }]}
        action={
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <PlusIcon />
            Add New
          </button>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Properties"
          value="1,248"
          trend="12.5%"
          trendDirection="up"
          trendText="from last month"
          icon={<PropertyIcon />}
          iconClassName="bg-primary/10 text-primary"
        />

        <StatCard
          title="Total Projects"
          value="96"
          trend="8.4%"
          trendDirection="up"
          trendText="from last month"
          icon={<ProjectIcon />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Total Blogs"
          value="184"
          trend="15.3%"
          trendDirection="up"
          trendText="from last month"
          icon={<BlogIcon />}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Total Inquiries"
          value="2,543"
          trend="18.7%"
          trendDirection="up"
          trendText="from last month"
          icon={<InquiryIcon />}
          iconClassName="bg-orange-50 text-orange-600"
        />

        <StatCard
          title="Total Users"
          value="8,652"
          trend="10.2%"
          trendDirection="up"
          trendText="from last month"
          icon={<UsersIcon />}
          iconClassName="bg-violet-50 text-violet-600"
        />
      </section>

      {/* Analytics + Top Properties */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-gray-800">
                Website Analytics
              </h2>
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

          <div className="flex flex-wrap items-center gap-8 px-5 pt-5">
            <div>
              <p className="text-[11px] text-gray-400">Visitors</p>
              <p className="mt-1 flex items-center gap-2 text-[20px] font-bold text-gray-900">
                32,689
                <span className="text-[10px] font-semibold text-green-600">
                  ↑ 14.2%
                </span>
              </p>
            </div>

            <div>
              <p className="text-[11px] text-gray-400">Page Views</p>
              <p className="mt-1 flex items-center gap-2 text-[20px] font-bold text-gray-900">
                78,354
                <span className="text-[10px] font-semibold text-green-600">
                  ↑ 18.6%
                </span>
              </p>
            </div>
          </div>

          <div className="px-5 pb-3 pt-4">
            <AreaLineChart data={chart.values} labels={chart.labels} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-[13px] font-semibold text-gray-800">
              Top Properties
            </h2>

            <Link
              href="/admin/properties"
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <ul className="divide-y divide-gray-100">
            {topProperties.map((property, index) => (
              <li key={property.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {index + 1}
                </span>

                <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-gray-800">
                    {property.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {property.price}
                  </p>
                </div>

                <div className="shrink-0 text-right text-[10px] text-gray-400">
                  Views: {property.views}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Distribution Charts */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <h2 className="mb-5 text-[13px] font-semibold text-gray-800">
            Properties by Type
          </h2>

          <DonutChart
            segments={[
              { label: "House", value: 35, count: 437, color: "#1f7a4d" },
              { label: "Plot", value: 25, count: 312, color: "#2563eb" },
              { label: "Apartment", value: 20, count: 249, color: "#9ca3af" },
              { label: "Commercial", value: 12, count: 150, color: "#f97316" },
              { label: "Other", value: 8, count: 100, color: "#8b5cf6" },
            ]}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <h2 className="mb-5 text-[13px] font-semibold text-gray-800">
            Properties by Status
          </h2>

          <DonutChart
            segments={[
              { label: "Published", value: 62, count: 774, color: "#1f7a4d" },
              { label: "Pending", value: 20, count: 249, color: "#2563eb" },
              { label: "Draft", value: 10, count: 125, color: "#8b5cf6" },
              { label: "Expired", value: 8, count: 100, color: "#f97316" },
            ]}
          />
        </div>
      </section>

      {/* Recent Inquiries */}
      <section className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-[13px] font-semibold text-gray-800">
            Recent Inquiries
          </h2>

          <Link
            href="/admin/inquiries"
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                  Property / Project
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-5 py-3.5 text-[12px] font-semibold text-gray-800">
                    {inquiry.name}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">
                    {inquiry.email}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-600">
                    {inquiry.property}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-600">
                    {inquiry.type}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      status={inquiry.status}
                      variant={inquiryStatusVariant[inquiry.status]}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-gray-400">
                    {inquiry.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Blogs + Quick Actions + System Overview */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1fr_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-[13px] font-semibold text-gray-800">
              Recent Blogs
            </h2>

            <Link
              href="/admin/blogs"
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <ul className="divide-y divide-gray-100">
            {recentBlogs.map((blog) => (
              <li key={blog.id} className="flex items-center gap-3 px-5 py-3">
                <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-gray-800">
                    {blog.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{blog.date}</p>
                </div>

                <StatusBadge status="Published" variant="success" />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-[13px] font-semibold text-gray-800">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4">
            <QuickAction
              href="/admin/properties/add"
              icon={<PropertyIcon />}
              title="Add New Property"
            />
            <QuickAction
              href="/admin/projects/add"
              icon={<ProjectIcon />}
              title="Add New Project"
            />
            <QuickAction
              href="/admin/blogs/new"
              icon={<BlogIcon />}
              title="Create Blog Post"
            />
            <QuickAction
              href="/admin/agents"
              icon={<UsersIcon />}
              title="Add New Agent"
            />
            <QuickAction
              href="/admin/inquiries"
              icon={<InquiryIcon />}
              title="Manage Inquiries"
            />
            <QuickAction
              href="/admin/properties"
              icon={<BookingIcon />}
              title="View All Bookings"
            />
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-[13px] font-semibold text-gray-800">
              System Overview
            </h2>
          </div>

          <div className="flex-1 space-y-3.5 px-5 py-4">
            <OverviewRow label="PHP Version" value="8.2.12" />
            <OverviewRow label="Laravel Version" value="11.8" />
            <OverviewRow label="Server Time" value="Sep 20, 2026 04:30 PM" />

            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Storage Used</span>
                <span className="font-medium text-gray-700">
                  45.6 GB / 200 GB
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[22.8%] rounded-full bg-primary" />
              </div>
            </div>

            <OverviewRow label="Database Size" value="1.32 GB" />
            <OverviewRow label="Total Backups" value="28" />
          </div>

          <div className="px-5 pb-5">
            <button
              type="button"
              className="w-full rounded-lg border border-gray-200 py-2.5 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary/40 hover:text-primary"
            >
              System Status
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-700">{value}</span>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 px-3 py-4 text-center transition-all hover:border-primary/30 hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        {icon}
      </span>

      <span className="text-[10.5px] font-semibold leading-tight text-gray-700">
        {title}
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

function ProjectIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V7l9-4 9 4v14" />
      <path d="M7 21v-7h10v7M8 10h2M14 10h2" />
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14v18H5z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
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

function BookingIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" />
      <path d="m8.5 14 2 2 4-4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
