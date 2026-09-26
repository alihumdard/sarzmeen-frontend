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
import { listAccounts, setAccountStatus } from "@/lib/api/accountUsers";
import type {
  AccountRole,
  AccountStatus,
  AccountUser,
} from "@/types/accountUser";

const PER_PAGE = 8;

type AccountManagerProps = {
  role: AccountRole;
  title: string;
  description: string;
  /** Second breadcrumb entry, after "Users". */
  breadcrumbLabel: string;
  /** Column header over the name — "Agency" reads better than "Name" there. */
  nameLabel: string;
  searchPlaceholder: string;
};

/**
 * Shared screen behind Website Users, Agents and Agencies.
 *
 * All three manage the same record shape and the same approval flow, so
 * they differ only in which role they list and a few labels. The extra
 * column (agency for agents, owner and team size for agencies) is chosen
 * from `role` rather than passed in.
 */
export default function AccountManager({
  role,
  title,
  description,
  breadcrumbLabel,
  nameLabel,
  searchPlaceholder,
}: AccountManagerProps) {
  const [accounts, setAccounts] = useState<AccountUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [page, setPage] = useState(1);

  /** The record awaiting an approve/reject confirmation, and which way. */
  const [confirming, setConfirming] = useState<{
    account: AccountUser;
    next: Extract<AccountStatus, "approved" | "rejected">;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  // Initial load. `loading` already starts true, so this only sets state
  // once the request resolves rather than synchronously on mount.
  useEffect(() => {
    let active = true;

    listAccounts(role)
      .then((data) => {
        if (active) setAccounts(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [role]);

  const cities = useMemo(
    () => [...new Set(accounts.map((account) => account.city))].sort(),
    [accounts],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return accounts.filter((account) => {
      if (statusFilter && account.status !== statusFilter) return false;
      if (cityFilter && account.city !== cityFilter) return false;

      if (!term) return true;
      return [
        account.name,
        account.email,
        account.phone,
        account.agency ?? "",
        account.owner ?? "",
      ].some((field) => field.toLowerCase().includes(term));
    });
  }, [accounts, search, statusFilter, cityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const stats = useMemo(
    () => ({
      total: accounts.length,
      pending: accounts.filter((a) => a.status === "pending").length,
      approved: accounts.filter((a) => a.status === "approved").length,
      rejected: accounts.filter((a) => a.status === "rejected").length,
    }),
    [accounts],
  );

  async function handleConfirm() {
    if (!confirming) return;

    setBusy(true);
    try {
      const updated = await setAccountStatus(
        confirming.account.id,
        confirming.next,
      );
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === updated.id ? updated : account,
        ),
      );
      setConfirming(null);
    } finally {
      setBusy(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("");
    setCityFilter("");
    setPage(1);
  }

  const columns: AdminTableColumn<AccountUser>[] = [
    {
      key: "name",
      label: nameLabel,
      render: (account) => (
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src={account.avatar}
              alt=""
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-gray-900">
              {account.name}
            </p>
            <p className="truncate text-[11px] text-gray-400">
              {account.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Phone",
      render: (account) => (
        <span className="whitespace-nowrap text-[11px] text-gray-500">
          {account.phone}
        </span>
      ),
    },
    // Agents belong to an agency; agencies have an owner and a team size.
    ...(role === "agent"
      ? [
          {
            key: "agency",
            label: "Agency",
            render: (account: AccountUser) => (
              <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                {account.agency ?? "—"}
              </span>
            ),
          },
        ]
      : []),
    ...(role === "agency"
      ? [
          {
            key: "owner",
            label: "Owner",
            render: (account: AccountUser) => (
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-gray-700">
                  {account.owner ?? "—"}
                </p>
                <p className="text-[10.5px] text-gray-400">
                  {account.totalAgents ?? 0} agents
                </p>
              </div>
            ),
          },
        ]
      : []),
    {
      key: "city",
      label: "City",
      render: (account) => (
        <span className="text-[11px] text-gray-500">{account.city}</span>
      ),
    },
    {
      key: "listings",
      label: "Listings",
      align: "right",
      render: (account) => (
        <span className="text-[12px] font-semibold text-gray-700">
          {account.listings.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (account) => <AccountStatusBadge status={account.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (account) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* Approve is offered unless already approved; reject unless
              already rejected — so a decision can always be reversed. */}
          {account.status !== "approved" && (
            <button
              type="button"
              aria-label={`Approve ${account.name}`}
              onClick={() => setConfirming({ account, next: "approved" })}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <CheckIcon />
              Approve
            </button>
          )}

          {account.status !== "rejected" && (
            <button
              type="button"
              aria-label={`Reject ${account.name}`}
              onClick={() => setConfirming({ account, next: "rejected" })}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-100 bg-red-50 px-2.5 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              <CrossIcon />
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  const isApproving = confirming?.next === "approved";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumbs={[{ label: "Users" }, { label: breadcrumbLabel }]}
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard label="Total" value={stats.total} />
        <SummaryCard label="Pending Approval" value={stats.pending} />
        <SummaryCard label="Approved" value={stats.approved} />
        <SummaryCard label="Rejected" value={stats.rejected} />
      </section>

      <AdminFilterBar
        searchPlaceholder={searchPlaceholder}
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
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ],
            onChange: (value) => {
              setStatusFilter(value);
              setPage(1);
            },
          },
          {
            label: "All Cities",
            value: cityFilter,
            options: cities.map((city) => ({ label: city, value: city })),
            onChange: (value) => {
              setCityFilter(value);
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
        rowKey={(account) => account.id}
        emptyMessage="No accounts match these filters."
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

      <AdminModal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title={isApproving ? "Approve Account" : "Reject Account"}
        description={
          isApproving
            ? `"${confirming?.account.name}" will go live on the public site.`
            : `"${confirming?.account.name}" will be hidden from the public site.`
        }
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirming(null)}
              className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={busy}
              className={[
                "inline-flex h-10 items-center rounded-md px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60",
                isApproving ? "bg-primary" : "bg-red-600",
              ].join(" ")}
            >
              {busy
                ? "Saving…"
                : isApproving
                  ? "Approve"
                  : "Reject"}
            </button>
          </div>
        }
      >
        <p className="text-[12px] leading-relaxed text-gray-600">
          {isApproving
            ? "Their listings and profile become visible to buyers straight away."
            : "You can approve them later — rejecting does not delete the account."}
        </p>
      </AdminModal>
    </div>
  );
}

function AccountStatusBadge({ status }: { status: AccountStatus }) {
  if (status === "approved") {
    return <StatusBadge status="Approved" variant="success" size="sm" dot />;
  }
  if (status === "pending") {
    return <StatusBadge status="Pending" variant="warning" size="sm" dot />;
  }
  return <StatusBadge status="Rejected" variant="danger" size="sm" dot />;
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

function CheckIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
