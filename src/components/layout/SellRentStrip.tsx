import Image from "next/image";
import Link from "next/link";
import { PlusCircleIcon } from "@/components/ui/Icons";

/** Reuses the hero photo so no extra asset is needed for this strip. */
const BANNER_IMAGE = "/images/hero-bg.jpg";

/**
 * Compact "list your property" band used at the foot of the inner pages.
 * The home page uses the taller variant that also carries stats.
 */
export default function SellRentStrip() {
  return (
    <section className="bg-white pb-12">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-lg">
          <Image
            src={BANNER_IMAGE}
            alt=""
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-20 object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(10,32,26,0.95)_0%,rgba(10,32,26,0.88)_48%,rgba(10,32,26,0.68)_100%)]" />

          <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[19px] font-bold text-white">
                Want to Sell or Rent Your Property?
              </h2>
              <p className="mt-1.5 text-[12px] text-white/80">
                Join thousands of successful agents and list your property on
                Sarzameen.com
              </p>
            </div>

            <Link
              href="/properties/add"
              className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-md bg-white px-6 py-3 text-[12px] font-semibold text-heading transition-colors hover:bg-primary-light lg:self-auto"
            >
              Add Your Property
              <PlusCircleIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
