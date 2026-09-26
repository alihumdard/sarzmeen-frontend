import type { Metadata } from "next";
import CantFindBanner from "@/components/property/CantFindBanner";
import ListingSearchBar from "@/components/property/ListingSearchBar";
import PopularSearches from "@/components/property/PopularSearches";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyResults from "@/components/property/PropertyResults";
import PageBanner from "@/components/layout/PageBanner";
import { rentProperties } from "@/constants/mockRentProperties";
import { cities } from "@/constants/searchOptions";
import { filterProperties } from "@/lib/utils/filterProperties";

export const metadata: Metadata = {
  title: "Properties for Rent",
  description:
    "Browse verified houses, flats, portions and commercial spaces available on rent across all major cities of Pakistan.",
};

type RentPageProps = {
  searchParams: Promise<{
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

export default async function RentPage({ searchParams }: RentPageProps) {
  const params = await searchParams;

  const cityName = resolveCityName(params.city);

  const title = cityName
    ? `Properties for Rent in ${cityName}`
    : "Properties for Rent";

  const results = filterProperties(rentProperties, params);

  return (
    <main>
      <PageBanner
        title={title}
        description={`${results.length.toLocaleString("en-US")} ${results.length === 1 ? "property" : "properties"} available`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Rent" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
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
