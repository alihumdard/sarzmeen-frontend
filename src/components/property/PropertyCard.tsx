"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AreaIcon,
  BathIcon,
  BedIcon,
  HeartIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { formatListingPrice } from "@/lib/utils/format";
import type { Property } from "@/types/property";

type PropertyCardProps = {
  property: Property;
};

/**
 * Listing card used on the home page and the property listing pages.
 *
 * The favourite button only holds local state in V1 — saving to an account
 * is out of scope until the API and auth exist.
 */
export default function PropertyCard({ property }: PropertyCardProps) {
  const [saved, setSaved] = useState(false);

  const { slug, title, location, price, area, beds, baths, agent } = property;

  const specs = [
    { Icon: AreaIcon, label: area },
    ...(beds !== null ? [{ Icon: BedIcon, label: `${beds} Beds` }] : []),
    ...(baths !== null ? [{ Icon: BathIcon, label: `${baths} Baths` }] : []),
  ];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
      {/* Image with the two corner badges and the favourite button.
          `shrink-0` keeps the fixed height intact inside the flex column. */}
      <div className="relative h-[200px] shrink-0 overflow-hidden">
        <Image
          src={property.image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 300px, 270px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Click target covering the photo, layered over the image itself. */}
        <Link
          href={`/properties/${slug}`}
          aria-label={title}
          className="absolute inset-0 z-10"
        />

        {/* Badges and the favourite button sit above the link overlay. */}
        {property.featured && (
          <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white">
            Featured
          </span>
        )}

        <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-heading/85 px-3 py-1 text-[11px] font-semibold text-white">
          For Sale
        </span>

        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save property"}
          aria-pressed={saved}
          onClick={() => setSaved(!saved)}
          className={`absolute bottom-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors ${
            saved ? "text-danger" : "text-muted hover:text-danger"
          }`}
        >
          <HeartIcon className="h-4 w-4" filled={saved} />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-[15px] font-semibold text-heading">
          <Link
            href={`/properties/${slug}`}
            className="transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-1.5 truncate text-xs text-muted">{location}</p>

        <p className="mt-2.5 text-[17px] font-bold text-primary">
          {formatListingPrice(price)}
        </p>

        {/* Specs */}
        <ul className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-[11px] font-medium text-text">
          {specs.map(({ Icon, label }) => (
            <li key={label} className="flex min-w-0 items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ul>

        {/* Agent + contact actions. `relative z-20` lifts this above the
            card's full-bleed photo link. */}
        <div className="relative z-20 mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <Link
            href={`/agents/${agent.slug}`}
            className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-light">
              <Image
                src={agent.avatar}
                alt={agent.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-heading">
                {agent.name}
              </p>
              <p className="truncate text-[11px] text-muted">{agent.title}</p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5">
            {agent.phone && (
              <a
                href={`tel:${agent.phone.replace(/\s/g, "")}`}
                aria-label={`Call ${agent.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <PhoneIcon className="h-3.5 w-3.5" />
              </a>
            )}

            {agent.whatsapp && (
              <a
                href={`https://wa.me/${agent.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${agent.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0f8a3e] bg-[#25D366] text-white transition-opacity hover:opacity-90"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
