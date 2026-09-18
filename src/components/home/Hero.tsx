import Image from "next/image";
import HeroSearch from "@/components/home/HeroSearch";
import {
  ShieldCheckIcon,
  TrustedAgentIcon,
  VerifiedBadgeIcon,
} from "@/components/ui/Icons";

/** Hero background photo — replace the file at this path to change it. */
const heroBackground = "/images/hero-bg.jpg";

export default function Hero() {
  return (
    <section className="relative isolate">
      {/* Background photo container with overflow-hidden */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src={heroBackground}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Moderate wash for text contrast, heaviest on the left. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(9,25,20,0.76)_0%,rgba(9,25,20,0.55)_55%,rgba(9,25,20,0.32)_100%)]" />

      <div className="container-page pb-10 pt-10 sm:pt-14 lg:pt-16">
        {/* Heading row + trust badge */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-light ring-1 ring-white/20">
              Pakistan&apos;s Trusted Property Marketplace
            </span>

            <h1 className="mt-4 text-[32px] font-bold leading-[1.15] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] sm:text-[40px] lg:text-[46px]">
              Find Your Perfect
              <br />
              Property in <span className="text-[#3DBB6E]">Pakistan</span>
            </h1>

            <p className="mt-3.5 max-w-[440px] text-[15px] leading-relaxed text-white/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
              Explore verified properties for sale in all major cities of
              Pakistan.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/15">
                <VerifiedBadgeIcon className="h-4 w-4 text-[#3DBB6E]" />
                10K+ Properties
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/15">
                <TrustedAgentIcon className="h-4 w-4 text-[#3DBB6E]" />
                8K+ Happy Clients
              </span>
            </div>
          </div>

          <div className="flex w-full items-center gap-3.5 rounded-xl border border-white/15 bg-white/10 px-6 py-4 backdrop-blur-md lg:w-auto lg:shrink-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <ShieldCheckIcon className="h-6 w-6 text-[#3DBB6E]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Trusted by Thousands
              </p>
              <p className="text-[12px] text-white/70">
                100% Verified Listings
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 lg:mt-9">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
