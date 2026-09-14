import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import Carousel from "@/components/ui/Carousel";
import { featuredProperties } from "@/constants/mockProperties";

export default function FeaturedProperties() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-bold text-heading sm:text-[30px]">
              Featured Properties
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Handpicked properties by our team
            </p>
          </div>

          <Link
            href="/properties"
            className="rounded-md border-2 border-primary px-5 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View All Properties
          </Link>
        </div>

        <Carousel
          itemCount={featuredProperties.length}
          itemsPerPage={4}
          label="properties"
        >
          {featuredProperties.map((property) => (
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
