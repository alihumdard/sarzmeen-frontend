"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PrintablePlan from "@/components/tools/PrintablePlan";
import { useAuth } from "@/context/AuthContext";
import { formatPKR } from "@/lib/paymentPlan";
import { buildPlanDocument, type PlanDocument } from "@/lib/savedPlanDocument";
import {
  deleteSavedPlan,
  getSavedPlan,
  listSavedPlans,
  type SavedPlan,
} from "@/lib/api/savedPlans";

/** A plan with its figures worked out, ready to print. */
type Printable = { plan: SavedPlan; doc: PlanDocument };

/**
 * Payment plans the buyer kept from the calculator.
 *
 * Opening one hands its id back to the calculator, which rebuilds the plan
 * from the inputs it was saved with rather than from the totals shown here.
 * Ticking several and printing rebuilds each the same way, so a printed
 * batch matches what opening them one by one would show.
 */
export default function MyPlansPage() {
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const [picked, setPicked] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [preparing, setPreparing] = useState(false);

  /*
   * The statements to print. Held in state rather than derived, because the
   * inputs behind them are fetched one plan at a time -- the list leaves
   * them out -- and the print dialog may only open once they are all in.
   */
  const [printable, setPrintable] = useState<Printable[]>([]);
  const [printQueued, setPrintQueued] = useState(false);
  const [printMode, setPrintMode] = useState<"summary" | "full">("full");

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

  /*
   * Opening the dialog in the same handler that sets the statements would
   * print the previous batch, because React has not re-rendered yet. So the
   * dialog is opened from an effect, once the chosen plans are on the page.
   */
  useEffect(() => {
    if (!printQueued || printable.length === 0) return;
    setPrintQueued(false);
    window.print();
  }, [printQueued, printable]);

  const remove = async (plan: SavedPlan) => {
    if (!confirm(`Delete "${plan.title}"?`)) return;
    setBusy(plan.id);
    try {
      await deleteSavedPlan(plan.id);
      setItems((cur) => cur.filter((p) => p.id !== plan.id));
      setPicked((cur) => cur.filter((id) => id !== plan.id));
    } catch {
      setError("Could not delete that plan.");
    } finally {
      setBusy(null);
    }
  };

  const toggle = (id: string) =>
    setPicked((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );

  const allPicked = items.length > 0 && picked.length === items.length;

  const toggleAll = () =>
    setPicked(allPicked ? [] : items.map((p) => p.id));

  /** The chosen plans, in the order they appear on screen. */
  const chosen = useMemo(
    () => items.filter((p) => picked.includes(p.id)),
    [items, picked],
  );

  /**
   * Fetches each chosen plan's inputs and works its figures out.
   *
   * The list omits the inputs, so every plan is fetched on its own. One that
   * cannot be loaded is left out rather than failing the batch, and the
   * count that did make it is reported back.
   */
  const gather = async (): Promise<Printable[]> => {
    const results = await Promise.all(
      chosen.map(async (plan) => {
        try {
          const { data } = await getSavedPlan(plan.id);
          if (!data.inputs) return null;
          return { plan: data, doc: buildPlanDocument(data.inputs) };
        } catch {
          return null;
        }
      }),
    );

    return results.filter((r): r is Printable => r !== null);
  };

  const printPicked = async (mode: "summary" | "full") => {
    if (chosen.length === 0 || preparing) return;

    setPreparing(true);
    setError(null);

    try {
      const ready = await gather();

      if (ready.length === 0) {
        setError("Could not load the plans you picked. Please try again.");
        return;
      }

      if (ready.length < chosen.length) {
        setError(
          `Printing ${ready.length} of ${chosen.length} plans — the rest could not be loaded.`,
        );
      }

      setPrintMode(mode);
      setPrintable(ready);
      setPrintQueued(true);
    } finally {
      setPreparing(false);
    }
  };

  const copyPicked = async () => {
    if (chosen.length === 0 || preparing) return;

    setPreparing(true);
    setError(null);

    try {
      const ready = await gather();

      if (ready.length === 0) {
        setError("Could not load the plans you picked. Please try again.");
        return;
      }

      const text = ready.map(({ plan, doc }) => planAsText(plan, doc)).join(
        "\n\n----------------------------------------\n\n",
      );

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* Clipboard access is refused in some in-app browsers; fall back. */
        const box = document.createElement("textarea");
        box.value = text;
        box.style.position = "fixed";
        box.style.opacity = "0";
        document.body.appendChild(box);
        box.select();
        try {
          document.execCommand("copy");
        } catch {
          document.body.removeChild(box);
          setError("Could not copy. Your browser refused clipboard access.");
          return;
        }
        document.body.removeChild(box);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } finally {
      setPreparing(false);
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
        <>
          {/* Pick plans, then act on all of them at once. */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3">
            <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] font-semibold text-heading">
              <input
                type="checkbox"
                checked={allPicked}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              {picked.length > 0
                ? `${picked.length} selected`
                : "Select all"}
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copyPicked}
                disabled={picked.length === 0 || preparing}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-[11.5px] font-semibold text-heading transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-border disabled:hover:text-heading"
              >
                <CopyIcon />
                {copied ? "Copied" : "Copy plans"}
              </button>

              <button
                type="button"
                onClick={() => printPicked("summary")}
                disabled={picked.length === 0 || preparing}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-[11.5px] font-semibold text-heading transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-border disabled:hover:text-heading"
              >
                <PrinterIcon />
                Print summaries
              </button>

              <button
                type="button"
                onClick={() => printPicked("full")}
                disabled={picked.length === 0 || preparing}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[11.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <PrinterIcon />
                {preparing ? "Preparing…" : "Print full plans"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((plan) => {
              // A discount is the only thing that parts these two.
              const discounted =
                plan.netTotal > 0 && plan.netTotal < plan.totalPrice;
              const isPicked = picked.includes(plan.id);

              return (
                <article
                  key={plan.id}
                  className={`flex flex-col gap-3 rounded-xl border bg-white p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                    isPicked ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isPicked}
                      onChange={() => toggle(plan.id)}
                      aria-label={`Select ${plan.title}`}
                      className="h-4 w-4 shrink-0 rounded border-border accent-primary"
                    />

                    <div className="min-w-0">
                      <h2 className="truncate text-[15px] font-bold text-heading">
                        {plan.title}
                      </h2>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px]">
                        <span className="font-bold text-primary">
                          {formatPKR(
                            discounted ? plan.netTotal : plan.totalPrice,
                          )}
                        </span>

                        {discounted && (
                          <span className="text-muted line-through">
                            {formatPKR(plan.totalPrice)}
                          </span>
                        )}

                        <span className="text-muted">
                          {savedOn(plan.savedAt)}
                        </span>
                      </div>
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
        </>
      )}

      {/*
        Hidden on screen, revealed only by the print stylesheet, so the
        buyer sees the list and the printer gets one statement per plan.
      */}
      {printable.length > 0 && (
        <div className="printable-stack" aria-hidden="true">
          {printable.map(({ plan, doc }) => (
            <PrintablePlan
              key={plan.id}
              plan={doc.plan}
              totalPrice={doc.totalPrice}
              area={doc.area}
              unit={doc.unit}
              rate={doc.rate}
              startDate={doc.startDate}
              title={plan.title}
              discount={doc.discount}
              discountLabel={doc.discountLabel}
              netTotal={doc.netTotal}
              mode={printMode}
            />
          ))}
        </div>
      )}
    </Shell>
  );
}

/** One plan written out as plain text, for the clipboard. */
function planAsText(plan: SavedPlan, doc: PlanDocument): string {
  const lines: string[] = ["Payment Plan — Sarzameen.com", plan.title, ""];

  if (doc.area && doc.rate > 0) {
    lines.push(`Property Size: ${doc.area.toLocaleString()} ${doc.unitShort}`);
    lines.push(`Rate: ${formatPKR(doc.rate)} / ${doc.unitShort}`);
  }
  lines.push(`Total Price: ${formatPKR(doc.totalPrice)}`);

  if (doc.discount > 0.005) {
    lines.push(
      `Discount: ${formatPKR(doc.discount)} off ${doc.discountLabel}`,
    );
    lines.push(`Net Payable: ${formatPKR(doc.netTotal)}`);
  }

  lines.push("", "PAYMENT PLAN");
  for (const c of doc.plan.components) {
    if (c.resolvedTotal <= 0.005) continue;
    lines.push(
      c.count > 1
        ? `- ${c.label}: ${formatPKR(c.resolvedEach)} × ${c.count} = ${formatPKR(c.resolvedTotal)}`
        : `- ${c.label}: ${formatPKR(c.resolvedTotal)} (one payment)`,
    );
  }

  lines.push("", `Total: ${formatPKR(doc.netTotal)}`, "");
  lines.push("An estimate only. Actual plans vary by developer and project.");

  return lines.join("\n");
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

function CopyIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function PrinterIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2" />
      <rect x="6" y="14" width="12" height="7" rx="1" />
    </svg>
  );
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
