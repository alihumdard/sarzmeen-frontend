import { serverApi } from "@/lib/api/server";
import {
  defaultSections,
  type SectionVisibility,
} from "@/lib/homepageSettings";
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

/**
 * Order and visibility come from the `homepage.sections` setting, edited in
 * the admin Homepage CMS.
 *
 * This used to read localStorage from the browser, so hiding a section only
 * affected the machine that hid it — every other visitor still saw it.
 */
async function getSections(): Promise<SectionVisibility[]> {
  try {
    const res = await serverApi<{ data: { sections?: SectionVisibility[] } }>(
      "/site-settings/homepage",
      30,
    );
    const stored = res.data?.sections;
    return Array.isArray(stored) && stored.length ? stored : defaultSections;
  } catch {
    return defaultSections;
  }
}

export default async function HomeSections() {
  const sections = await getSections();

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
