import Image from "next/image";
import {
  ListingsIcon,
  SmartSearchIcon,
  SupportIcon,
  VerifiedTrustIcon,
} from "@/components/ui/Icons";
import { serverApi } from "@/lib/api/server";
import { defaultWhyChoose, type WhyChooseSettings } from "@/lib/homepageSettings";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  listings: ListingsIcon,
  verified: VerifiedTrustIcon,
  search: SmartSearchIcon,
  support: SupportIcon,
};

/** Content comes from the `homepage.whyChoose` setting (admin Homepage CMS). */
export async function getWhyChoose(): Promise<WhyChooseSettings> {
  try {
    const res = await serverApi<{
      data: { whyChoose?: Partial<WhyChooseSettings> };
    }>("/site-settings/homepage", 30);
    const stored = res.data?.whyChoose;
    return {
      ...defaultWhyChoose,
      ...stored,
      features: stored?.features?.length
        ? stored.features
        : defaultWhyChoose.features,
    };
  } catch {
    return defaultWhyChoose;
  }
}

export default async function WhyChooseUs() {
  const settings = await getWhyChoose();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Image */}
      <div className="relative h-[200px] sm:h-[220px]">
        <Image
          src={settings.image}
          alt="Why choose Sarzameen"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white">
            Trusted Platform
          </span>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-2 gap-px bg-gray-100">
        {settings.features.map((feature) => {
          const Icon = iconMap[feature.icon] || ListingsIcon;
          return (
            <div
              key={feature.id}
              className="flex items-start gap-3 bg-white p-4 transition-colors hover:bg-gray-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-heading leading-tight">
                  {feature.title}
                </h3>
                <p className="mt-0.5 text-[11px] leading-snug text-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
