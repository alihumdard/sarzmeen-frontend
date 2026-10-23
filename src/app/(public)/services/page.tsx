import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import {
  CameraIcon,
  ChartIcon,
  CheckIcon,
  DocumentIcon,
  GlobeIcon,
  HandshakeIcon,
  SmartSearchIcon,
} from "@/components/ui/Icons";
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
  return (
    <main>
      <PageBanner
        title="Our Services"
        description="Property dealing, payment plans, marketing and websites — handled by our own team."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      />

      {/* Intro beside the figures, rather than centred above them. */}
      <section className="bg-white py-10 sm:py-14">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {servicesIntro.eyebrow}
              </span>

              <h2 className="mt-4 text-balance text-[26px] font-bold leading-[1.2] text-heading sm:text-[34px]">
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

            {/* Hairline grid: gap-px over a border-coloured background. */}
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {servicesStats.map((stat) => (
                <div key={stat.label} className="bg-surface px-5 py-7 sm:px-6">
                  <dt className="text-[22px] font-bold leading-none text-primary sm:text-[26px]">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-[11.5px] leading-5 text-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Each service as a numbered row, read top to bottom. */}
      <section className="bg-surface py-10 sm:py-14">
        <div className="container-page">
          <div className="flex flex-col">
            {services.map((service, index) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={index}
                isLast={index === services.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-surface pb-12 sm:pb-16">
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

/**
 * One service, as a numbered step. Every panel stays on the same side so
 * 01 to 06 reads as a single run down the page.
 */
function ServiceRow({
  service,
  index,
  isLast,
}: {
  service: Service;
  index: number;
  isLast: boolean;
}) {
  const Icon = icons[service.icon];

  const step = String(index + 1).padStart(2, "0");

  return (
    <div className="relative grid lg:grid-cols-[64px_1fr]">
      {/* Numbered spine, so the six rows read as one sequence. */}
      <div className="relative hidden justify-center lg:flex">
        <span className="absolute top-7 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-white font-mono text-[12px] font-bold text-primary">
          {step}
        </span>

        {/* The line linking this step to the next one. */}
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute bottom-0 top-7 w-px bg-border"
          />
        )}
      </div>

      <article className="group mb-5 grid overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(31,122,77,0.12)] lg:grid-cols-[300px_1fr]">
      {/* Icon panel */}
      <div
        className="relative flex items-center gap-4 overflow-hidden bg-[linear-gradient(145deg,var(--color-primary)_0%,var(--color-primary-dark)_100%)] px-6 py-6 lg:flex-col lg:items-start lg:justify-center lg:gap-5 lg:px-8 lg:py-10"
      >
        {/* Faint circles, so the panel has some depth behind the icon. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/[0.07]"
        />

        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105 lg:h-16 lg:w-16">
          <Icon className="h-7 w-7 lg:h-8 lg:w-8" />
        </span>

        <div className="relative min-w-0">
          {/* The spine carries the number on desktop; show it here when
              the spine is hidden at narrow widths. */}
          <span className="block font-mono text-[11px] font-bold tracking-widest text-white/60 lg:hidden">
            {step}
          </span>
          <h3 className="mt-1 text-[17px] font-bold leading-snug text-white lg:mt-0 lg:text-[19px]">
            {service.title}
          </h3>
        </div>
      </div>

      {/* Detail */}
      <div className="min-w-0 px-6 py-6 sm:px-7 sm:py-7">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
          {service.outcome}
        </p>

        <p className="mt-3 text-[13.5px] leading-7 text-muted">
          {service.summary}
        </p>

        <ul className="mt-5 grid gap-x-6 gap-y-2.5 border-t border-border pt-5 sm:grid-cols-2">
          {service.points.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-light">
                <CheckIcon className="h-3 w-3 text-primary" />
              </span>
              <span className="text-[12.5px] leading-5 text-text">{point}</span>
            </li>
          ))}
        </ul>
        </div>
      </article>
    </div>
  );
}

/* Drawn in the shared icon library, so they match the rest of the site. */
const icons: Record<
  Service["icon"],
  React.ComponentType<{ className?: string }>
> = {
  handshake: HandshakeIcon,
  document: DocumentIcon,
  search: SmartSearchIcon,
  globe: GlobeIcon,
  camera: CameraIcon,
  chart: ChartIcon,
};
