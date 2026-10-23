import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DetailBreadcrumb from "@/components/property/DetailBreadcrumb";
import SafeImage from "@/components/ui/SafeImage";
import { serverApi } from "@/lib/api/server";
import type { Video } from "@/types/video";

type Params = Promise<{ slug: string }>;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function getVideo(slug: string): Promise<Video | null> {
  try {
    const res = await serverApi<{ data: Video }>(`/videos/${slug}`, 30);
    return res.data;
  } catch {
    return null;
  }
}

async function getRelated(slug: string): Promise<Video[]> {
  try {
    const res = await serverApi<{ data: Video[] }>(
      `/videos/${slug}/related`,
      60,
    );
    return res.data;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);

  if (!video) return { title: "Guide not found" };

  return {
    title: video.metaTitle || video.title,
    description:
      video.metaDescription ||
      // Strip the editor's markup; a meta tag takes plain text only.
      stripHtml(video.description).slice(0, 160) ||
      undefined,
  };
}

export default async function VideoPage({ params }: { params: Params }) {
  const { slug } = await params;

  const [video, related] = await Promise.all([
    getVideo(slug),
    getRelated(slug),
  ]);

  if (!video) notFound();

  return (
    <main>
      <DetailBreadcrumb
        backHref="/guides"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Video Guides", href: "/guides" },
          { label: video.title },
        ]}
      />

      <section className="bg-surface py-8">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {/*
              A 16:9 box with the iframe filling it, so the player keeps its
              shape at every width instead of letterboxing.
            */}
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-5 rounded-xl border border-border bg-white p-5 sm:p-6">
              <h1 className="text-[20px] font-bold leading-snug text-heading sm:text-[24px]">
                {video.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-muted">
                {video.publishedAt && (
                  <time dateTime={video.publishedAt}>
                    {new Date(video.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                )}
                <span>
                  {video.views.toLocaleString()}{" "}
                  {video.views === 1 ? "view" : "views"}
                </span>
                <a
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Watch on YouTube
                </a>
              </div>

              {video.description && (
                /* Written in the admin's rich text editor, so it arrives
                   as HTML and is rendered the way a blog post is. */
                <div
                  className="blog-content mt-5 border-t border-border pt-5"
                  dangerouslySetInnerHTML={{ __html: video.description }}
                />
              )}
            </div>
          </div>

          <aside className="min-w-0">
            <div className="rounded-xl border border-border bg-white p-5">
              <h2 className="text-[14px] font-bold text-heading">
                More guides
              </h2>

              {related.length === 0 ? (
                <p className="mt-3 text-[12px] text-muted">
                  Nothing else published yet.
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-3">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/guides/${item.slug}`}
                        className="group flex gap-3"
                      >
                        <div className="relative h-[52px] w-[88px] shrink-0 overflow-hidden rounded-md bg-surface">
                          <SafeImage
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            sizes="88px"
                            className="object-cover"
                            fallbackText="—"
                          />
                        </div>

                        <span className="min-w-0 text-[12px] font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
                          <span className="line-clamp-2">{item.title}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href="/guides"
                className="mt-4 block rounded-md border border-primary py-2 text-center text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                View all guides
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
