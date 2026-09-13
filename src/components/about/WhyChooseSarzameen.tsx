import {
  DocumentIcon,
  GearIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  ThumbsUpIcon,
  TrustedAgentIcon,
} from "@/components/ui/Icons";
import { whyChooseUs } from "@/constants/aboutContent";

/** Icons in the same order as the features in the content file. */
const featureIcons = [
  ShieldCheckIcon,
  TrustedAgentIcon,
  DocumentIcon,
  GearIcon,
  HeadsetIcon,
  ThumbsUpIcon,
];

export default function WhyChooseSarzameen() {
  return (
    <section className="bg-white pb-14">
      <div className="container-page">
        <p className="text-center text-[11px] font-bold tracking-[0.12em] text-primary">
          {whyChooseUs.eyebrow}
        </p>

        <h2 className="mt-3 text-center text-[24px] font-bold text-heading sm:text-[28px]">
          {whyChooseUs.heading}
        </h2>

        <ul className="mt-10 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-6">
          {whyChooseUs.features.map((feature, index) => {
            const Icon = featureIcons[index];

            return (
              <li
                key={feature.id}
                className="flex flex-col items-center px-4 text-center lg:border-r lg:border-border lg:last:border-r-0"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Icon className="h-6 w-6" />
                </span>

                <h3 className="mt-4 text-[13px] font-bold text-heading">
                  {feature.title}
                </h3>

                <p className="mt-2 text-[11px] leading-relaxed text-muted">
                  {feature.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
