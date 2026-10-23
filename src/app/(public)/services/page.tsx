import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import { CheckIcon } from "@/components/ui/Icons";
import {
  services,
  servicesCta,
  servicesIntro,
  servicesStats,
  type Service,
} from "@/constants/servicesContent";

export const metadata: Metadata = {
  title: "Services — Property Dealing, Payment Plans, SEO & Websites",
  description:
    "Property dealing, payment plan creation, SEO, website development, photography and investment advisory from the Sarzameen team in Lahore.",
};

export default function ServicesPage() {
  const featured = services.filter((service) => service.featured);
  const rest = services.filter((service) => !service.featured);

  return (
    <main>
      <PageBanner
        title="Our Services"
        description="Property dealing, payment plans, marketing and websites — handled by our own team."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      />

      {/* Intro, then the figures, so the page opens with something concrete. */}
      <section className="bg-white pt-10 sm:pt-14">
        <div className="container-page">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {servicesIntro.eyebrow}
            </span>

            <h2 className="mt-4 text-balance text-[26px] font-bold leading-tight text-heading sm:text-[34px]">
              {servicesIntro.heading}
            </h2>

            {servicesIntro.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mx-auto mt-4 max-w-[680px] text-[13.5px] leading-7 text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Hairline grid: gap-px over a border-coloured background. */}
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
            {servicesStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white px-5 py-6 text-center sm:px-6"
              >
                <dt className="text-[20px] font-bold leading-none text-primary sm:text-[24px]">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-[11.5px] leading-5 text-muted">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="container-page">
          {/* The two we lead with, given the width to breathe. */}
          <div className="grid gap-5 lg:grid-cols-2">
            {featured.map((service) => (
              <FeaturedServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {rest.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-white pb-12 sm:pb-16">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-primary-dark)_100%)] px-6 py-9 text-center shadow-[0_14px_40px_rgba(31,122,77,0.28)] sm:px-10 sm:py-11">
            {/* Soft light from the top right, so the panel is not flat green. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            />

            <div className="relative">
              <h2 className="text-balance text-[22px] font-bold text-white sm:text-[28px]">
                {servicesCta.heading}
              </h2>

              <p className="mx-auto mt-3 max-w-[560px] text-[13px] leading-6 text-white/85">
                {servicesCta.description}
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={servicesCta.buttonHref}
                  className="inline-flex h-11 w-full items-center justify-center rounded-md bg-white px-7 text-[13px] font-bold text-primary transition-transform hover:scale-[1.02] sm:w-auto"
                >
                  {servicesCta.buttonLabel}
                </Link>

                <Link
                  href="/properties"
                  className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/35 px-7 text-[13px] font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  Browse properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/** Wide card for the services we lead with. */
function FeaturedServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.icon];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_10px_28px_rgba(31,122,77,0.12)] sm:p-7">
      {/* Green wash in the corner marks these two out from the rest. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary-light opacity-70 transition-opacity duration-200 group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-primary-dark)_100%)] text-white shadow-[0_6px_16px_rgba(31,122,77,0.3)]">
          <Icon />
        </span>

        <div className="min-w-0">
          <h3 className="text-[18px] font-bold leading-snug text-heading sm:text-[19px]">
            {service.title}
          </h3>

          <p className="mt-1.5 text-[13px] leading-6 text-muted">
            {service.summary}
          </p>
        </div>
      </div>

      <ul className="relative mt-5 grid flex-1 content-start gap-2.5 border-t border-border pt-5 sm:grid-cols-2">
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

function ServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.icon];

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_10px_28px_rgba(31,122,77,0.12)]">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        <Icon />
      </span>

      <h3 className="mt-4 text-[15.5px] font-bold leading-snug text-heading">
        {service.title}
      </h3>

      <p className="mt-2 text-[12.5px] leading-6 text-muted">
        {service.summary}
      </p>

      <ul className="mt-4 flex flex-1 flex-col gap-2.5 border-t border-border pt-4">
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-[12px] leading-5 text-text">{point}</span>
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
