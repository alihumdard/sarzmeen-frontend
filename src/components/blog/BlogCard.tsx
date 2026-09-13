import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarIcon,
  ReadTimeIcon,
} from "@/components/ui/Icons";
import { formatPostDate } from "@/lib/utils/format";
import type { BlogPost } from "@/types/blog";

type BlogCardProps = {
  post: BlogPost;
  /**
   * "compact" — image, title and meta only (home page carousel).
   * "full" — adds the excerpt, author row and Read More link (blog listing).
   */
  variant?: "compact" | "full";
};

export default function BlogCard({ post, variant = "compact" }: BlogCardProps) {
  const { slug, title, category, excerpt, publishedAt, readTime, image, author } =
    post;

  const isFull = variant === "full";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-lg">
      {/* Fixed height keeps the frame from collapsing inside the flex column. */}
      <div
        className={`relative shrink-0 overflow-hidden ${
          isFull ? "h-[185px]" : "h-[160px]"
        }`}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span className="pointer-events-none absolute left-3 top-3 z-20 rounded bg-primary px-2.5 py-1 text-[10px] font-semibold text-white">
          {category}
        </span>

        <Link
          href={`/blog/${slug}`}
          aria-label={title}
          className="absolute inset-0 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Meta sits above the title on the listing, below it on the carousel. */}
        {isFull && (
          <div className="flex items-center gap-4 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              {formatPostDate(publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <ReadTimeIcon className="h-3.5 w-3.5 shrink-0" />
              {readTime} min read
            </span>
          </div>
        )}

        {/* Two lines are reserved so every card's following row lines up. */}
        <h3
          className={`line-clamp-2 min-h-[38px] text-[14px] font-semibold leading-snug text-heading ${
            isFull ? "mt-3" : ""
          }`}
        >
          <Link
            href={`/blog/${slug}`}
            className="transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </h3>

        {isFull ? (
          <>
            <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted">
              {excerpt}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-heading">
                    {author.name}
                  </p>
                  <p className="truncate text-[10px] text-muted">
                    {author.title}
                  </p>
                </div>
              </div>

              <Link
                href={`/blog/${slug}`}
                className="group/link flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-primary"
              >
                Read More
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              {formatPostDate(publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <ReadTimeIcon className="h-3.5 w-3.5 shrink-0" />
              {readTime} min read
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
