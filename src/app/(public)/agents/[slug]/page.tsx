import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "@/components/layout/PageBanner";
import PropertyCard from "@/components/property/PropertyCard";
import {
  AwardIcon,
  BuildingIcon,
  EnvelopeIcon,
  HandshakeIcon,
  LocationPinIcon,
  PhoneIcon,
  TargetIcon,
  VerifiedTickIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { serverApi } from "@/lib/api/server";
import type { AgentDetail } from "@/lib/api/agents";
import type { Property } from "@/types/property";

type AgentPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const agent = await serverApi<{ data: AgentDetail }>(`/agents/${slug}`);
    return {
      title: agent.data.name,
      description: `View properties listed by ${agent.data.name} on Sarzameen.com.`,
    };
  } catch {
    return { title: "Agent Not Found" };
  }
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;

  let agent: AgentDetail;
  try {
    const res = await serverApi<{ data: AgentDetail }>(`/agents/${slug}`);
    agent = res.data;
  } catch {
    notFound();
  }

  let listings: Property[] = [];
  try {
    const res = await serverApi<{ data: Property[] }>(`/properties?agent=${slug}&per_page=8`);
    listings = res.data;
  } catch {}

  const stats = [
    {
      Icon: AwardIcon,
      value: `${agent.yearsExperience ?? 0}+`,
      label: "Years Experience",
    },
    {
      Icon: HandshakeIcon,
      value: `${agent.dealsClosed ?? 0}+`,
      label: "Deals Closed",
    },
    {
      Icon: VerifiedTickIcon,
      value: agent.propertiesForSale + agent.propertiesForRent,
      label: "Active Listings",
    },
  ];

  return (
    <main>
      <PageBanner
        title={agent.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Agents", href: "/agents" },
          { label: agent.name },
        ]}
        image="/images/agents-banner.jpg"
      />

      <section className="bg-surface py-8 sm:py-10">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Profile, bio and stats */}
            <div className="rounded-lg border border-border bg-white p-6">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-light">
                  {agent.avatar ? (
                    <Image src={agent.avatar} alt={agent.name} fill sizes="96px" className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary-light text-[28px] font-bold text-primary">
                      {agent.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="flex items-center justify-center gap-2 text-[20px] font-bold text-heading sm:justify-start">
                    {agent.name}
                    {agent.verified && (
                      <VerifiedTickIcon className="h-5 w-5 shrink-0 text-primary" aria-label="Verified agent" />
                    )}
                  </h1>
                  <p className="mt-1 text-[13px] font-medium text-primary">
                    {agent.title || "Real Estate Agent"}
                    {agent.agency && <> at {agent.agency.name}</>}
                  </p>

                  {agent.specializations && agent.specializations.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                      {agent.specializations.map((spec) => (
                        <span key={spec} className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-medium text-primary">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {agent.bio && (
                <p className="mt-5 border-t border-border pt-5 text-[13px] leading-relaxed text-text">
                  {agent.bio}
                </p>
              )}

              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
                {stats.map(({ Icon, value, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
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

            {/* Contact details */}
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-[15px] font-bold text-heading">Contact Information</h2>

              {agent.agency && (
                <Link
                  href={`/agencies/${agent.agency.slug}`}
                  className="mt-4 flex items-center gap-3 rounded-md bg-surface p-3 transition-colors hover:bg-surface/80"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-primary">
                    <BuildingIcon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-heading">{agent.agency.name}</p>
                    <p className="text-[11px] text-muted">View Agency Profile</p>
                  </div>
                </Link>
              )}

              <dl className="mt-4 flex flex-col gap-3.5 text-[13px]">
                {agent.email && (
                  <div className="flex items-start gap-2.5">
                    <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <dt className="text-[11px] text-muted">Email</dt>
                      <dd className="truncate font-medium text-heading">{agent.email}</dd>
                    </div>
                  </div>
                )}
                {agent.officeAddress && (
                  <div className="flex items-start gap-2.5">
                    <LocationPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <dt className="text-[11px] text-muted">Office</dt>
                      <dd className="font-medium text-heading">{agent.officeAddress}</dd>
                    </div>
                  </div>
                )}
                {agent.languages && agent.languages.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <TargetIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <dt className="text-[11px] text-muted">Languages</dt>
                      <dd className="font-medium text-heading">{agent.languages.join(", ")}</dd>
                    </div>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5">
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone.replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-2 rounded-md border border-primary py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    {agent.phone}
                  </a>
                )}
                {agent.phone && (
                  <a
                    href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-md border border-[#0f8a3e] bg-[#25D366] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>

          {listings.length > 0 && (
            <>
              <h2 className="mt-8 text-[19px] font-bold text-heading">
                Listings by {agent.name}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {listings.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
