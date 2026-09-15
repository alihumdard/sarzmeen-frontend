import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";

/**
 * Closing prompt below the listings for people who did not find a match.
 * Matches the homepage CTA strip's green gradient band for consistency.
 */
export default function CantFindBanner() {
  return (
    <section className="bg-[linear-gradient(110deg,#155c39_0%,#1f7a4d_45%,#22a24c_100%)]">
      <div className="container-page flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div>
          <h2 className="text-[21px] font-bold text-white sm:text-[23px]">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="mt-1.5 text-[13px] text-white/85">
            Let us help you find the perfect property — our team is ready to
            assist.
          </p>
        </div>

        <Link
          href="/contact"
          className="group inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-md bg-white px-7 py-3 text-[13px] font-semibold text-heading shadow-md transition-colors hover:bg-primary-light sm:self-auto"
        >
          Request a Free Consultation
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
