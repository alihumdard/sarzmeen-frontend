import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import Carousel from "@/components/ui/Carousel";
import { serverApi } from "@/lib/api/server";
import type { Property } from "@/types/property";

export default async function FeaturedProperties() {
  let properties: Property[] = [];

  try {
    const res = await serverApi<{ data: Property[] }>(
      "/properties?featured=1&per_page=8",
    );
    properties = res.data;
  } catch {
    return null;
  }

  if (properties.length === 0) return null;

  return (
    <section className="bg-white pt-2 pb-10 sm:pt-4 sm:pb-12">
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
          itemCount={properties.length}
          itemsPerPage={4}
          label="properties"
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
