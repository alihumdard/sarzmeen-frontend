import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";

/**
 * Compact "list your property" band used at the foot of the inner pages,
 * styled to match the site's other CTA strips (home page, listing page).
 */
export default function SellRentStrip() {
  return (
    <section className="bg-[linear-gradient(110deg,#155c39_0%,#1f7a4d_45%,#22a24c_100%)]">
      <div className="container-page flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div>
          <h2 className="text-[19px] font-bold text-white sm:text-[21px]">
            Want to Sell Your Property?
          </h2>
          <p className="mt-1.5 text-[13px] text-white/85">
            Join thousands of successful agents and list your property on
            Sarzameen.com
          </p>
        </div>

        <Link
          href="/properties/add"
          className="group inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-md bg-white px-6 py-3 text-[13px] font-semibold text-heading shadow-md transition-colors hover:bg-primary-light sm:self-auto"
        >
          Add Your Property
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
