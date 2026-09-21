import BrowsePropertiesByCategory from "@/components/home/BrowsePropertiesByCategory";
import CtaStrip from "@/components/home/CtaStrip";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Hero from "@/components/home/Hero";
import LatestBlogs from "@/components/home/LatestBlogs";
import PartnerAgencies from "@/components/home/PartnerAgencies";
import PopularProjects from "@/components/home/PopularProjects";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseAndCities from "@/components/home/WhyChooseAndCities";

export default function Home() {
  return (
    <main>
      <Hero />
      <BrowsePropertiesByCategory />
      <FeaturedProperties />
      <Testimonials />
      <PartnerAgencies />
      <PopularProjects />
      <WhyChooseAndCities />
      <LatestBlogs />
      <CtaStrip />
    </main>
  );
}
