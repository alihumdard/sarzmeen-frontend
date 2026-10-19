import { api } from "./client";
import {
  defaultHero,
  defaultSections,
  defaultWhyChoose,
  type HeroBannerSettings,
  type HomepageSettings,
  type SectionVisibility,
  type WhyChooseSettings,
} from "@/lib/homepageSettings";

/**
 * Homepage CMS content, stored in the `homepage` settings group alongside the
 * ticker.
 *
 * These three keys used to live in localStorage, which meant a change was only
 * ever visible in the browser that made it — the public site showed the
 * defaults to everyone else.
 */
type RawHomepage = {
  hero?: Partial<HeroBannerSettings>;
  whyChoose?: Partial<WhyChooseSettings>;
  sections?: SectionVisibility[];
};

/** Merges stored values over the defaults so a partial record still renders. */
function merge(raw: RawHomepage | undefined): HomepageSettings {
  return {
    hero: { ...defaultHero, ...raw?.hero },
    whyChoose: {
      ...defaultWhyChoose,
      ...raw?.whyChoose,
      features: raw?.whyChoose?.features?.length
        ? raw.whyChoose.features
        : defaultWhyChoose.features,
    },
    sections: Array.isArray(raw?.sections) && raw.sections.length
      ? raw.sections
      : defaultSections,
  };
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  try {
    const res = await api<{ data: RawHomepage }>("/site-settings/homepage");
    return merge(res.data);
  } catch {
    // The homepage must still render if settings are unreachable.
    return merge(undefined);
  }
}

export async function saveHomepageSettings(
  settings: HomepageSettings,
): Promise<void> {
  // One key per PUT: the endpoint writes a single setting at a time.
  await Promise.all([
    api("/admin/settings/homepage/hero", {
      method: "PUT",
      body: { value: settings.hero } as unknown as Record<string, unknown>,
    }),
    api("/admin/settings/homepage/whyChoose", {
      method: "PUT",
      body: { value: settings.whyChoose } as unknown as Record<string, unknown>,
    }),
    api("/admin/settings/homepage/sections", {
      method: "PUT",
      body: { value: settings.sections } as unknown as Record<string, unknown>,
    }),
  ]);
}
