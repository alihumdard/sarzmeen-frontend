"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import DonutChart from "@/components/admin/DonutChart";
import AreaLineChart from "@/components/admin/AreaLineChart";
import OwnerDashboard from "@/components/admin/OwnerDashboard";
import { api } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";

type DashboardStats = {
  totalProperties: number;
  totalProjects: number;
  totalBlogs: number;
  totalInquiries: number;
  totalUsers: number;
  totalAgencies: number;
  totalAgents: number;
  pendingAccounts: number;
  approvedAccounts: number;
  rejectedAccounts: number;
};

type TopProperty = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  purpose: string;
  price: number;
  views: number;
};

type RecentInquiry = {
  id: string;
  name: string;
  email: string;
  property: string;
  propertyType: string;
  status: string;
  date: string;
};

type RecentBlog = {
  id: string;
  title: string;
  publishedAt: string;
  image: string;
  status: string;
};

type TrendPoint = { date: string; count: number };

type PropertiesByType = { type: string; count: number };

const CHART_COLORS = ["#1f7a4d", "#2563eb", "#9ca3af", "#f97316", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"];

const STATUS_COLORS: Record<string, string> = {
  published: "#1f7a4d",
  pending: "#2563eb",
  draft: "#8b5cf6",
  expired: "#f97316",
  rejected: "#ef4444",
};

const inquiryStatusVariant: Record<string, "info" | "neutral" | "warning" | "success"> = {
  new: "info",
  pending: "neutral",
  contacted: "warning",
  closed: "success",
};

function formatPKR(price: number): string {
  if (price >= 10_000_000) return `PKR ${(price / 10_000_000).toFixed(1)} Cr`;
  if (price >= 100_000) return `PKR ${(price / 100_000).toFixed(1)} Lac`;
  return `PKR ${price.toLocaleString()}`;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Every /admin/* endpoint is gated behind `role:admin`, so non-admins get a
  // dashboard built on the /my/* routes they can actually read.
  if (user && user.role !== "admin") {
    return <OwnerDashboard name={user.name} />;
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [period, setPeriod] = useState("30");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProperties, setTopProperties] = useState<TopProperty[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [viewsTrend, setViewsTrend] = useState<TrendPoint[]>([]);
  const [propertiesByType, setPropertiesByType] = useState<PropertiesByType[]>([]);
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const res = await api<{ data: DashboardStats }>("/admin/stats");
      setStats(res.data);
    } catch {
      // fallback
    }
  }, []);

  const loadTopProperties = useCallback(async () => {
    try {
      const res = await api<{ data: TopProperty[] }>("/admin/analytics/top-properties?limit=5");
      setTopProperties(res.data);
    } catch {
      // fallback
    }
  }, []);

  const loadRecentInquiries = useCallback(async () => {
    try {
      const res = await api<{ data: RecentInquiry[] }>("/admin/inquiries?per_page=5");
      setRecentInquiries(res.data);
    } catch {
      // fallback
    }
  }, []);

  const loadRecentBlogs = useCallback(async () => {
    try {
      const res = await api<{ data: RecentBlog[] }>("/admin/blogs?per_page=4");
      setRecentBlogs(res.data);
    } catch {
      // fallback
    }
  }, []);

  const loadViewsTrend = useCallback(async (days: string) => {
    try {
      const res = await api<{ data: TrendPoint[] }>(`/admin/analytics/views-trend?days=${days}`);
      setViewsTrend(res.data);
    } catch {
      // fallback
    }
  }, []);

  const loadPropertiesByType = useCallback(async () => {
    try {
      const res = await api<{ data: PropertiesByType[] }>("/admin/analytics/properties-by-type");
      setPropertiesByType(res.data);
    } catch {
      // fallback
    }
  }, []);

  const loadOverview = useCallback(async () => {
    try {
      const res = await api<{ data: Record<string, unknown> }>("/admin/analytics/overview");
      setOverview(res.data);
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadTopProperties();
    loadRecentInquiries();
    loadRecentBlogs();
    loadPropertiesByType();
    loadOverview();
  }, [loadStats, loadTopProperties, loadRecentInquiries, loadRecentBlogs, loadPropertiesByType, loadOverview]);

  useEffect(() => {
    loadViewsTrend(period);
  }, [period, loadViewsTrend]);

  const chart = useMemo(() => {
    if (viewsTrend.length === 0) {
      return { labels: [] as string[], values: [] as number[] };
    }
    return {
      labels: viewsTrend.map((p) => {
        const d = new Date(p.date);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }),
      values: viewsTrend.map((p) => Number(p.count)),
    };
  }, [viewsTrend]);

  const typeChartSegments = useMemo(() => {
    const total = propertiesByType.reduce((s, p) => s + p.count, 0) || 1;
    return propertiesByType.map((p, i) => ({
      label: p.type,
      value: Math.round((p.count / total) * 100),
      count: p.count,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [propertiesByType]);

  const statusChartSegments = useMemo(() => {
    if (!overview) return [];
    const byStatus = (overview.propertiesByStatus ?? {}) as Record<string, number>;
    const total = Object.values(byStatus).reduce((s, c) => s + c, 0) || 1;
    return Object.entries(byStatus).map(([status, count]) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: Math.round((count / total) * 100),
      count,
      color: STATUS_COLORS[status] ?? "#9ca3af",
    }));
  }, [overview]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Dashboard" }]}
        action={
          <Link
            href="/admin/properties/add"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <PlusIcon />
            Add Property
          </Link>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Properties"
          value={stats?.totalProperties.toLocaleString() ?? "—"}
          icon={<PropertyIcon />}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects.toLocaleString() ?? "—"}
          icon={<ProjectIcon />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Total Agencies"
          value={stats?.totalAgencies.toLocaleString() ?? "—"}
          icon={<BlogIcon />}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Total Agents"
          value={stats?.totalAgents.toLocaleString() ?? "—"}
          icon={<InquiryIcon />}
          iconClassName="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers.toLocaleString() ?? "—"}
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
                Property Views
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

          {overview && (
            <div className="flex flex-wrap items-center gap-8 px-5 pt-5">
              <div>
                <p className="text-[11px] text-gray-400">Total Views</p>
                <p className="mt-1 text-[20px] font-bold text-gray-900">
                  {Number(overview.totalViews ?? 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Last 30 Days</p>
                <p className="mt-1 text-[20px] font-bold text-gray-900">
                  {Number(overview.totalViewsLast30Days ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="px-5 pb-3 pt-4">
            {chart.labels.length > 0 ? (
              <AreaLineChart data={chart.values} labels={chart.labels} />
            ) : (
              <p className="py-12 text-center text-[12px] text-gray-400">No view data yet</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-[13px] font-semibold text-gray-800">Top Properties</h2>
            <Link href="/admin/properties" className="text-[11px] font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {topProperties.length === 0 && (
              <li className="px-5 py-8 text-center text-[12px] text-gray-400">No properties yet</li>
            )}
            {topProperties.map((property, index) => (
              <li key={property.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-gray-800">{property.title}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">{formatPKR(property.price)}</p>
                </div>
                <div className="shrink-0 text-right text-[10px] text-gray-400">
                  Views: {property.views.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Distribution Charts */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <h2 className="mb-5 text-[13px] font-semibold text-gray-800">Properties by Type</h2>
          {typeChartSegments.length > 0 ? (
            <DonutChart segments={typeChartSegments} />
          ) : (
            <p className="py-12 text-center text-[12px] text-gray-400">No data yet</p>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <h2 className="mb-5 text-[13px] font-semibold text-gray-800">Properties by Status</h2>
          {statusChartSegments.length > 0 ? (
            <DonutChart segments={statusChartSegments} />
          ) : (
            <p className="py-12 text-center text-[12px] text-gray-400">No data yet</p>
          )}
        </div>
      </section>

      {/* Recent Inquiries */}
      <section className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-[13px] font-semibold text-gray-800">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-[11px] font-semibold text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">Name</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">Email</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">Property / Project</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentInquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[12px] text-gray-400">No inquiries yet</td>
                </tr>
              )}
              {recentInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-5 py-3.5 text-[12px] font-semibold text-gray-800">{inquiry.name}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">{inquiry.email}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-600">{inquiry.property || inquiry.propertyType || "—"}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      status={inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      variant={inquiryStatusVariant[inquiry.status] ?? "neutral"}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-gray-400">{inquiry.date}</td>
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
            <h2 className="text-[13px] font-semibold text-gray-800">Recent Blogs</h2>
            <Link href="/admin/blogs" className="text-[11px] font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentBlogs.length === 0 && (
              <li className="px-5 py-8 text-center text-[12px] text-gray-400">No blogs yet</li>
            )}
            {recentBlogs.map((blog) => (
              <li key={blog.id} className="flex items-center gap-3 px-5 py-3">
                <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {blog.image && (
                    <Image src={blog.image} alt={blog.title} fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-gray-800">{blog.title}</p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{blog.publishedAt ?? "Draft"}</p>
                </div>
                <StatusBadge
                  status={blog.status === "published" ? "Published" : blog.status === "draft" ? "Draft" : blog.status}
                  variant={blog.status === "published" ? "success" : "neutral"}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-[13px] font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            <QuickAction href="/admin/properties/add" icon={<PropertyIcon />} title="Add New Property" />
            <QuickAction href="/admin/projects/add" icon={<ProjectIcon />} title="Add New Project" />
            <QuickAction href="/admin/blogs" icon={<BlogIcon />} title="Create Blog Post" />
            <QuickAction href="/admin/users/agents" icon={<UsersIcon />} title="Manage Agents" />
            <QuickAction href="/admin/inquiries" icon={<InquiryIcon />} title="Manage Inquiries" />
            <QuickAction href="/admin/properties" icon={<BookingIcon />} title="View All Properties" />
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-[13px] font-semibold text-gray-800">Overview</h2>
          </div>
          <div className="flex-1 space-y-3.5 px-5 py-4">
            <OverviewRow label="Total Inquiries" value={stats?.totalInquiries.toLocaleString() ?? "—"} />
            <OverviewRow label="Total Blogs" value={stats?.totalBlogs.toLocaleString() ?? "—"} />
            <OverviewRow label="Pending Accounts" value={stats?.pendingAccounts.toLocaleString() ?? "—"} />
            <OverviewRow label="Approved Accounts" value={stats?.approvedAccounts.toLocaleString() ?? "—"} />
            <OverviewRow label="Total Properties" value={stats?.totalProperties.toLocaleString() ?? "—"} />
            <OverviewRow label="Total Projects" value={stats?.totalProjects.toLocaleString() ?? "—"} />
          </div>
          <div className="px-5 pb-5">
            <Link
              href="/admin/settings"
              className="flex w-full items-center justify-center rounded-lg border border-gray-200 py-2.5 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary/40 hover:text-primary"
            >
              System Settings
            </Link>
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

function QuickAction({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 px-3 py-4 text-center transition-all hover:border-primary/30 hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        {icon}
      </span>
      <span className="text-[10.5px] font-semibold leading-tight text-gray-700">{title}</span>
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
