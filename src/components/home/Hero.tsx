import Image from "next/image";
import HeroSearch from "@/components/home/HeroSearch";
import { LocationPinIcon, ShieldCheckIcon } from "@/components/ui/Icons";

/** Hero background photo — replace the file at this path to change it. */
const heroBackground = "/images/hero-home.png";

/**
 * Landmark pins positioned directly over the skyline photo, roughly above
 * each building's peak (percentages of the hero section's box). Tuned for
 * the current hero-home.png — re-check these if the photo is ever swapped.
 */
const heroLandmarkPins = [
  { label: "Badshahi Mosque", left: "52%", top: "34%" },
  { label: "Minar-e-Pakistan", left: "70%", top: "22%" },
] as const;

export default function Hero() {
  return (
    <section className="relative isolate">
      {/* Background photo container with overflow-hidden */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <Image
          src={heroBackground}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Light left-to-right wash — just enough for the heading to sit cleanly on the bright sky. */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(100deg,rgba(6,17,13,0.6)_0%,rgba(6,17,13,0.4)_45%,rgba(6,17,13,0.12)_75%,rgba(6,17,13,0.3)_100%)]" />

      {/* Light top-to-bottom wash so the search bar clears the road below. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,17,13,0.15)_0%,rgba(6,17,13,0)_30%,rgba(6,17,13,0.05)_60%,rgba(6,17,13,0.45)_100%)]" />

      {/* Landmark map-pins over the mosque and tower in the photo. Hidden
          below xl — at narrower widths the heading column takes up too much
          of the section's width and the pins end up crowding the text. */}
      <div className="absolute inset-0 z-0 hidden xl:block">
        {heroLandmarkPins.map((pin) => (
          <div
            key={pin.label}
            className="absolute flex -translate-x-1/2 flex-col items-center"
            style={{ left: pin.left, top: pin.top }}
          >
            <LocationPinIcon className="h-5 w-5 text-[#3DBB6E] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" />
            <span className="mt-1 h-6 w-px bg-white/70" />
            <span className="mt-1 whitespace-nowrap text-[12px] font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8),0_1px_8px_rgba(0,0,0,0.6)]">
              {pin.label}
            </span>
          </div>
        ))}
      </div>

      <div className="container-page pb-10 pt-10 sm:pt-14 lg:pt-16">
        {/* Heading row + trust badge */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="motion-safe:animate-[fade-in-up_0.6s_ease_forwards] inline-flex items-center gap-2 rounded-full bg-black/35 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-light ring-1 ring-white/20 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DBB6E] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3DBB6E]" />
              </span>
              Pakistan&apos;s Trusted Property Marketplace
            </span>

            <h1 className="motion-safe:animate-[fade-in-up_0.6s_ease_0.08s_forwards] motion-safe:opacity-0 mt-4 text-[32px] font-bold leading-[1.15] text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.85),0_4px_24px_rgba(0,0,0,0.6)] sm:text-[40px] lg:text-[46px]">
              Find Your Perfect
              <br />
              Property in <span className="text-[#3DBB6E]">Pakistan</span>
            </h1>

            <p className="motion-safe:animate-[fade-in-up_0.6s_ease_0.16s_forwards] motion-safe:opacity-0 mt-3.5 max-w-[440px] text-[15px] leading-relaxed text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7),0_2px_10px_rgba(0,0,0,0.5)]">
              From skyline penthouses to family homes — explore verified
              properties for sale in all major cities of Pakistan.
            </p>
          </div>

          <div className="motion-safe:animate-[fade-in-up_0.6s_ease_0.24s_forwards] motion-safe:opacity-0 flex w-full items-center gap-3.5 rounded-xl border border-white/20 bg-black/25 px-6 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-md lg:w-auto lg:shrink-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/30 ring-1 ring-[#3DBB6E]/40">
              <ShieldCheckIcon className="h-6 w-6 text-[#3DBB6E]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
                Trusted by Thousands
              </p>
              <p className="text-[12px] text-white/80">
                100% Verified Listings
              </p>
            </div>
          </div>
        </div>

        <div className="motion-safe:animate-[fade-in-up_0.6s_ease_0.32s_forwards] motion-safe:opacity-0 relative mt-10 lg:mt-14">
          {/* Soft ambient glow behind the search card so it lifts off the photo. */}
          <div className="absolute -inset-x-4 -inset-y-6 -z-10 bg-primary/25 blur-3xl" />
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
