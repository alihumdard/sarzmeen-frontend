import type { Metadata } from "next";
import PageBanner from "@/components/layout/PageBanner";
import MapBrowser from "@/components/society-maps/MapBrowser";
import { serverApi } from "@/lib/api/server";
import Link from "next/link";
import type {
  MapCity,
  PopularMapGroup,
  SocietyMap,
} from "@/types/societyMap";

export const metadata: Metadata = {
  title: "Society Maps — Lahore, Islamabad & Karachi",
  description:
    "Download high-resolution society maps for housing schemes across Pakistan, with block layouts, plot numbering and area details.",
};

async function getMaps(): Promise<SocietyMap[]> {
  try {
    const res = await serverApi<{ data: SocietyMap[] }>(
      "/society-maps?per_page=100",
      60,
    );
    return res.data;
  } catch {
    // The page should still render if the API is briefly unreachable.
    return [];
  }
}

async function getCities(): Promise<MapCity[]> {
  try {
    const res = await serverApi<{ data: MapCity[] }>(
      "/society-maps/cities",
      60,
    );
    return res.data;
  } catch {
    return [];
  }
}

async function getPopular(): Promise<PopularMapGroup[]> {
  try {
    const res = await serverApi<{ data: PopularMapGroup[] }>(
      "/society-maps/popular",
      60,
    );
    return res.data;
  } catch {
    return [];
  }
}

export default async function SocietyMapsPage() {
  /* Both at once: the cities are a filter over the same maps, and
     fetching them in turn would delay the page for no reason. */
  const [maps, cities, popular] = await Promise.all([
    getMaps(),
    getCities(),
    getPopular(),
  ]);

  return (
    <main>
      <PageBanner
        title="Society Maps"
        description="Block layouts and plot maps for housing societies across Pakistan — view them in detail or download a copy."
        crumbs={[{ label: "Home", href: "/" }, { label: "Society Maps" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      />

      <section className="bg-surface py-10">
        <div className="container-page">
          <MapBrowser maps={maps} cities={cities} />
        </div>
      </section>

      {/* Below the grid: two ways in for a reader who does not already
          know the name of the society they want. */}
      {(cities.length > 0 || popular.length > 0) && (
        <section className="border-t border-border bg-white py-10">
          <div className="container-page grid gap-10 lg:grid-cols-[320px_1fr]">
            {cities.length > 0 && (
              <div>
                <h2 className="text-[17px] font-bold text-heading">
                  Browse maps by city
                </h2>
                <ul className="mt-4 space-y-1">
                  {cities.map((city) => (
                    <li key={city.id}>
                      <Link
                        href={`/society-maps?city=${city.slug}`}
                        className="flex items-center justify-between gap-3 rounded-md px-3 py-1.5 text-[13px] text-text transition-colors hover:bg-surface hover:text-primary"
                      >
                        <span className="min-w-0 truncate">{city.name}</span>
                        <span className="shrink-0 text-[12px] text-muted">
                          ({city.mapCount})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {popular.length > 0 && (
              <div className="min-w-0">
                <h2 className="text-[17px] font-bold text-heading">
                  Most viewed maps
                </h2>

                <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                  {popular.map((group) => (
                    <div key={group.city.id} className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                        {group.city.name}
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {group.maps.map((m) => (
                          <li key={m.id}>
                            <Link
                              href={`/society-maps/${m.slug}`}
                              className="block truncate text-[12.5px] text-text transition-colors hover:text-primary"
                            >
                              {m.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
