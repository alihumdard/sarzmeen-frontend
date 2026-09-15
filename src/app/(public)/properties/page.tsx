import type { Metadata } from "next";
import CantFindBanner from "@/components/property/CantFindBanner";
import ListingSearchBar from "@/components/property/ListingSearchBar";
import PopularSearches from "@/components/property/PopularSearches";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyResults from "@/components/property/PropertyResults";
import PageBanner from "@/components/layout/PageBanner";
import { featuredProperties } from "@/constants/mockProperties";
import { cities } from "@/constants/searchOptions";
import { filterProperties } from "@/lib/utils/filterProperties";

export const metadata: Metadata = {
  title: "Properties for Sale",
  description:
    "Browse verified houses, plots, flats and commercial properties for sale across all major cities of Pakistan.",
};

type PropertiesPageProps = {
  searchParams: Promise<{
    purpose?: string;
    city?: string;
    location?: string;
    type?: string;
    price?: string;
  }>;
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

  const cityName = resolveCityName(params.city);

  const title = cityName
    ? `Properties for Sale in ${cityName}`
    : "Properties for Sale";

  const results = filterProperties(featuredProperties, params);

  return (
    <main>
      <PageBanner
        title={title}
        description={`${results.length.toLocaleString("en-US")} ${results.length === 1 ? "property" : "properties"} available`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]}
        contentMaxWidth="720px"
        image="/images/city-1.jpg"
      >
        <ListingSearchBar />
        <PopularSearches />
      </PageBanner>

      <section className="bg-surface py-8">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          <PropertyFilters initialType={params.type} />
          <PropertyResults properties={results} total={results.length} />
        </div>
      </section>

      <CantFindBanner />
    </main>
  );
}
