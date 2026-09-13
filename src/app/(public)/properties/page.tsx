import type { Metadata } from "next";
import CantFindBanner from "@/components/property/CantFindBanner";
import ListingSearchBar from "@/components/property/ListingSearchBar";
import PopularSearches from "@/components/property/PopularSearches";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyResults from "@/components/property/PropertyResults";
import PageBanner from "@/components/layout/PageBanner";
import {
  featuredProperties,
  totalPropertyCount,
} from "@/constants/mockProperties";
import { cities } from "@/constants/searchOptions";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent",
  description:
    "Browse verified houses, plots, flats and commercial properties for sale and rent across all major cities of Pakistan.",
};

type PropertiesPageProps = {
  searchParams: Promise<{ purpose?: string; city?: string }>;
};

/** Turns a city slug from the URL into its display name. */
function resolveCityName(slug?: string) {
  if (!slug) return null;
  return cities.find((city) => city.value === slug)?.label ?? null;
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params = await searchParams;

  const purposeLabel = params.purpose === "rent" ? "for Rent" : "for Sale";
  const cityName = resolveCityName(params.city);

  const title = cityName
    ? `Properties ${purposeLabel} in ${cityName}`
    : `Properties ${purposeLabel}`;

  return (
    <main>
      <PageBanner
        title={title}
        description={`${totalPropertyCount.toLocaleString("en-US")}+ properties available`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]}
        contentMaxWidth="720px"
      >
        <ListingSearchBar />
        <PopularSearches />
      </PageBanner>

      <section className="bg-surface py-8">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          <PropertyFilters />
          <PropertyResults
            properties={featuredProperties}
            total={totalPropertyCount}
          />
        </div>
      </section>

      <CantFindBanner />
    </main>
  );
}
