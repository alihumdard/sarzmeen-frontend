import type { Metadata } from "next";
import CantFindBanner from "@/components/property/CantFindBanner";
import ListingSearchBar from "@/components/property/ListingSearchBar";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyResults from "@/components/property/PropertyResults";
import PageBanner from "@/components/layout/PageBanner";
import { serverApi } from "@/lib/api/server";
import { cities } from "@/constants/searchOptions";
import type { Property } from "@/types/property";

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
    search?: string;
    price?: string;
    beds?: string;
    baths?: string;
  }>;
};

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

  const qs = new URLSearchParams();
  qs.set("purpose", "rent");
  if (params.city) qs.set("city", params.city);
  if (params.search) qs.set("search", params.search);
  if (params.type) qs.set("type", params.type);
  /* The sidebar offers these on this page too, so they have to be passed on. */
  if (params.beds) qs.set("beds", params.beds);
  if (params.baths) qs.set("baths", params.baths);
  if (params.price) {
    const [min, max] = params.price.split("-");
    if (min) qs.set("price_min", min);
    if (max) qs.set("price_max", max);
  }

  const query = qs.toString();

  // Counts are scoped to rentals, so the sidebar matches this page.
  const [res, facets] = await Promise.all([
    serverApi<{
      data: Property[];
      meta: { total: number };
    }>(`/properties?${query}`),
    serverApi<{ data: { types: Record<string, number> } }>(
      "/properties/facets?purpose=rent",
      60,
    ).catch(() => ({ data: { types: {} } })),
  ]);

  const results = res.data;
  const total = res.meta.total;

  return (
    <main>
      <PageBanner
        title={title}
        description={`${total.toLocaleString("en-US")} ${total === 1 ? "property" : "properties"} available`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Rent" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      >
        <ListingSearchBar basePath="/rent" initialTerm={params.search} />
      </PageBanner>

      {/* Anchor for the search bar, which scrolls results into view. */}
      <section id="listing-results" className="bg-surface py-8 scroll-mt-4">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          <PropertyFilters
            initialType={params.type}
            counts={facets.data.types}
            basePath="/rent"
          />
          <PropertyResults properties={results} total={total} />
        </div>
      </section>

      <CantFindBanner />
    </main>
  );
}
