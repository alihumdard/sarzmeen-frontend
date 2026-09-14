import Image from "next/image";
import {
  ListingsIcon,
  SmartSearchIcon,
  SupportIcon,
  VerifiedTrustIcon,
} from "@/components/ui/Icons";

/** Interior photo shown beside the feature list. */
const FEATURE_IMAGE = "/images/interior-1.jpg";

const features = [
  {
    Icon: ListingsIcon,
    title: "Wide Range of Listings",
    description: "Thousands of properties for every need",
  },
  {
    Icon: VerifiedTrustIcon,
    title: "Verified & Trusted",
    description: "Every listing is verified for your peace of mind",
  },
  {
    Icon: SmartSearchIcon,
    title: "Smart Search Filters",
    description: "Find properties by city, location, price & more",
  },
  {
    Icon: SupportIcon,
    title: "Expert Support",
    description: "Our team is here to help you at every step",
  },
];

export default function WhyChooseUs() {
  return (
    <div className="h-full rounded-lg border-2 border-primary/20 bg-white p-6 sm:p-7">
      <h2 className="text-[22px] font-bold text-heading">
        Why Choose Sarzameen?
      </h2>
      <p className="mt-1.5 text-[12px] text-muted">
        We make property search simple, transparent and reliable.
      </p>

      <div className="mt-7 grid gap-6 sm:grid-cols-2 sm:items-center">
        <ul className="flex flex-col gap-5">
          {features.map(({ Icon, title, description }) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
                <Icon className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-heading">
                  {title}
                </h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="relative h-[250px] overflow-hidden rounded-lg sm:h-[280px]">
          <Image
            src={FEATURE_IMAGE}
            alt="Modern living room interior"
            fill
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
