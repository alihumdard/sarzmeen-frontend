import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarIcon,
  ReadTimeIcon,
} from "@/components/ui/Icons";
import { formatPostDate } from "@/lib/utils/format";
import type { BlogPost } from "@/types/blog";

type BlogListRowProps = {
  post: BlogPost;
};

/** Horizontal blog row used when the listing is switched to list view. */
export default function BlogListRow({ post }: BlogListRowProps) {
  const { slug, title, category, excerpt, publishedAt, readTime, image, author } =
    post;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-lg sm:flex-row">
      <div className="relative h-[180px] shrink-0 overflow-hidden sm:h-auto sm:w-[240px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 640px) 240px, 100vw"
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

      <div className="flex flex-1 flex-col p-4 sm:p-5">
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

        <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-heading">
          <Link
            href={`/blog/${slug}`}
            className="transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted">
          {excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
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
              <p className="truncate text-[10px] text-muted">{author.title}</p>
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
      </div>
    </article>
  );
}
