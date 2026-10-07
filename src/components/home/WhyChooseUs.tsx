"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  ListingsIcon,
  SmartSearchIcon,
  SupportIcon,
  VerifiedTrustIcon,
} from "@/components/ui/Icons";
import { loadSettings, defaultWhyChoose, SETTINGS_CHANGED_EVENT, type WhyChooseSettings } from "@/lib/homepageSettings";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  listings: ListingsIcon,
  verified: VerifiedTrustIcon,
  search: SmartSearchIcon,
  support: SupportIcon,
};

export default function WhyChooseUs() {
  const [settings, setSettings] = useState<WhyChooseSettings>(defaultWhyChoose);

  const refresh = useCallback(() => {
    setSettings(loadSettings().whyChoose);
  }, []);

  useEffect(() => {
    refresh();
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener(SETTINGS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener(SETTINGS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return (
    <div className="h-full rounded-lg border-2 border-primary/20 bg-white p-6 sm:p-7">
      <h2 className="text-[22px] font-bold text-heading">
        {settings.heading}
      </h2>
      <p className="mt-1.5 text-[12px] text-muted">
        {settings.subtitle}
      </p>

      <div className="mt-7 grid gap-6 sm:grid-cols-2 sm:items-center">
        <ul className="flex flex-col gap-5">
          {settings.features.map((feature) => {
            const Icon = iconMap[feature.icon] || ListingsIcon;
            return (
              <li key={feature.id} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-heading">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="relative h-[250px] overflow-hidden rounded-lg sm:h-[280px]">
          <Image
            src={settings.image}
            alt="Feature showcase"
            fill
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
