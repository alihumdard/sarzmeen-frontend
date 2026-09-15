import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import Carousel from "@/components/ui/Carousel";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Property } from "@/types/property";

type ProjectPropertiesProps = {
  properties: Property[];
  projectName: string;
};

/**
 * "Properties in this Project" — the actual cross-link between the two
 * models: every card here is a real mock listing whose Property.project
 * matches this project's slug, not a generic "similar" fill list.
 */
export default function ProjectProperties({
  properties,
  projectName,
}: ProjectPropertiesProps) {
  if (properties.length === 0) return null;

  return (
    <section className="bg-surface py-12">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold text-heading">
              Properties in {projectName}
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              Individual listings currently for sale inside this project
            </p>
          </div>

          <Link
            href="/properties"
            className="group flex items-center gap-1.5 text-[12px] font-semibold text-primary"
          >
            View All Properties
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Carousel
          itemCount={properties.length}
          itemsPerPage={4}
          label="properties in this project"
          showDots={false}
        >
          {properties.map((property) => (
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
