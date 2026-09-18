"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useTransition, Suspense } from "react";
import { demoAgents, Agent } from "@/data/agents";
import AgentsHero from "@/components/agents/AgentsHero";
import AgentFilters from "@/components/agents/AgentFilters";
import AgentResults from "@/components/agents/AgentResults";
import AgenciesByCity from "@/components/agents/AgenciesByCity";
import AgentsPagination from "@/components/agents/AgentsPagination";

const ITEMS_PER_PAGE = 6;

function AgentsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read search params
  const cityQuery = searchParams.get("city") || "";
  const propertyTypeQuery = searchParams.get("propertyType") || "";
  const locationQuery = searchParams.get("location") || "";
  const companyQuery = searchParams.get("companyName") || "";
  const pageQuery = Number(searchParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(pageQuery);

  // Sync state with query params when URL changes
  useEffect(() => {
    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // Filtering logic
  const homesSubtypesList = ["House", "Flat", "Upper Portion", "Lower Portion", "Farm House", "Room", "Penthouse", "Apartment"];
  const plotsSubtypesList = ["Residential Plot", "Commercial Plot", "Agricultural Land", "Farm Land"];
  const commercialSubtypesList = ["Shop", "Office", "Building", "Warehouse", "Factory", "Commercial Plot"];

  const filteredAgents = demoAgents.filter((agent) => {
    // City filter
    if (cityQuery && agent.city.toLowerCase() !== cityQuery.toLowerCase()) {
      return false;
    }

    // Property Type filter
    if (propertyTypeQuery) {
      const q = propertyTypeQuery.toLowerCase();
      let matchType = false;
      if (q === "homes") {
        matchType = agent.propertyTypes.some((t) =>
          homesSubtypesList.some((h) => t.toLowerCase().includes(h.toLowerCase()))
        );
      } else if (q === "plots") {
        matchType = agent.propertyTypes.some((t) =>
          plotsSubtypesList.some((p) => t.toLowerCase().includes(p.toLowerCase()))
        );
      } else if (q === "commercial") {
        matchType = agent.propertyTypes.some((t) =>
          commercialSubtypesList.some((c) => t.toLowerCase().includes(c.toLowerCase()))
        );
      } else {
        matchType = agent.propertyTypes.some((t) =>
          t.toLowerCase().includes(q)
        );
      }
      if (!matchType) return false;
    }

    // Location filter
    if (locationQuery) {
      const matchLoc = agent.locations.some((l) =>
        l.toLowerCase().includes(locationQuery.toLowerCase())
      );
      if (!matchLoc) return false;
    }

    // Company Name filter
    if (companyQuery) {
      const matchComp = agent.name.toLowerCase().includes(companyQuery.toLowerCase());
      if (!matchComp) return false;
    }

    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE) || 1;
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function updateQueryString(updates: Record<string, string | number>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function handleFilterChange(filters: {
    propertyType: string;
    city: string;
    location: string;
    companyName: string;
  }) {
    updateQueryString({
      propertyType: filters.propertyType,
      city: filters.city,
      location: filters.location,
      companyName: filters.companyName,
      page: 1,
    });
  }

  function handleReset() {
    updateQueryString({
      propertyType: "",
      city: "",
      location: "",
      companyName: "",
      page: 1,
    });
  }

  function handleSelectCity(cityName: string) {
    updateQueryString({
      city: cityName,
      page: 1,
    });
  }

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
    updateQueryString({ page: newPage });
    window.scrollTo({ top: 400, behavior: "smooth" });
  }

  return (
    <>
      <AgentsHero />

      <AgentFilters
        propertyType={propertyTypeQuery}
        city={cityQuery}
        location={locationQuery}
        companyName={companyQuery}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <AgentResults
        agents={paginatedAgents}
        selectedCity={cityQuery}
        onClearFilters={handleReset}
      />

      <AgentsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AgenciesByCity onSelectCity={handleSelectCity} />
    </>
  );
}

export default function AgentsPage() {
  return (
    <main>
      <Suspense fallback={<div className="py-20 text-center text-muted">Loading agents...</div>}>
        <AgentsContent />
      </Suspense>
    </main>
  );
}
