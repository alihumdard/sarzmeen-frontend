import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import type { Video } from "@/types/video";

/** One video in the library grid. */
export default function VideoCard({ video }: { video: Video }) {
  const summary = video.description
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <Link
      href={`/guides/${video.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-[0_6px_20px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-video overflow-hidden bg-surface">
        <SafeImage
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fallbackText="No thumbnail"
        />

        {/* Play badge, so a still reads as a video rather than a photo. */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <svg
              className="ml-0.5 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>

        {video.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-heading transition-colors group-hover:text-primary">
          {video.title}
        </h3>

        {summary && (
          /* Plain text: the description is HTML, and a clamped preview
             should not carry its markup. */
          <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-muted">
            {summary}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-muted">
          {video.publishedAt && (
            <time dateTime={video.publishedAt}>
              {new Date(video.publishedAt).toLocaleDateString("en-US", {
                month: "short",
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
        </div>
      </div>
    </Link>
  );
}
