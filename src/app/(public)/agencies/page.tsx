import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AgencyCard from "@/components/agency/AgencyCard";
import AgencySearchBar from "@/components/agency/AgencySearchBar";
import PageBanner from "@/components/layout/PageBanner";
import { agencies } from "@/constants/mockAgencies";

export const metadata: Metadata = {
  title: "Real Estate Agencies",
  description:
    "Browse verified real estate agencies across Pakistan, view their teams and get in touch with the right agency for your next move.",
};

type AgenciesPageProps = {
  searchParams: Promise<{ city?: string; q?: string }>;
};

export default async function AgenciesPage({
  searchParams,
}: AgenciesPageProps) {
  const { city, q } = await searchParams;

  const term = q?.trim().toLowerCase();

  const results = agencies.filter((agency) => {
    if (city && agency.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }

    if (!term) return true;

    // Matches the agency itself, the person who runs it, or where it works.
    return [
      agency.name,
      agency.owner.name,
      agency.city,
      agency.agencyType,
      ...agency.locations,
    ].some((field) => field.toLowerCase().includes(term));
  });

  /** City chips, built from the data so a new city needs no edit here. */
  const cities = [...new Set(agencies.map((agency) => agency.city))].sort();

  return (
    <main>
      <PageBanner
        title={city ? `Real Estate Agencies in ${city}` : "Real Estate Agencies"}
        description={`${results.length} ${results.length === 1 ? "agency" : "agencies"} listed`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Agencies" }]}
        contentMaxWidth="720px"
        image="/images/agents-banner.jpg"
      >
        <Suspense
          fallback={<div className="h-[66px] rounded-lg bg-white shadow-xl" />}
        >
          <AgencySearchBar />
        </Suspense>
      </PageBanner>

      <section className="bg-surface py-8">
        <div className="container-page">
          {/* City filter. Each chip keeps the current search term. */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={term ? `/agencies?q=${encodeURIComponent(term)}` : "/agencies"}
              className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
                !city
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-text hover:border-primary hover:text-primary"
              }`}
            >
              All Cities
            </Link>

            {cities.map((name) => {
              const isActive = city?.toLowerCase() === name.toLowerCase();
              const params = new URLSearchParams({ city: name });
              if (term) params.set("q", term);

              return (
                <Link
                  key={name}
                  href={`/agencies?${params.toString()}`}
                  className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-text hover:border-primary hover:text-primary"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
          </div>

          {results.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-border bg-white py-16 text-center">
              <p className="text-[15px] font-semibold text-heading">
                {q
                  ? `No agencies match “${q}”`
                  : `No agencies found in ${city}`}
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
