import Link from "next/link";
import { EyeIcon, TargetIcon } from "@/components/ui/Icons";
import { missionVision, whoWeAre } from "@/constants/aboutContent";

/** Icon per card, keyed by the id in the content file. */
const cardIcons = {
  mission: TargetIcon,
  vision: EyeIcon,
} as const;

export default function WhoWeAre() {
  return (
    <section className="bg-white py-14">
      <div className="container-page grid items-start gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        {/* Copy */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.12em] text-primary">
            {whoWeAre.eyebrow}
          </p>

          <h2 className="mt-3 text-[24px] font-bold leading-snug text-heading sm:text-[26px]">
            {whoWeAre.heading}
          </h2>

          {whoWeAre.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-[13px] leading-relaxed text-text"
            >
              {paragraph}
            </p>
          ))}

          <Link
            href="/contact"
            className="mt-7 inline-block rounded-md bg-primary px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Learn More About Us
          </Link>
        </div>

        {/* Mission / Vision */}
        <div className="grid gap-5 sm:grid-cols-2">
          {missionVision.map((card) => {
            const Icon = cardIcons[card.id as keyof typeof cardIcons];

            return (
              <div
                key={card.id}
                className="rounded-lg border border-border bg-white p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Icon className="h-6 w-6" />
                </span>

                <h3 className="mt-5 text-[17px] font-bold text-heading">
                  {card.title}
                </h3>

                <p className="mt-3 text-[12px] leading-relaxed text-text">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
