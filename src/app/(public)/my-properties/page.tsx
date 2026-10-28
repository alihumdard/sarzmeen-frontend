"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import StatusBadge from "@/components/admin/StatusBadge";
import { api } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import { formatPKR } from "@/lib/paymentPlan";

type MyProperty = {
  id: string;
  slug: string;
  reference?: string | null;
  title: string;
  location: string;
  price: number;
  status: string;
  area: string;
  image: string;
};

/**
 * A plain user's own listings.
 *
 * The header has always offered "My Properties", but it pointed at the
 * admin panel, which a plain user is sent straight back out of — so the
 * link went nowhere and their listings looked lost.
 */
export default function MyPropertiesPage() {
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<MyProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    let active = true;

    (async () => {
      try {
        const res = await api<{ data: MyProperty[] }>("/my/properties?per_page=50");
        if (active) setItems(res.data);
      } catch (err) {
        if (active) {
          setError((err as Error).message || "Could not load your properties.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [authLoading, user]);

  if (!authLoading && !user) {
    return (
      <Shell>
        <Empty
          title="Please log in"
          body="Log in to see the properties you have listed."
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
          title="You have not listed anything yet"
          body="Add your first property and it will appear here with its status."
          action={{ href: "/properties/add", label: "Add a property" }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((p) => (
            <article
              key={p.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-white p-4 sm:flex-row"
            >
              <div className="relative h-[120px] w-full shrink-0 overflow-hidden rounded-lg bg-surface sm:w-[180px]">
                <SafeImage
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="180px"
                  className="object-cover"
                  fallbackText="No photo"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-[15px] font-bold leading-snug text-heading">
                    {p.title}
                  </h2>
                  <StatusBadge status={p.status} />
                </div>

                <p className="mt-1 text-[12.5px] text-muted">{p.location}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px]">
                  <span className="font-bold text-primary">
                    {formatPKR(p.price)}
                  </span>
                  <span className="text-muted">{p.area}</span>
                  {p.reference && (
                    <span className="font-mono text-[11px] text-muted">
                      {p.reference}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-semibold">
                  {p.status === "published" && (
                    <Link
                      href={`/properties/${p.slug}`}
                      className="text-primary hover:underline"
                    >
                      View listing
                    </Link>
                  )}
                  <span className="text-muted">
                    {p.status === "draft"
                      ? "Not submitted yet"
                      : p.status === "pending"
                        ? "Waiting for approval"
                        : p.status === "rejected"
                          ? "Not approved — contact us"
                          : ""}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-surface py-10 sm:py-14">
      <div className="container-page">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-6">
            <h1 className="text-[24px] font-bold text-heading sm:text-[28px]">
              My Properties
            </h1>
            <p className="mt-1 text-[13px] text-muted">
              Everything you have listed, and where each one stands.
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
