import type { Metadata } from "next";
import PageBanner from "@/components/layout/PageBanner";
import VideoCard from "@/components/media/VideoCard";
import { serverApi } from "@/lib/api/server";
import type { Video } from "@/types/video";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Property walkthroughs, market updates and buying guides from the Sarzameen team.",
};

async function getVideos(): Promise<Video[]> {
  try {
    const res = await serverApi<{ data: Video[] }>("/videos?per_page=24", 60);
    return res.data;
  } catch {
    // The page should still render if the API is briefly unreachable.
    return [];
  }
}

export default async function MediaPage() {
  const videos = await getVideos();

  return (
    <main>
      <PageBanner
        title="Media"
        description="Property walkthroughs, market updates and buying guides from our team."
        crumbs={[{ label: "Home", href: "/" }, { label: "Media" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      />

      <section className="bg-surface py-10">
        <div className="container-page">
          {videos.length === 0 ? (
            <p className="rounded-xl border border-border bg-white py-16 text-center text-[13px] text-muted">
              No videos have been published yet.
            </p>
          ) : (
            <>
              <p className="mb-5 text-[13px] text-muted">
                <span className="font-bold text-heading">{videos.length}</span>{" "}
                {videos.length === 1 ? "video" : "videos"}
              </p>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
