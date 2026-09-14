import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";

/**
 * Full-width green band that closes the home page, sitting flush against
 * the footer.
 */
export default function CtaStrip() {
  return (
    <section className="bg-[linear-gradient(110deg,#155c39_0%,#1f7a4d_45%,#22a24c_100%)]">
      <div className="container-page flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div>
          <h2 className="text-[21px] font-bold text-white sm:text-[23px]">
            Ready to find your dream property?
          </h2>
          <p className="mt-1.5 text-[13px] text-white/85">
            Search thousands of listings or connect with our trusted agents
            today.
          </p>
        </div>

        <Link
          href="/properties"
          className="group inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-md bg-white px-7 py-3 text-[13px] font-semibold text-heading shadow-md transition-colors hover:bg-primary-light sm:self-auto"
        >
          Start Searching
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
