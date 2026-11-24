import type { Metadata } from "next";
import PageBanner from "@/components/layout/PageBanner";
import MapBrowser from "@/components/society-maps/MapBrowser";
import { serverApi } from "@/lib/api/server";
import type { MapCity, SocietyMap } from "@/types/societyMap";

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

export default async function SocietyMapsPage() {
  /* Both at once: the cities are a filter over the same maps, and
     fetching them in turn would delay the page for no reason. */
  const [maps, cities] = await Promise.all([getMaps(), getCities()]);

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
    </main>
  );
}
