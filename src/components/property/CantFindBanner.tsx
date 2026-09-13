import Link from "next/link";

/** Closing prompt below the listings for people who did not find a match. */
export default function CantFindBanner() {
  return (
    <section className="bg-surface pb-12">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-lg bg-primary-light px-6 py-7 sm:px-8">
          {/* Faint skyline sitting behind the copy on the right. */}
          <svg
            viewBox="0 0 420 120"
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 bottom-0 -z-10 hidden h-full w-[420px] text-primary/10 lg:block"
            fill="currentColor"
          >
            <rect x="10" y="62" width="34" height="58" />
            <rect x="52" y="40" width="28" height="80" />
            <rect x="88" y="72" width="30" height="48" />
            <rect x="126" y="28" width="32" height="92" />
            <rect x="166" y="58" width="26" height="62" />
            <rect x="200" y="44" width="34" height="76" />
            <rect x="242" y="68" width="28" height="52" />
            <rect x="278" y="34" width="30" height="86" />
            <rect x="316" y="60" width="32" height="60" />
            <rect x="356" y="48" width="28" height="72" />
          </svg>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[19px] font-bold text-heading">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="mt-1.5 text-[12px] text-text">
                Let us help you find the perfect property.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-block shrink-0 self-start rounded-md bg-primary px-6 py-3 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark lg:self-auto"
            >
              Request a Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
