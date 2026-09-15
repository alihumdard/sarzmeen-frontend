import type { Metadata } from "next";
import Image from "next/image";
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
import { getAgentBySlug } from "@/lib/utils/getAgent";

type AgentPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getAgentBySlug(slug);

  if (!result) return { title: "Agent Not Found" };

  return {
    title: result.agent.name,
    description: `View properties listed by ${result.agent.name} on Sarzameen.com.`,
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const result = getAgentBySlug(slug);

  if (!result) notFound();

  const { agent, ownListings, listings } = result;

  const stats = [
    {
      Icon: AwardIcon,
      value: `${agent.yearsExperience ?? 5}+`,
      label: "Years Experience",
    },
    {
      Icon: HandshakeIcon,
      value: `${agent.dealsClosed ?? 100}+`,
      label: "Deals Closed",
    },
    {
      Icon: VerifiedTickIcon,
      value: ownListings.length,
      label: ownListings.length === 1 ? "Active Listing" : "Active Listings",
    },
  ];

  return (
    <main>
      <PageBanner
        title={agent.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: agent.name },
        ]}
      />

      <section className="bg-surface py-8 sm:py-10">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Profile, bio and stats */}
            <div className="rounded-lg border border-border bg-white p-6">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-light">
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="flex items-center justify-center gap-2 text-[20px] font-bold text-heading sm:justify-start">
                    {agent.name}
                    {agent.verified && (
                      <VerifiedTickIcon
                        className="h-5 w-5 shrink-0 text-primary"
                        aria-label="Verified agent"
                      />
                    )}
                  </h1>
                  <p className="mt-1 text-[13px] font-medium text-primary">
                    {agent.title} at Sarzameen.com
                  </p>

                  {agent.specializations && agent.specializations.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                      {agent.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-medium text-primary"
                        >
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

              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
                {stats.map(({ Icon, value, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[18px] font-bold text-heading">
                        {value}
                      </p>
                      <p className="text-[11px] text-muted">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company & contact details */}
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-[15px] font-bold text-heading">
                Company &amp; Contact
              </h2>

              <div className="mt-4 flex items-center gap-3 rounded-md bg-surface p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-primary">
                  <BuildingIcon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-heading">
                    Sarzameen.com
                  </p>
                  <p className="text-[11px] text-muted">
                    Lahore&apos;s Trusted Real Estate Platform
                  </p>
                </div>
              </div>

              <dl className="mt-4 flex flex-col gap-3.5 text-[13px]">
                {agent.email && (
                  <div className="flex items-start gap-2.5">
                    <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <dt className="text-[11px] text-muted">Email</dt>
                      <dd className="truncate font-medium text-heading">
                        {agent.email}
                      </dd>
                    </div>
                  </div>
                )}

                {agent.officeAddress && (
                  <div className="flex items-start gap-2.5">
                    <LocationPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <dt className="text-[11px] text-muted">Office</dt>
                      <dd className="font-medium text-heading">
                        {agent.officeAddress}
                      </dd>
                    </div>
                  </div>
                )}

                {agent.languages && agent.languages.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <TargetIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <dt className="text-[11px] text-muted">Languages</dt>
                      <dd className="font-medium text-heading">
                        {agent.languages.join(", ")}
                      </dd>
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

                {agent.whatsapp && (
                  <a
                    href={`https://wa.me/${agent.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-[19px] font-bold text-heading">
            Listings by {agent.name}
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {listings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
