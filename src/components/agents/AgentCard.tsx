import Image from "next/image";
import Link from "next/link";
import { Agent } from "@/data/agents";
import {
  EnvelopeIcon,
  PhoneIcon,
  VerifiedTickIcon,
} from "@/components/ui/Icons";

type AgentCardProps = {
  agent: Agent;
};

export default function AgentCard({ agent }: AgentCardProps) {
  const phoneClean = agent.phone.replace(/\s/g, "");

  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div>
        {/* Top Header: Logo + Name & Verification + Agency Type */}
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
            <Image
              src={agent.logo}
              alt={agent.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/agents/${agent.slug}`}
                className="text-[16px] font-bold text-heading transition-colors hover:text-primary"
              >
                {agent.name}
              </Link>

              {agent.verified && (
                <span className="flex shrink-0 items-center gap-1 rounded bg-primary-light px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <VerifiedTickIcon className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[12px] font-medium text-muted">
              {agent.agencyType || "Authorized Agency"} • <span className="text-heading font-semibold">{agent.city}</span>
            </p>
          </div>
        </div>

        {/* Property counts */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-primary-light px-3 py-2 text-center">
            <p className="text-[15px] font-bold text-primary">
              {agent.propertiesForSale}
            </p>
            <p className="text-[11px] font-medium text-primary/80">For Sale</p>
          </div>
          <div className="rounded-md bg-surface px-3 py-2 text-center">
            <p className="text-[15px] font-bold text-heading">
              {agent.propertiesForRent}
            </p>
            <p className="text-[11px] font-medium text-muted">For Rent</p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-text">
          {agent.description}
        </p>

        {/* Locations */}
        {agent.locations && agent.locations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {agent.locations.slice(0, 3).map((loc) => (
              <span
                key={loc}
                className="rounded bg-surface px-2 py-0.5 text-[11px] text-muted"
              >
                {loc}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          {agent.email && (
            <a
              href={`mailto:${agent.email}`}
              aria-label={`Email ${agent.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
            >
              <EnvelopeIcon className="h-4 w-4" />
            </a>
          )}

          <a
            href={`tel:${phoneClean}`}
            aria-label={`Call ${agent.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
          >
            <PhoneIcon className="h-4 w-4" />
          </a>
        </div>

        <Link
          href={`/agents/${agent.slug}`}
          className="group flex items-center gap-1.5 rounded-md bg-primary-light px-4 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          View Profile
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
