import type { Metadata } from "next";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { Suspense } from "react";
import AgencySearchBar from "@/components/agency/AgencySearchBar";
import PageBanner from "@/components/layout/PageBanner";
import { serverApi } from "@/lib/api/server";
import type { AgencyListItem } from "@/lib/api/agencies";
import {
  LocationPinIcon,
  PhoneIcon,
  UsersIcon,
  VerifiedTickIcon,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Real Estate Agencies",
  description:
    "Browse verified real estate agencies across Pakistan, view their teams and get in touch with the right agency for your next move.",
};

type AgenciesPageProps = {
  searchParams: Promise<{ city?: string; q?: string; page?: string }>;
};

export default async function AgenciesPage({ searchParams }: AgenciesPageProps) {
  const { city, q, page } = await searchParams;

  const qs = new URLSearchParams();
  if (city) qs.set("city", city);
  if (q) qs.set("q", q);
  if (page) qs.set("page", page);
  const query = qs.toString();

  const res = await serverApi<{
    data: AgencyListItem[];
    meta: { total: number; last_page: number; current_page: number };
  }>(`/agencies${query ? `?${query}` : ""}`);

  const results = res.data;
  const total = res.meta.total;

  return (
    <main>
      <PageBanner
        title={city ? `Real Estate Agencies in ${city}` : "Real Estate Agencies"}
        description={`${total} ${total === 1 ? "agency" : "agencies"} listed`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Agencies" }]}
        contentMaxWidth="720px"
        image="/images/agents-banner.jpg"
      >
        <Suspense fallback={<div className="h-[66px] rounded-lg bg-white shadow-xl" />}>
          <AgencySearchBar />
        </Suspense>
      </PageBanner>

      <section className="bg-surface py-8">
        <div className="container-page">
          {results.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((agency) => (
                <AgencyApiCard key={agency.id} agency={agency} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-white py-16 text-center">
              <p className="text-[15px] font-semibold text-heading">
                {q ? `No agencies match "${q}"` : city ? `No agencies found in ${city}` : "No agencies found"}
              </p>
              <p className="mt-1 text-[13px] text-muted">
                Try a different search term or browse all agencies.
              </p>
              <Link
                href="/agencies"
                className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                View All Agencies
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function AgencyApiCard({ agency }: { agency: AgencyListItem }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div>
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white">
            {agency.logo ? (
              <SafeImage src={agency.logo} alt={agency.name} fill sizes="56px" className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-light text-[18px] font-bold text-primary">
                {agency.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/agencies/${agency.slug}`}
                className="text-[16px] font-bold text-heading transition-colors hover:text-primary"
              >
                {agency.name}
              </Link>
              {agency.verified && (
                <span className="flex shrink-0 items-center gap-1 rounded bg-primary-light px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <VerifiedTickIcon className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[12px] font-medium text-muted">
              {agency.agencyType || "Real Estate Agency"}
              {agency.city && <> • <span className="font-semibold text-heading">{agency.city}</span></>}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-md bg-primary-light px-2 py-2 text-center">
            <p className="text-[15px] font-bold text-primary">{agency.totalAgents}</p>
            <p className="text-[11px] font-medium text-primary/80">Agents</p>
          </div>
          <div className="rounded-md bg-surface px-2 py-2 text-center">
            <p className="text-[15px] font-bold text-heading">—</p>
            <p className="text-[11px] font-medium text-muted">For Sale</p>
          </div>
          <div className="rounded-md bg-surface px-2 py-2 text-center">
            <p className="text-[15px] font-bold text-heading">—</p>
            <p className="text-[11px] font-medium text-muted">For Rent</p>
          </div>
        </div>

        {agency.description && (
          <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-text">
            {agency.description}
          </p>
        )}

        {agency.owner && (
          <div className="mt-3 flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
              {agency.owner.avatar ? (
                <SafeImage src={agency.owner.avatar} alt={agency.owner.name} fill sizes="32px" className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-light text-[12px] font-bold text-primary">
                  {agency.owner.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-heading">{agency.owner.name}</p>
              <p className="truncate text-[11px] text-muted">{agency.owner.title}</p>
            </div>
          </div>
        )}

        {agency.locations && agency.locations.length > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
            <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{agency.locations.join(", ")}</span>
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          {agency.phone && (
            <a
              href={`tel:${agency.phone.replace(/\s/g, "")}`}
              aria-label={`Call ${agency.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
            >
              <PhoneIcon className="h-4 w-4" />
            </a>
          )}
          <span className="flex items-center gap-1.5 text-[11px] text-muted">
            <UsersIcon className="h-3.5 w-3.5" />
            {agency.totalAgents} agents
          </span>
        </div>
        <Link
          href={`/agencies/${agency.slug}`}
          className="group flex items-center gap-1.5 rounded-md bg-primary-light px-4 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          View Agency
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}
