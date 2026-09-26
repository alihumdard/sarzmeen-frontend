import Image from "next/image";
import Link from "next/link";
import {
  LocationPinIcon,
  PhoneIcon,
  UsersIcon,
  VerifiedTickIcon,
} from "@/components/ui/Icons";
import type { Agency } from "@/types/agency";

type AgencyCardProps = {
  agency: Agency;
};

/** Listing card used on the agencies page. */
export default function AgencyCard({ agency }: AgencyCardProps) {
  const phoneClean = agency.phone.replace(/\s/g, "");

  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div>
        {/* Logo + name + verified badge */}
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white">
            <Image
              src={agency.logo}
              alt={agency.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/agencies/${agency.slug}`}
                className="text-[16px] font-bold text-heading transition-colors hover:text-primary"
              >
                {agency.name}
              </Link>

              {agency.verified && (
                <span className="flex shrink-0 items-center gap-1 rounded bg-primary-light px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <VerifiedTickIcon className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[12px] font-medium text-muted">
              {agency.agencyType} •{" "}
              <span className="font-semibold text-heading">{agency.city}</span>
            </p>
          </div>
        </div>

        {/* Headline stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-md bg-primary-light px-2 py-2 text-center">
            <p className="text-[15px] font-bold text-primary">
              {agency.totalAgents}
            </p>
            <p className="text-[11px] font-medium text-primary/80">Agents</p>
          </div>
          <div className="rounded-md bg-surface px-2 py-2 text-center">
            <p className="text-[15px] font-bold text-heading">
              {agency.propertiesForSale}
            </p>
            <p className="text-[11px] font-medium text-muted">For Sale</p>
          </div>
          <div className="rounded-md bg-surface px-2 py-2 text-center">
            <p className="text-[15px] font-bold text-heading">
              {agency.propertiesForRent}
            </p>
            <p className="text-[11px] font-medium text-muted">For Rent</p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-text">
          {agency.description}
        </p>

        {/* Owner — the person who runs the agency. */}
        <div className="mt-3 flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <Image
              src={agency.owner.avatar}
              alt={agency.owner.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-heading">
              {agency.owner.name}
            </p>
            <p className="truncate text-[11px] text-muted">
              {agency.owner.title}
            </p>
          </div>
        </div>

        {agency.locations.length > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
            <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{agency.locations.join(", ")}</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${phoneClean}`}
            aria-label={`Call ${agency.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
          >
            <PhoneIcon className="h-4 w-4" />
          </a>

          <span className="flex items-center gap-1.5 text-[11px] text-muted">
            <UsersIcon className="h-3.5 w-3.5" />
            {agency.totalAgents} agents
          </span>
        </div>

        <Link
          href={`/agencies/${agency.slug}`}
          className="group flex items-center gap-1.5 rounded-md bg-primary-light px-4 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          View Agency
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
