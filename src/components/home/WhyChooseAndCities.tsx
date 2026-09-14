import SearchByCity from "@/components/home/SearchByCity";
import WhyChooseUs from "@/components/home/WhyChooseUs";

/**
 * Pairs the two panels that sit side by side below the projects carousel.
 * They stack on narrow screens.
 */
export default function WhyChooseAndCities() {
  return (
    <section className="bg-surface pb-6 sm:pb-8">
      <div className="container-page grid items-stretch gap-8 lg:grid-cols-2">
        <WhyChooseUs />
        <SearchByCity />
      </div>
    </section>
  );
}
