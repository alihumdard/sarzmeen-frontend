import Image from "next/image";
import Link from "next/link";
import { LocationPinIcon, VerifiedTickIcon } from "@/components/ui/Icons";
import type { Project } from "@/types/project";

type ProjectListRowProps = {
  project: Project;
};

/** Wide listing row used on the projects search results page. */
export default function ProjectListRow({ project }: ProjectListRowProps) {
  const { slug, name, city, category, image, status, developer, priceFrom, verified, featured } =
    project;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg lg:flex-row">
      <div className="relative h-[200px] shrink-0 overflow-hidden lg:h-auto lg:w-[240px]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 240px, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <Link
          href={`/projects/${slug}`}
          aria-label={name}
          className="absolute inset-0 z-10"
        />

        {featured && (
          <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-white">
            Featured
          </span>
        )}

        <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-heading/85 px-3 py-1 text-[10px] font-semibold text-white">
          {status}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-[16px] font-semibold text-heading">
            <Link
              href={`/projects/${slug}`}
              className="truncate transition-colors hover:text-primary"
            >
              {name}
            </Link>

            {verified && (
              <VerifiedTickIcon
                className="h-4 w-4 shrink-0 text-primary"
                aria-label="Verified project"
              />
            )}
          </h3>

          <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-muted">
            <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{city}</span>
          </p>

          <p className="mt-3 text-[12px] font-medium text-text">
            {category}
          </p>

          <p className="mt-1 text-[11px] text-muted">By {developer}</p>
        </div>

        <div className="flex shrink-0 flex-col items-start justify-center gap-3 border-border sm:w-[190px] sm:border-l sm:pl-5">
          <p className="text-[15px] font-bold text-primary">{priceFrom}</p>

          <Link
            href={`/projects/${slug}`}
            className="flex h-9 w-full items-center justify-center rounded-md border border-primary text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
