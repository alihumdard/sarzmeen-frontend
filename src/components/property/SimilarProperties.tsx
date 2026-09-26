import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import Carousel from "@/components/ui/Carousel";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Property } from "@/types/property";

type SimilarPropertiesProps = {
  properties: Property[];
  /** Slug of the property being viewed, so it is left out of the list. */
  currentSlug: string;
  /** Section heading — overridden on the rent detail page. */
  title?: string;
  /** Where "View All" points; defaults to the sale listing page. */
  viewAllHref?: string;
  viewAllLabel?: string;
};

export default function SimilarProperties({
  properties,
  currentSlug,
  title = "Similar Properties You May Like",
  viewAllHref = "/properties",
  viewAllLabel = "View All Properties",
}: SimilarPropertiesProps) {
  const similar = properties.filter(
    (property) => property.slug !== currentSlug,
  );

  if (similar.length === 0) return null;

  return (
    <section className="bg-surface py-12">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold text-heading">
              {title}
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              Other listings that match this property&apos;s price and location
            </p>
          </div>

          <Link
            href={viewAllHref}
            className="group flex items-center gap-1.5 text-[12px] font-semibold text-primary"
          >
            {viewAllLabel}
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Carousel
          itemCount={similar.length}
          itemsPerPage={4}
          label="similar properties"
          showDots={false}
        >
          {similar.map((property) => (
            <div
              key={property.id}
              className="w-[270px] shrink-0 snap-start sm:w-[300px] lg:w-[calc((100%-60px)/4)]"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
