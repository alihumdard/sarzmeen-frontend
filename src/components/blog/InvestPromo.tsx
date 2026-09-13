import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, InvestIcon } from "@/components/ui/Icons";

/** Promo photo. Reuses the property image so no extra asset is needed. */
const PROMO_IMAGE = "/images/property-1.jpg";

/**
 * Sidebar promo card pushing readers from the blog to the property listings.
 */
export default function InvestPromo() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
            <InvestIcon className="h-5 w-5" />
          </span>

          <h2 className="text-[15px] font-bold leading-snug text-heading">
            Looking to Invest
            <br />
            in Property?
          </h2>
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-muted">
          Explore the best opportunities with expert guidance.
        </p>

        <Link
          href="/properties"
          className="group mt-5 inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2.5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Browse Properties
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="relative h-[140px]">
        <Image
          src={PROMO_IMAGE}
          alt=""
          fill
          sizes="(min-width: 1024px) 250px, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
