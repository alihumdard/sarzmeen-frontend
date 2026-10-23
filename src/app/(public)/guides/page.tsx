import type { Metadata } from "next";
import PageBanner from "@/components/layout/PageBanner";
import VideoCard from "@/components/guides/VideoCard";
import { serverApi } from "@/lib/api/server";
import type { Video } from "@/types/video";

export const metadata: Metadata = {
  title: "Video Guides — How to Use Sarzameen.com",
  description:
    "Step-by-step video guides: how to list a property, manage your listings, build a payment plan and get the most out of Sarzameen.com.",
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
        title="Video Guides"
        description="Short videos showing you how to use Sarzameen.com, step by step."
        crumbs={[{ label: "Home", href: "/" }, { label: "Video Guides" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      />

      <section className="bg-surface py-10">
        <div className="container-page">
          {videos.length === 0 ? (
            <p className="rounded-xl border border-border bg-white py-16 text-center text-[13px] text-muted">
              No guides have been published yet.
            </p>
          ) : (
            <>
              <p className="mb-5 text-[13px] text-muted">
                <span className="font-bold text-heading">{videos.length}</span>{" "}
                {videos.length === 1 ? "guide" : "guides"}
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
