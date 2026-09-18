import BrowsePropertiesByCategory from "@/components/home/BrowsePropertiesByCategory";
import CtaStrip from "@/components/home/CtaStrip";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Hero from "@/components/home/Hero";
import LatestBlogs from "@/components/home/LatestBlogs";
import PopularProjects from "@/components/home/PopularProjects";
import SellRentBanner from "@/components/home/SellRentBanner";
import WhyChooseAndCities from "@/components/home/WhyChooseAndCities";

export default function Home() {
  return (
    <main>
      <Hero />
      <BrowsePropertiesByCategory />
      <FeaturedProperties />
      <SellRentBanner />
      <PopularProjects />
      <WhyChooseAndCities />
      <LatestBlogs />
      <CtaStrip />
    </main>
  );
}
