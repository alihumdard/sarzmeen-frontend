import SafeImage from "@/components/ui/SafeImage";

export type ProfileVideo = {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  embedUrl: string;
  thumbnail: string;
};

/**
 * The videos an agent or agency has put on their own page.
 *
 * These never appear in the site's video library, so this is the only
 * place they are seen.
 *
 * The first plays in place; the rest are thumbnails that open on YouTube.
 * Embedding every one would load an iframe per video before anybody asked
 * for it, which on a phone is the whole page's weight spent on videos
 * nobody has clicked.
 */
export default function ProfileVideos({
  videos,
  heading,
}: {
  videos: ProfileVideo[];
  heading: string;
}) {
  if (videos.length === 0) return null;

  const [first, ...rest] = videos;

  return (
    <section className="bg-white pt-9 pb-12">
      <div className="container-page">
        <h2 className="text-[19px] font-bold text-heading">{heading}</h2>
        <p className="mt-1 text-[13px] text-muted">
          {videos.length === 1 ? "1 video" : `${videos.length} videos`}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={first.embedUrl}
                title={first.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <h3 className="mt-3 text-[14px] font-semibold text-heading">
              {first.title}
            </h3>
            {first.description && (
              <p className="mt-1 break-words text-[12.5px] leading-relaxed text-muted">
                {first.description}
              </p>
            )}
          </div>

          {rest.length > 0 && (
            <ul className="flex flex-col gap-3">
              {rest.map((video) => (
                <li key={video.id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border p-2.5 transition-colors hover:border-primary/40"
                  >
                    <span className="relative h-[54px] w-24 shrink-0 overflow-hidden rounded bg-surface">
                      <SafeImage
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                        unoptimized
                        fallbackText=""
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[12.5px] font-medium text-heading">
                        {video.title}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
