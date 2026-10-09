const STORAGE_KEY = "sarzameen-homepage-settings";

export type HeroBannerSettings = {
  tagline: string;
  heading: string;
  headingHighlight: string;
  description: string;
  backgroundImage: string;
  trustBadgeTitle: string;
  trustBadgeSubtitle: string;
};

export type WhyChooseFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type WhyChooseSettings = {
  heading: string;
  subtitle: string;
  image: string;
  features: WhyChooseFeature[];
};

export type TickerItem = {
  id: string;
  label: string;
  href: string;
};

export type TickerSettings = {
  enabled: boolean;
  label: string;
  /** Seconds for one full scroll of the track. */
  speed: number;
  items: TickerItem[];
};

export const defaultTicker: TickerSettings = {
  enabled: true,
  label: "Latest News",
  speed: 45,
  items: [],
};

export type HomepageSettings = {
  hero: HeroBannerSettings;
  whyChoose: WhyChooseSettings;
  sections: SectionVisibility[];
};

export type SectionVisibility = {
  id: string;
  name: string;
  description: string;
  type: string;
  visible: boolean;
};

export const defaultHero: HeroBannerSettings = {
  tagline: "Pakistan's Trusted Property Marketplace",
  heading: "Find Your Perfect\nProperty in",
  headingHighlight: "Pakistan",
  description: "From skyline penthouses to family homes — explore verified properties for sale in all major cities of Pakistan.",
  backgroundImage: "/images/hero-home.png",
  trustBadgeTitle: "Trusted by Thousands",
  trustBadgeSubtitle: "100% Verified Listings",
};

export const defaultWhyChoose: WhyChooseSettings = {
  heading: "Why Choose Sarzameen?",
  subtitle: "We make property search simple, transparent and reliable.",
  image: "/images/interior-1.jpg",
  features: [
    { id: "1", title: "Wide Range of Listings", description: "Thousands of properties for every need", icon: "listings" },
    { id: "2", title: "Verified & Trusted", description: "Every listing is verified for your peace of mind", icon: "verified" },
    { id: "3", title: "Smart Search Filters", description: "Find properties by city, location, price & more", icon: "search" },
    { id: "4", title: "Expert Support", description: "Our team is here to help you at every step", icon: "support" },
  ],
};

export const defaultSections: SectionVisibility[] = [
  { id: "hero", name: "Hero Banner", description: "Main banner with search", type: "Banner", visible: true },
  { id: "categories", name: "Browse by Category", description: "Property category cards", type: "Properties", visible: true },
  { id: "featured", name: "Featured Properties", description: "Showcase latest properties", type: "Properties", visible: true },
  { id: "testimonials", name: "Testimonials", description: "Client reviews and feedback", type: "Testimonials", visible: true },
  { id: "agencies", name: "Partner Agencies", description: "Verified partner agencies", type: "Content", visible: true },
  { id: "projects", name: "Popular Projects", description: "Featured real estate projects", type: "Projects", visible: true },
  { id: "whyChoose", name: "Why Choose & Cities", description: "Platform highlights and city search", type: "Content", visible: true },
  { id: "blogs", name: "Latest Blogs", description: "Recent articles and news", type: "Blogs", visible: true },
  { id: "cta", name: "CTA Strip", description: "Call to action banner", type: "CTA", visible: true },
];

export function loadSettings(): HomepageSettings {
  if (typeof window === "undefined") {
    return { hero: defaultHero, whyChoose: defaultWhyChoose, sections: defaultSections };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        hero: { ...defaultHero, ...parsed.hero },
        whyChoose: { ...defaultWhyChoose, ...parsed.whyChoose, features: parsed.whyChoose?.features || defaultWhyChoose.features },
        sections: parsed.sections || defaultSections,
      };
    }
  } catch {}
  return { hero: defaultHero, whyChoose: defaultWhyChoose, sections: defaultSections };
}

export const SETTINGS_CHANGED_EVENT = "sarzameen-settings-changed";

export function saveSettings(settings: HomepageSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEY + "-ts", new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
  } catch {}
}

export function getLastSaved(): string | null {
  try { return localStorage.getItem(STORAGE_KEY + "-ts"); } catch { return null; }
}
