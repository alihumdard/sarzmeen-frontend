import HomeFAQ from "@/components/home/HomeFAQ";
import WhyChooseUs, { getWhyChoose } from "@/components/home/WhyChooseUs";

export default async function WhyChooseAndCities() {
  // The heading and subtitle were hardcoded here, so editing them in the
  // admin Homepage CMS changed nothing on the public page.
  const { heading, subtitle } = await getWhyChoose();

  return (
    <section className="bg-surface py-8 sm:py-12">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-bold text-heading sm:text-[30px]">
              {heading}
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <WhyChooseUs />
          <HomeFAQ />
        </div>
      </div>
    </section>
  );
}
