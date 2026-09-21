import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/ui/Carousel";
import { LocationPinIcon } from "@/components/ui/Icons";
import { demoAgents, type Agent } from "@/data/agents";

/** Compact logo tile shown in the partner grid — not the full AgentCard. */
function PartnerAgencyCard({ agent }: { agent: Agent }) {
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="flex items-center gap-3.5 rounded-lg border border-border bg-white p-3.5 transition-colors hover:border-primary hover:bg-primary-light/20"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-surface">
        <Image
          src={agent.logo || "/images/agent-1.jpg"}
          alt={agent.name}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[14px] font-bold text-heading">
          {agent.name}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
          <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
          {agent.city}
        </p>
      </div>
    </Link>
  );
}

/**
 * Partner agencies strip — logo grid for the agencies we work with, linking
 * through to their full profile on /agents/[slug]. Reuses the same
 * `demoAgents` dataset the Agents directory pages already use, so adding an
 * agent there automatically makes it eligible to show up here too.
 */
export default function PartnerAgencies() {
  const partners = demoAgents.slice(0, 12);

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-bold text-heading sm:text-[30px]">
              Our Partner Agencies
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Verified agencies we work with across Pakistan
            </p>
          </div>

          <Link
            href="/agents"
            className="rounded-md border-2 border-primary px-5 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View All Agencies
          </Link>
        </div>

        <Carousel
          itemCount={Math.ceil(partners.length / 2)}
          itemsPerPage={4}
          label="partner agencies"
        >
          {Array.from({ length: Math.ceil(partners.length / 2) }).map(
            (_, columnIndex) => {
              const pair = partners.slice(columnIndex * 2, columnIndex * 2 + 2);
              return (
                <div
                  key={columnIndex}
                  className="flex w-[260px] shrink-0 snap-start flex-col gap-3 sm:w-[290px] lg:w-[calc((100%-60px)/4)]"
                >
                  {pair.map((agent) => (
                    <PartnerAgencyCard key={agent.id} agent={agent} />
                  ))}
                </div>
              );
            },
          )}
        </Carousel>
      </div>
    </section>
  );
}
