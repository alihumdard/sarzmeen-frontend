import Image from "next/image";
import HeroSearch from "@/components/home/HeroSearch";
import {
  EasySecureIcon,
  ShieldCheckIcon,
  TrustedAgentIcon,
  VerifiedBadgeIcon,
} from "@/components/ui/Icons";

/** Hero background photo — replace the file at this path to change it. */
const heroBackground = "/images/hero-bg.jpg";

const trustItems = [
  {
    Icon: VerifiedBadgeIcon,
    title: "Verified Properties",
    description: "Only verified & trusted listings",
  },
  {
    Icon: TrustedAgentIcon,
    title: "Trusted Agents",
    description: "Connect with genuine agents",
  },
  {
    Icon: EasySecureIcon,
    title: "Easy & Secure",
    description: "Simple and secure process",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Best Investment",
    description: "Find the best deals",
  },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background photo — see heroBackground above to swap the file. */}
      <Image
        src={heroBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />

      {/* Dark overlay so the white heading and search card stay readable
          whatever photo is used behind them. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,25,20,0.72)_0%,rgba(10,25,20,0.58)_45%,rgba(10,25,20,0.75)_100%)]" />

      <div className="container-page pb-8 pt-8 sm:pt-10">
        <h1 className="text-center text-[28px] font-bold leading-tight text-white sm:text-[36px] lg:text-[42px]">
          Find Your Perfect Property
          <br />
          in <span className="text-[#3DBB6E]">Pakistan</span>
        </h1>

        <p className="mx-auto mt-3 max-w-[520px] text-center text-sm leading-relaxed text-white/85 sm:text-[15px]">
          Discover the best real estate properties for sale and rent in all
          major cities of Pakistan.
        </p>

        <div className="mt-6">
          <HeroSearch />
        </div>

        {/* Trust strip */}
        <div className="mt-6 rounded-lg border border-white/15 bg-white/10 px-5 py-5 backdrop-blur-sm sm:px-8">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ Icon, title, description }) => (
              <li key={title} className="flex items-center gap-3">
                <Icon className="h-7 w-7 shrink-0 text-[#3DBB6E]" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-white">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/70">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
