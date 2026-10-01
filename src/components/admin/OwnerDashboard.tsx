"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import { api } from "@/lib/api/client";

type OwnerStats = {
  totalProperties: number;
  publishedProperties: number;
  totalInquiries: number;
  totalViews: number;
  propertiesForSale: number;
  propertiesForRent: number;
  viewsLast30Days: number;
};

export default function OwnerDashboard({ name }: { name: string }) {
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await api<{ data: OwnerStats }>("/my/stats");
      setStats(res.data);
    } catch {
      // leave stats null; cards render zeroes
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-7 w-7 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Welcome back, ${name}`}
        description="An overview of your listings and enquiries."
        breadcrumbs={[{ label: "Dashboard" }]}
        action={
          <Link
            href="/admin/properties/add"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Add New Property
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="My Properties"
          value={stats?.totalProperties ?? 0}
          icon={<HomeIcon />}
        />
        <StatCard
          title="Published"
          value={stats?.publishedProperties ?? 0}
          icon={<CheckIcon />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Inquiries"
          value={stats?.totalInquiries ?? 0}
          icon={<MailIcon />}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Total Views"
          value={stats?.totalViews ?? 0}
          icon={<EyeIcon />}
          iconClassName="bg-violet-50 text-violet-600"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Tile label="For Sale" value={stats?.propertiesForSale ?? 0} />
        <Tile label="For Rent" value={stats?.propertiesForRent ?? 0} />
        <Tile label="Views (30 days)" value={stats?.viewsLast30Days ?? 0} />
      </section>

      {stats?.totalProperties === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-[13px] font-semibold text-gray-700">
            You have not listed a property yet
          </p>
          <p className="mt-1 text-[12px] text-gray-500">
            Add your first listing to start receiving enquiries.
          </p>
          <Link
            href="/admin/properties/add"
            className="mt-4 inline-flex h-9 items-center rounded-md bg-primary px-4 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Add New Property
          </Link>
        </div>
      )}
    </div>
  );
}

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="mt-1 text-[19px] font-bold leading-none text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
