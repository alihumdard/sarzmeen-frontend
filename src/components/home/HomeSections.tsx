"use client";

import { useCallback, useEffect, useState } from "react";
import { loadSettings, defaultSections, SETTINGS_CHANGED_EVENT, type SectionVisibility } from "@/lib/homepageSettings";
import BrowsePropertiesByCategory from "@/components/home/BrowsePropertiesByCategory";
import CtaStrip from "@/components/home/CtaStrip";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Hero from "@/components/home/Hero";
import LatestBlogs from "@/components/home/LatestBlogs";
import PartnerAgencies from "@/components/home/PartnerAgencies";
import PopularProjects from "@/components/home/PopularProjects";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseAndCities from "@/components/home/WhyChooseAndCities";

const sectionComponents: Record<string, React.ComponentType> = {
  hero: Hero,
  categories: BrowsePropertiesByCategory,
  featured: FeaturedProperties,
  testimonials: Testimonials,
  agencies: PartnerAgencies,
  projects: PopularProjects,
  whyChoose: WhyChooseAndCities,
  blogs: LatestBlogs,
  cta: CtaStrip,
};

export default function HomeSections() {
  const [sections, setSections] = useState<SectionVisibility[]>(defaultSections);

  const refresh = useCallback(() => {
    setSections(loadSettings().sections);
  }, []);

  useEffect(() => {
    refresh();

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

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
    <>
      {sections
        .filter((s) => s.visible)
        .map((section) => {
          const Component = sectionComponents[section.id];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
    </>
  );
}
