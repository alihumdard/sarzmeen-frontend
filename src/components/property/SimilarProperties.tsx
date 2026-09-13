import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import Carousel from "@/components/ui/Carousel";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Property } from "@/types/property";

type SimilarPropertiesProps = {
  properties: Property[];
  /** Slug of the property being viewed, so it is left out of the list. */
  currentSlug: string;
};

export default function SimilarProperties({
  properties,
  currentSlug,
}: SimilarPropertiesProps) {
  const similar = properties.filter(
    (property) => property.slug !== currentSlug,
  );

  if (similar.length === 0) return null;

  return (
    <section className="bg-white pb-12">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[17px] font-bold text-heading">
            Similar Properties You May Like
          </h2>

          <Link
            href="/properties"
            className="group flex items-center gap-1.5 text-[12px] font-semibold text-primary"
          >
            View All Properties
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Carousel
          itemCount={similar.length}
          itemsPerPage={5}
          label="similar properties"
          showDots={false}
        >
          {similar.map((property) => (
            <div
              key={property.id}
              className="w-[240px] shrink-0 snap-start lg:w-[calc((100%-80px)/5)]"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
