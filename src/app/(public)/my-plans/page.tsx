"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatPKR } from "@/lib/paymentPlan";
import {
  deleteSavedPlan,
  listSavedPlans,
  type SavedPlan,
} from "@/lib/api/savedPlans";

/**
 * Payment plans the buyer kept from the calculator.
 *
 * Opening one hands its id back to the calculator, which rebuilds the plan
 * from the inputs it was saved with rather than from the totals shown here.
 */
export default function MyPlansPage() {
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    let active = true;

    listSavedPlans()
      .then((res) => {
        if (active) setItems(res.data);
      })
      .catch((err) => {
        if (active) {
          setError((err as Error).message || "Could not load your plans.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user]);

  const remove = async (plan: SavedPlan) => {
    if (!confirm(`Delete "${plan.title}"?`)) return;
    setBusy(plan.id);
    try {
      await deleteSavedPlan(plan.id);
      setItems((cur) => cur.filter((p) => p.id !== plan.id));
    } catch {
      setError("Could not delete that plan.");
    } finally {
      setBusy(null);
    }
  };

  if (!authLoading && !user) {
    return (
      <Shell>
        <Empty
          title="Please log in"
          body="Log in to see the payment plans you have saved."
          action={{ href: "/login", label: "Log in" }}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      {error && (
        <p className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </p>
      )}

      {loading || authLoading ? (
        <p className="rounded-xl border border-border bg-white py-16 text-center text-[13px] text-muted">
          Loading...
        </p>
      ) : items.length === 0 ? (
        <Empty
          title="You have not saved a plan yet"
          body="Work one out on the calculator and press Save plan, and it will be here."
          action={{ href: "/calculator", label: "Open the calculator" }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((plan) => {
            // A discount is the only thing that parts these two.
            const discounted = plan.netTotal > 0 && plan.netTotal < plan.totalPrice;

            return (
              <article
                key={plan.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h2 className="truncate text-[15px] font-bold text-heading">
                    {plan.title}
                  </h2>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px]">
                    <span className="font-bold text-primary">
                      {formatPKR(discounted ? plan.netTotal : plan.totalPrice)}
                    </span>

                    {discounted && (
                      <span className="text-muted line-through">
                        {formatPKR(plan.totalPrice)}
                      </span>
                    )}

                    <span className="text-muted">{savedOn(plan.savedAt)}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4 text-[12.5px] font-semibold">
                  <Link
                    href={`/calculator?plan=${plan.id}`}
                    className="text-primary hover:underline"
                  >
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(plan)}
                    disabled={busy === plan.id}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Shell>
  );
}

/** "Saved 3 Nov 2026", in the day-first order Pakistani dates are read in. */
function savedOn(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `Saved ${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-surface py-10 sm:py-14">
      <div className="container-page">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-6">
            <h1 className="text-[24px] font-bold text-heading sm:text-[28px]">
              My Payment Plans
            </h1>
            <p className="mt-1 text-[13px] text-muted">
              Plans you worked out on the calculator and kept.
            </p>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}

function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="rounded-xl border border-border bg-white py-16 text-center">
      <p className="text-[14px] font-bold text-heading">{title}</p>
      <p className="mx-auto mt-1 max-w-[380px] text-[13px] text-muted">{body}</p>
      <Link
        href={action.href}
        className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-7 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        {action.label}
      </Link>
    </div>
  );
}
