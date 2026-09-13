import Image from "next/image";
import Link from "next/link";
import { LocationPinIcon } from "@/components/ui/Icons";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
};

/** Project card used on the home page carousel and the projects listing. */
export default function ProjectCard({ project }: ProjectCardProps) {
  const { slug, name, city, category, image } = project;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-lg">
      {/* Fixed height keeps the frame from collapsing inside the flex column. */}
      <div className="relative h-[145px] shrink-0 overflow-hidden">
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
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-[14px] font-semibold text-heading">
          <Link
            href={`/projects/${slug}`}
            className="transition-colors hover:text-primary"
          >
            {name}
          </Link>
        </h3>

        <p className="mt-1 truncate text-[12px] text-muted">{city}</p>

        <p className="mt-auto flex items-center gap-1.5 border-t border-border pt-3 text-[11px] text-muted">
          <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{category}</span>
        </p>
      </div>
    </article>
  );
}
