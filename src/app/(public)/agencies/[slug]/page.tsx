import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "@/components/layout/PageBanner";
import {
  AwardIcon,
  BuildingIcon,
  CalendarIcon,
  CheckIcon,
  EnvelopeIcon,
  LocationPinIcon,
  PhoneIcon,
  UsersIcon,
  VerifiedTickIcon,
} from "@/components/ui/Icons";
import { serverApi } from "@/lib/api/server";

type AgencyData = {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  city: string | null;
  address: string | null;
  description: string | null;
  agencyType: string | null;
  establishedYear: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  verified: boolean;
  totalAgents: number;
  locations: string[];
  services: string[];
  owner: {
    name: string;
    title: string;
    avatar: string | null;
    phone: string | null;
    email: string | null;
  };
  propertiesForSale: number;
  propertiesForRent: number;
  agents?: Array<{
    id: string;
    slug: string;
    name: string;
    title: string | null;
    avatar: string | null;
    phone: string | null;
  }>;
};

type AgencyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: AgencyPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await serverApi<{ data: AgencyData }>(`/agencies/${slug}`);
    return { title: res.data.name, description: res.data.description || undefined };
  } catch {
    return { title: "Agency Not Found" };
  }
}

export default async function AgencyPage({ params }: AgencyPageProps) {
  const { slug } = await params;

  let agency: AgencyData;
  try {
    const res = await serverApi<{ data: AgencyData }>(`/agencies/${slug}`);
    agency = res.data;
  } catch {
    notFound();
  }

  const totalListings = agency.propertiesForSale + agency.propertiesForRent;
  const yearsActive = agency.establishedYear
    ? new Date().getFullYear() - agency.establishedYear
    : null;

  const stats = [
    { Icon: UsersIcon, value: agency.totalAgents, label: "Team Members" },
    { Icon: BuildingIcon, value: totalListings, label: "Active Listings" },
    ...(yearsActive !== null
      ? [{ Icon: AwardIcon, value: `${yearsActive}+`, label: "Years Active" }]
      : []),
  ];

  const contactRows = [
    agency.phone ? { Icon: PhoneIcon, label: "Phone", value: agency.phone, href: `tel:${agency.phone.replace(/\s/g, "")}` } : null,
    agency.email ? { Icon: EnvelopeIcon, label: "Email", value: agency.email, href: `mailto:${agency.email}` } : null,
    agency.address ? { Icon: LocationPinIcon, label: "Office", value: agency.address } : null,
    agency.establishedYear ? { Icon: CalendarIcon, label: "Established", value: String(agency.establishedYear) } : null,
  ].filter(Boolean) as Array<{ Icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }>;

  return (
    <main>
      <PageBanner
        title={agency.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Agencies", href: "/agencies" },
          { label: agency.name },
        ]}
        image="/images/agents-banner.jpg"
      />

      <section className="bg-surface py-8 sm:py-10">
        <div className="container-page">
          <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Agency profile */}
            <div className="rounded-lg border border-border bg-white p-6">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-light">
                  {agency.logo ? (
                    <Image src={agency.logo} alt={agency.name} fill sizes="96px" className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary-light text-[28px] font-bold text-primary">
                      {agency.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="flex items-center justify-center gap-2 text-[20px] font-bold text-heading sm:justify-start">
                    {agency.name}
                    {agency.verified && (
                      <VerifiedTickIcon className="h-5 w-5 shrink-0 text-primary" aria-label="Verified agency" />
                    )}
                  </h1>
                  <p className="mt-1 text-[13px] font-medium text-primary">
                    {agency.agencyType || "Real Estate Agency"}
                    {agency.city && <> • {agency.city}</>}
                  </p>

                  {agency.locations.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                      {agency.locations.map((location) => (
                        <span key={location} className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-medium text-primary">
                          {location}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {agency.description && (
                <p className="mt-5 border-t border-border pt-5 text-[13px] leading-relaxed text-text">
                  {agency.description}
                </p>
              )}

              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
                {stats.map(({ Icon, value, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-3 sm:text-left">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[18px] font-bold text-heading">{value}</p>
                      <p className="text-[11px] text-muted">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner and contact */}
            <div className="flex flex-col gap-6">
              {agency.owner && (
                <div className="rounded-lg border border-border bg-white p-6">
                  <h2 className="text-[15px] font-bold text-heading">Agency Owner</h2>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-light">
                      {agency.owner.avatar ? (
                        <Image src={agency.owner.avatar} alt={agency.owner.name} fill sizes="64px" className="object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary-light text-[20px] font-bold text-primary">
                          {agency.owner.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-heading">{agency.owner.name}</p>
                      <p className="text-[12px] font-medium text-primary">{agency.owner.title}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {agency.owner.phone && (
                      <a
                        href={`tel:${agency.owner.phone.replace(/\s/g, "")}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
                      >
                        <PhoneIcon className="h-4 w-4" />
                        Call Owner
                      </a>
                    )}
                    {agency.owner.email && (
                      <a
                        href={`mailto:${agency.owner.email}`}
                        aria-label={`Email ${agency.owner.name}`}
                        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-border text-text transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {contactRows.length > 0 && (
                <div className="rounded-lg border border-border bg-white p-6">
                  <h2 className="text-[15px] font-bold text-heading">Contact Details</h2>
                  <dl className="mt-4 flex flex-col gap-3.5">
                    {contactRows.map(({ Icon, label, value, href }) => (
                      <div key={label} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
                          <dd className="text-[13px] font-medium text-heading">
                            {href ? (
                              <a href={href} className="transition-colors hover:text-primary">{value}</a>
                            ) : (
                              value
                            )}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>

                  {agency.website && (
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block rounded-md border border-border py-2.5 text-center text-[13px] font-semibold text-primary transition-colors hover:border-primary hover:bg-primary-light"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          {agency.services && agency.services.length > 0 && (
            <div className="mt-6 rounded-lg border border-border bg-white p-6">
              <h2 className="text-[15px] font-bold text-heading">Services &amp; Specialization</h2>
              <div className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {agency.services.map((service) => (
                  <p key={service} className="flex items-center gap-2 text-[13px] text-text">
                    <CheckIcon className="h-4 w-4 shrink-0 text-primary" />
                    {service}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Team */}
      {agency.agents && agency.agents.length > 0 && (
        <section className="bg-white py-10">
          <div className="container-page">
            <h2 className="text-[22px] font-bold text-heading">
              Our Team
              <span className="ml-2 text-[14px] font-medium text-muted">
                ({agency.agents.length} {agency.agents.length === 1 ? "member" : "members"})
              </span>
            </h2>
            <p className="mt-1 text-[13px] text-muted">Agents working under {agency.name}</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {agency.agents.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-border bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <Link href={`/agents/${member.slug}`} className="block">
                    <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary-light">
                      {member.avatar ? (
                        <Image src={member.avatar} alt={member.name} fill sizes="80px" className="object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary-light text-[22px] font-bold text-primary">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-[14px] font-bold text-heading">{member.name}</p>
                    <p className="text-[12px] text-muted">{member.title || "Agent"}</p>
                  </Link>

                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s/g, "")}`}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary-light px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      <PhoneIcon className="h-3.5 w-3.5" />
                      Call
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
