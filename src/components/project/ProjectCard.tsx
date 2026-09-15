import Image from "next/image";
import Link from "next/link";
import { LocationPinIcon, VerifiedTickIcon } from "@/components/ui/Icons";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
};

/** Project card used on the home page carousel and the projects listing. */
export default function ProjectCard({ project }: ProjectCardProps) {
  const { slug, name, city, category, image, status, priceFrom, verified, featured } =
    project;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
      {/* Fixed height keeps the frame from collapsing inside the flex column. */}
      <div className="relative h-[160px] shrink-0 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 300px, 270px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <Link
          href={`/projects/${slug}`}
          aria-label={name}
          className="absolute inset-0 z-10"
        />

        {featured && (
          <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white">
            Featured
          </span>
        )}

        <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-heading/85 px-3 py-1 text-[11px] font-semibold text-white">
          {status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="flex items-center gap-1.5 truncate text-[15px] font-semibold text-heading">
          <Link
            href={`/projects/${slug}`}
            className="truncate transition-colors hover:text-primary"
          >
            {name}
          </Link>

          {verified && (
            <VerifiedTickIcon
              className="h-3.5 w-3.5 shrink-0 text-primary"
              aria-label="Verified project"
            />
          )}
        </h3>

        <p className="mt-1.5 truncate text-xs text-muted">{city}</p>

        <p className="mt-2.5 truncate text-[14px] font-bold text-primary">
          {priceFrom}
        </p>

        <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-[11px] text-muted">
          <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{category}</span>
        </p>
      </div>
    </article>
  );
}
