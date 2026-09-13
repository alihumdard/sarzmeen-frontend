import type { Metadata } from "next";
import AboutStats from "@/components/about/AboutStats";
import TeamSection from "@/components/about/TeamSection";
import WhoWeAre from "@/components/about/WhoWeAre";
import WhyChooseSarzameen from "@/components/about/WhyChooseSarzameen";
import PageBanner from "@/components/layout/PageBanner";
import StayUpdatedStrip from "@/components/layout/StayUpdatedStrip";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Sarzameen.com is Pakistan's most trusted real estate platform, committed to simplifying the property journey for buyers, sellers, renters and investors.",
};

export default function AboutPage() {
  return (
    <main>
      <PageBanner
        title="About Sarzameen.com"
        subtitle="Pakistan's most trusted real estate platform"
        description="We are committed to simplifying the property journey for buyers, sellers, renters and investors through transparency, innovation and unmatched expertise."
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        image="/images/interior-1.jpg"
      />

      <WhoWeAre />
      <AboutStats />
      <WhyChooseSarzameen />
      <TeamSection />
      <StayUpdatedStrip theme="dark" background="white" />
    </main>
  );
}
