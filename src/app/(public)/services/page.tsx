import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import { CheckIcon } from "@/components/ui/Icons";
import {
  services,
  servicesCta,
  servicesIntro,
  type Service,
} from "@/constants/servicesContent";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Property dealing, payment plan creation, SEO, website development, photography and investment advisory from the Sarzameen team.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageBanner
        title="Our Services"
        description="Property dealing, payment plans, marketing and websites — handled by our own team."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      />

      {/* Intro */}
      <section className="bg-white py-10 sm:py-14">
        <div className="container-page max-w-[760px] text-center">
          <p className="text-[12px] font-bold uppercase tracking-wide text-primary">
            {servicesIntro.eyebrow}
          </p>

          <h2 className="mt-2 text-[24px] font-bold leading-tight text-heading sm:text-[30px]">
            {servicesIntro.heading}
          </h2>

          {servicesIntro.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-[13.5px] leading-7 text-muted"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* The services themselves */}
      <section className="bg-surface py-10 sm:py-14">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-white py-10 sm:py-14">
        <div className="container-page">
          <div className="rounded-2xl bg-primary px-6 py-9 text-center sm:px-10">
            <h2 className="text-[20px] font-bold text-white sm:text-[24px]">
              {servicesCta.heading}
            </h2>

            <p className="mx-auto mt-2 max-w-[560px] text-[13px] leading-6 text-white/85">
              {servicesCta.description}
            </p>

            <Link
              href={servicesCta.buttonHref}
              className="mt-6 inline-flex h-11 items-center rounded-md bg-white px-7 text-[13px] font-bold text-primary transition-opacity hover:opacity-90"
            >
              {servicesCta.buttonLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.icon];

  return (
    <article className="flex flex-col rounded-xl border border-border bg-white p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-light text-primary">
        <Icon />
      </span>

      <h3 className="mt-4 text-[16px] font-bold text-heading">
        {service.title}
      </h3>

      <p className="mt-2 text-[13px] leading-6 text-muted">{service.summary}</p>

      <ul className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-[12.5px] leading-5 text-text">{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* Line icons, drawn inline so the page carries no extra dependency. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<Service["icon"], () => React.ReactElement> = {
  handshake: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M11 17 8.5 14.5a2 2 0 0 1 0-2.8l4-4a2 2 0 0 1 2.8 0L19 11.4" />
      <path d="m13 19 2 2 6-6-4-4" />
      <path d="M3 10.5 7 6.5l3 3" />
    </svg>
  ),
  calculator: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3" />
    </svg>
  ),
  search: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  ),
  globe: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </svg>
  ),
  camera: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  ),
  chart: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  ),
};
