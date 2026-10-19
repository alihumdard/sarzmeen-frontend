"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { listAgents, type AgentListItem } from "@/lib/api/agents";
import {
  EnvelopeIcon,
  PhoneIcon,
  ResetIcon,
  SearchIcon,
  VerifiedTickIcon,
} from "@/components/ui/Icons";

export default function AgentsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const qParam = searchParams.get("q") || "";
  const cityParam = searchParams.get("city") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(qParam);

  useEffect(() => {
    setLoading(true);
    listAgents({ q: qParam, city: cityParam, page: pageParam, per_page: 12 })
      .then((res) => {
        setAgents(res.data);
        setTotal(res.meta.total);
        setLastPage(res.meta.last_page);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [qParam, cityParam, pageParam]);

  function updateParams(updates: Record<string, string | number>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, String(value));
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: searchText, page: 1 });
  }

  function clearFilters() {
    setSearchText("");
    startTransition(() => router.push(pathname, { scroll: false }));
  }

  return (
    <>
      {/* Search bar */}
      <section className="py-6">
        <div className="container-page">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm sm:flex-row"
          >
            {/*
              `min-w-0` lets the field shrink below its placeholder width. A
              flex child refuses to by default, which pushed the button off
              the right edge of a phone screen.
            */}
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search agents by name, agency, or city..."
              /* `flex-1` only from sm:, where the row is horizontal. In a
                 column it stretches the field along the wrong axis and
                 flattens it against the button. */
              className="h-11 w-full min-w-0 rounded-md border border-gray-300 bg-white px-4 text-[13px] text-heading outline-none placeholder:text-muted focus:border-primary sm:flex-1"
            />
            <button
              type="submit"
              className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-6 text-[13px] font-semibold text-white hover:opacity-90 sm:w-auto"
            >
              <SearchIcon className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="pb-12">
        <div className="container-page">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-heading">
              {qParam ? `Results for "${qParam}"` : "Real Estate Agents"}
            </h2>
            <p className="text-[13px] font-medium text-muted">
              {total} {total === 1 ? "Agent" : "Agents"} Found
            </p>
          </div>

          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            </div>
          ) : agents.length > 0 ? (
            <>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                  <AgentApiCard key={agent.id} agent={agent} />
                ))}
              </div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        updateParams({ page: p });
                        window.scrollTo({ top: 400, behavior: "smooth" });
                      }}
                      className={`h-9 min-w-[36px] rounded-md px-3 text-[13px] font-semibold transition-colors ${
                        p === pageParam
                          ? "bg-primary text-white"
                          : "border border-border bg-white text-heading hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="mt-12 flex flex-col items-center rounded-xl border border-border bg-white p-12 text-center shadow-sm">
              <h3 className="text-[18px] font-bold text-heading">No agents found</h3>
              <p className="mt-2 max-w-sm text-[13px] text-text">
                Try a different search or browse all agents.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
              >
                <ResetIcon className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function AgentApiCard({ agent }: { agent: AgentListItem }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div>
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
            {agent.avatar ? (
              <SafeImage src={agent.avatar} alt={agent.name} fill sizes="56px" className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-light text-[18px] font-bold text-primary">
                {agent.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/agents/${agent.slug}`}
                className="text-[16px] font-bold text-heading transition-colors hover:text-primary"
              >
                {agent.name}
              </Link>
              {agent.verified && (
                <span className="flex shrink-0 items-center gap-1 rounded bg-primary-light px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <VerifiedTickIcon className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[12px] font-medium text-muted">
              {agent.title || "Real Estate Agent"}
              {agent.agency && (
                <> • <span className="font-semibold text-heading">{agent.agency.name}</span></>
              )}
            </p>
          </div>
        </div>

        {agent.bio && (
          <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-text">
            {agent.bio}
          </p>
        )}

        {agent.specializations && agent.specializations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {agent.specializations.slice(0, 3).map((spec) => (
              <span key={spec} className="rounded bg-surface px-2 py-0.5 text-[11px] text-muted">
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Wraps rather than pushing "View Profile" past the card edge when the
          card is narrow. */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          {agent.email && (
            <a
              href={`mailto:${agent.email}`}
              aria-label={`Email ${agent.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
            >
              <EnvelopeIcon className="h-4 w-4" />
            </a>
          )}
          {agent.phone && (
            <a
              href={`tel:${agent.phone.replace(/\s/g, "")}`}
              aria-label={`Call ${agent.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
            >
              <PhoneIcon className="h-4 w-4" />
            </a>
          )}
        </div>
        <Link
          href={`/agents/${agent.slug}`}
          className="group flex shrink-0 items-center gap-1.5 rounded-md bg-primary-light px-4 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          View Profile
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}
