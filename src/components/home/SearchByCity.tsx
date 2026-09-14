import Image from "next/image";
import Link from "next/link";
import { popularCities } from "@/constants/mockProjects";

export default function SearchByCity() {
  return (
    <div className="h-full rounded-lg border-2 border-primary/20 bg-white p-6 sm:p-7">
      <h2 className="text-[22px] font-bold text-heading">
        Property Search by City
      </h2>
      <p className="mt-1.5 text-[12px] text-muted">
        Find properties in top cities of Pakistan
      </p>

      <ul className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {popularCities.map((city) => (
          <li key={city.id}>
            <Link
              href={`/properties?city=${city.slug}`}
              className="group relative block h-[105px] overflow-hidden rounded-md"
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                sizes="(min-width: 1024px) 175px, (min-width: 640px) 30vw, 45vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Bottom-weighted wash so the labels stay readable. */}
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,20,0.05)_35%,rgba(10,25,20,0.82)_100%)]" />

              <span className="absolute inset-x-0 bottom-0 p-3">
                <span className="block truncate text-[13px] font-semibold text-white">
                  {city.name}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-white/80">
                  {city.propertyCount}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/locations"
        className="mt-6 block rounded-md border-2 border-primary py-2.5 text-center text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
      >
        View All Cities
      </Link>
    </div>
  );
}
