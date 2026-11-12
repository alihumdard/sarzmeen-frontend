import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "@/components/layout/PageBanner";
import { iconFor } from "@/components/services/serviceIcons";
import { CheckIcon } from "@/components/ui/Icons";
import { servicesCta } from "@/constants/servicesContent";
import { getPublicService, getPublicServices } from "@/lib/api/services";
import { SUMMARY_HERO_LIMIT } from "@/types/service";

type Params = { params: Promise<{ slug: string }> };

/**
 * What the banner shows of a summary, cut at a word so the line does not
 * end mid-word. A summary only a little over the limit keeps its last
 * whole word rather than losing half of one.
 */
function heroSummary(summary: string): string {
  if (summary.length <= SUMMARY_HERO_LIMIT) return summary;

  const cut = summary.slice(0, SUMMARY_HERO_LIMIT);
  const lastSpace = cut.lastIndexOf(" ");

  /* A single word longer than the limit has no space to cut at. */
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicService(slug);

  if (!service) {
    return { title: "Service not found" };
  }

  return {
    title: `${service.title} — Sarzameen.com`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = await getPublicService(slug);

  if (!service) notFound();

  const Icon = iconFor(service.icon);

  /*
   * The other services, for the run at the foot of the page. A failed fetch
   * drops that section rather than taking the whole page down with it.
   */
  const others = (await getPublicServices().catch(() => []))
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  return (
    <main>
      <PageBanner
        title={service.title}
        /*
         * Clipped: this sits over a photograph, and a summary typed long
         * enough filled the banner and buried the image behind it. The
         * whole text still reads in full below.
         */
        description={heroSummary(service.summary)}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      />

      <section className="bg-white py-10 sm:py-14">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
            {/* What the service is, and what it includes. */}
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                {service.outcome}
              </span>

              {/*
                The description comes from the rich-text editor as HTML,
                cleaned server-side against the listing allow-list. A
                service written before the editor holds plain text, and
                one with no description at all falls back to its summary;
                both still read as paragraphs.

                break-words and max-w-full on the children: this is typed
                by hand, and one long unbroken string — a pasted URL — used
                to take the whole page sideways on a phone.
              */}
              {service.description?.trim() ? (
                <div
                  className="mt-5 min-w-0 max-w-none break-words text-[14px] leading-7 text-muted [&_*]:max-w-full [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-6 [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:text-heading [&_h3]:mt-5 [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:text-heading [&_hr]:my-6 [&_hr]:border-border [&_img]:mt-4 [&_img]:rounded-lg [&_li]:mt-1 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-4 [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-surface [&_pre]:p-3 [&_strong]:text-heading [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              ) : (
                service.summary.split(/\n\s*\n/).map((paragraph, i) => (
                  <p
                    key={i}
                    className="mt-5 whitespace-pre-line break-words text-[14px] leading-7 text-muted"
                  >
                    {paragraph.trim()}
                  </p>
                ))
              )}

              <h2 className="mt-9 text-[19px] font-bold text-heading">
                What you get
              </h2>

              <ul className="mt-4 grid gap-3">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3.5"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light">
                      <CheckIcon className="h-3 w-3 text-primary" />
                    </span>
                    <span className="text-[13px] leading-6 text-text">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/services"
                className="mt-8 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-primary transition-colors hover:text-primary-dark"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                All services
              </Link>
            </div>

            {/* Enquiry panel, kept beside the detail on a wide screen. */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                <div className="relative flex items-center gap-4 overflow-hidden bg-[linear-gradient(145deg,var(--color-primary)_0%,var(--color-primary-dark)_100%)] px-6 py-6">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10"
                  />
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-inset ring-white/25">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h2 className="relative text-[16px] font-bold leading-snug text-white">
                    {service.title}
                  </h2>
                </div>

                <div className="px-6 py-6">
                  <p className="text-[12.5px] leading-6 text-muted">
                    {servicesCta.description}
                  </p>

                  <Link
                    href={servicesCta.buttonHref}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    {servicesCta.buttonLabel}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-surface py-10 sm:py-14">
          <div className="container-page">
            <h2 className="text-[19px] font-bold text-heading">
              Other services
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => {
                const OtherIcon = iconFor(other.icon);

                return (
                  <Link
                    key={other.id}
                    href={`/services/${other.slug}`}
                    className="group min-w-0 rounded-2xl border border-border bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(31,122,77,0.12)]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <OtherIcon className="h-5 w-5" />
                    </span>

                    <h3 className="mt-4 text-[14px] font-bold leading-snug text-heading">
                      {other.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-[12.5px] leading-6 text-muted">
                      {other.summary}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
