"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { api } from "@/lib/api/client";
import { listAccounts, setAccountStatus } from "@/lib/api/accountUsers";
import { formatPKR } from "@/lib/paymentPlan";
import type { AccountUser } from "@/types/accountUser";
/* Mirrors the admin properties list, which returns its own shape. */
type PendingListing = {
  id: string;
  title: string;
  price: number;
  reference?: string | null;
  agent?: { name: string; title: string } | null;
  agency?: { name: string } | null;
};

type Tab = "listings" | "accounts";

/**
 * One place to clear everything waiting on an admin.
 *
 * Pending listings sat in the properties table among every other status,
 * and pending agents and agencies sat on two further screens, so nothing
 * said what was actually waiting — or who had sent it.
 */
export default function ApprovalsPage() {
  const [tab, setTab] = useState<Tab>("listings");

  const [listings, setListings] = useState<PendingListing[]>([]);
  const [accounts, setAccounts] = useState<AccountUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [props, agents, agencies] = await Promise.all([
        api<{ data: PendingListing[] }>("/admin/properties?status=pending&per_page=100"),
        listAccounts("agent"),
        listAccounts("agency"),
      ]);

      setListings(props.data);
      setAccounts(
        [...agents, ...agencies].filter((a) => a.status === "pending"),
      );
    } catch (err) {
      setError((err as Error).message || "Could not load what is waiting.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [props, agents, agencies] = await Promise.all([
          api<{ data: PendingListing[] }>("/admin/properties?status=pending&per_page=100"),
          listAccounts("agent"),
          listAccounts("agency"),
        ]);

        if (!active) return;
        setListings(props.data);
        setAccounts(
          [...agents, ...agencies].filter((a) => a.status === "pending"),
        );
      } catch (err) {
        if (active) {
          setError((err as Error).message || "Could not load what is waiting.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  async function decideListing(id: string, status: "published" | "rejected") {
    setBusyId(id);
    try {
      await api(`/admin/properties/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      await load();
    } catch {
      setError("Could not update that listing.");
    } finally {
      setBusyId(null);
    }
  }

  async function decideAccount(id: string, status: "approved" | "rejected") {
    setBusyId(id);
    try {
      await setAccountStatus(id, status);
      await load();
    } catch {
      setError("Could not update that account.");
    } finally {
      setBusyId(null);
    }
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "listings", label: "Listings", count: listings.length },
    { key: "accounts", label: "Accounts", count: accounts.length },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Approvals"
        description="Listings and accounts waiting on a decision."
        breadcrumbs={[{ label: "Approvals" }]}
      />

      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={[
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-[12px] font-semibold transition-colors",
              tab === t.key
                ? "bg-primary text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-primary/40",
            ].join(" ")}
          >
            {t.label}
            <span
              className={[
                "rounded-full px-1.5 text-[10px]",
                tab === t.key ? "bg-white/20" : "bg-gray-100 text-gray-600",
              ].join(" ")}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="rounded-lg border border-gray-200 bg-white py-16 text-center text-[13px] text-gray-500">
          Loading...
        </p>
      ) : tab === "listings" ? (
        listings.length === 0 ? (
          <Empty what="listings" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[760px] text-[12px]">
              <thead>
                <tr className="bg-gray-50 text-left text-[10px] uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-2.5 font-medium">Property</th>
                  <th className="px-4 py-2.5 font-medium">Sent by</th>
                  <th className="px-4 py-2.5 font-medium">Price</th>
                  <th className="px-4 py-2.5 text-right font-medium">Decision</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="font-semibold text-gray-800 hover:text-primary"
                      >
                        {p.title}
                      </Link>
                      {/* The serial both sides quote when they discuss it. */}
                      <p className="mt-0.5 font-mono text-[10px] text-gray-400">
                        {p.reference ?? `ID ${p.id}`}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">
                        {p.agent?.name ?? "—"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {p.agency?.name
                          ? `Agency · ${p.agency.name}`
                          : p.agent?.title || "Owner"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                      {formatPKR(p.price)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={busyId === p.id}
                          onClick={() => decideListing(p.id, "published")}
                          className="rounded-md bg-primary px-3 py-1.5 text-[11.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busyId === p.id}
                          onClick={() => decideListing(p.id, "rejected")}
                          className="rounded-md border border-red-200 px-3 py-1.5 text-[11.5px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : accounts.length === 0 ? (
        <Empty what="accounts" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-[720px] text-[12px]">
            <thead>
              <tr className="bg-gray-50 text-left text-[10px] uppercase tracking-wide text-gray-500">
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Contact</th>
                <th className="px-4 py-2.5 text-right font-medium">Decision</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{a.name}</p>
                    {a.agency && (
                      <p className="text-[10px] text-gray-400">{a.agency}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.role} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <p>{a.email}</p>
                    {a.phone && (
                      <p className="text-[10px] text-gray-400">{a.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={busyId === a.id}
                        onClick={() => decideAccount(a.id, "approved")}
                        className="rounded-md bg-primary px-3 py-1.5 text-[11.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyId === a.id}
                        onClick={() => decideAccount(a.id, "rejected")}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-[11.5px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Empty({ what }: { what: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
      <p className="text-[13px] font-semibold text-gray-700">
        Nothing waiting
      </p>
      <p className="mt-1 text-[12px] text-gray-500">
        No {what} need a decision right now.
      </p>
    </div>
  );
}
