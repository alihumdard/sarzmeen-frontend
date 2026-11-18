import type { Metadata } from "next";
import PageBanner from "@/components/layout/PageBanner";
import TubeBrowser from "@/components/guides/TubeBrowser";
import { serverApi } from "@/lib/api/server";
import type { Video } from "@/types/video";
import type { VideoCategoryGroup } from "@/types/video";

export const metadata: Metadata = {
  title: "Sarzameen X Tube — Property Videos & Guides",
  description:
    "Property walkthroughs, area guides and how-to videos from Sarzameen.com and the agencies and agents listing with us.",
};

async function getVideos(): Promise<Video[]> {
  try {
    const res = await serverApi<{ data: Video[] }>("/videos?per_page=48", 60);
    return res.data;
  } catch {
    // The page should still render if the API is briefly unreachable.
    return [];
  }
}

async function getCategoryGroups(): Promise<VideoCategoryGroup[]> {
  try {
    const res = await serverApi<{ data: VideoCategoryGroup[] }>(
      "/videos/categories",
      60,
    );
    return res.data;
  } catch {
    return [];
  }
}

export default async function TubePage() {
  /* Both at once: the categories are a filter over the same videos, and
     fetching them in turn would delay the page for no reason. */
  const [videos, groups] = await Promise.all([
    getVideos(),
    getCategoryGroups(),
  ]);

  return (
    <main>
      <PageBanner
        title="Sarzameen X Tube"
        description="Property walkthroughs, area guides and how-to videos — from us and from the agencies listing with us."
        crumbs={[{ label: "Home", href: "/" }, { label: "Sarzameen X Tube" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      />

      <section className="bg-surface py-10">
        <div className="container-page">
          <TubeBrowser videos={videos} groups={groups} />
        </div>
      </section>
    </main>
  );
}
