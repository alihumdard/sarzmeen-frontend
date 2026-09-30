import type { Metadata } from "next";
import CantFindBanner from "@/components/property/CantFindBanner";
import ListingSearchBar from "@/components/property/ListingSearchBar";
import PopularSearches from "@/components/property/PopularSearches";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyResults from "@/components/property/PropertyResults";
import PageBanner from "@/components/layout/PageBanner";
import { serverApi } from "@/lib/api/server";
import { cities } from "@/constants/searchOptions";
import type { Property } from "@/types/property";

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

  const qs = new URLSearchParams();
  if (params.purpose) qs.set("purpose", params.purpose);
  if (params.city) qs.set("city", params.city);
  if (params.type) qs.set("type", params.type);
  if (params.price) {
    const [min, max] = params.price.split("-");
    if (min) qs.set("price_min", min);
    if (max) qs.set("price_max", max);
  }

  const query = qs.toString();
  const res = await serverApi<{
    data: Property[];
    meta: { total: number };
  }>(`/properties${query ? `?${query}` : ""}`);

  const results = res.data;
  const total = res.meta.total;

  return (
    <main>
      <PageBanner
        title={title}
        description={`${total.toLocaleString("en-US")} ${total === 1 ? "property" : "properties"} available`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      >
        <ListingSearchBar />
        <PopularSearches />
      </PageBanner>

      <section className="bg-surface py-8">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          <PropertyFilters initialType={params.type} />
          <PropertyResults properties={results} total={total} />
        </div>
      </section>

      <CantFindBanner />
    </main>
  );
}
