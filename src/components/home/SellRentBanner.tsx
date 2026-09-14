import Image from "next/image";
import Link from "next/link";
import {
  AgentStatIcon,
  HomeStatIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  SmileStatIcon,
} from "@/components/ui/Icons";

/** Reuses the hero photo so no extra asset is needed for this banner. */
const BANNER_IMAGE = "/images/hero-bg.jpg";

const stats = [
  { Icon: HomeStatIcon, value: "10K+", label: "Properties Listed" },
  { Icon: SmileStatIcon, value: "5K+", label: "Satisfied Clients" },
  { Icon: AgentStatIcon, value: "2K+", label: "Trusted Agents" },
  { Icon: ShieldCheckIcon, value: "100%", label: "Secure Process" },
];

export default function SellRentBanner() {
  return (
    <section className="bg-white pb-4 sm:pb-6">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-xl">
          <Image
            src={BANNER_IMAGE}
            alt=""
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-20 object-cover"
          />

          {/* Dark wash — the copy sits on the left, so it is heaviest there. */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(10,32,26,0.94)_0%,rgba(10,32,26,0.88)_45%,rgba(10,32,26,0.72)_100%)]" />

          <div className="grid items-center gap-6 p-6 sm:p-7 lg:grid-cols-[1fr_1.15fr] lg:gap-8 lg:p-8">
            {/* Copy */}
            <div>
              <h2 className="text-[22px] font-bold leading-snug text-white sm:text-[25px]">
                Want to Sell Your Property?
              </h2>

              <p className="mt-2.5 max-w-[360px] text-[13px] leading-relaxed text-white/80">
                Join thousands of successful agents and list your property on
                Sarzameen.com today.
              </p>

              <Link
                href="/properties/add"
                className="mt-4 inline-flex items-center gap-2.5 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Add Your Property
                <PlusCircleIcon className="h-[18px] w-[18px]" />
              </Link>
            </div>

            {/* Stats */}
            <div className="rounded-lg border border-white/15 bg-white/[0.07] px-5 py-4 backdrop-blur-sm sm:px-6">
              <dl className="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
                {stats.map(({ Icon, value, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center"
                  >
                    <Icon className="h-6 w-6 text-[#3DBB6E]" />
                    <dd className="mt-1.5 text-[20px] font-bold text-white">
                      {value}
                    </dd>
                    <dt className="mt-0.5 text-[11px] leading-snug text-white/70">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
