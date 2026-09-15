"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AreaIcon,
  BathIcon,
  BedIcon,
  HeartIcon,
  LocationPinIcon,
  PhoneIcon,
  VerifiedTickIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { formatListingPrice } from "@/lib/utils/format";
import type { Property } from "@/types/property";

type PropertyListRowProps = {
  property: Property;
};

/**
 * Wide listing row used on the properties search results page: photo on the
 * left, details in the middle, price and agent actions on the right.
 */
export default function PropertyListRow({ property }: PropertyListRowProps) {
  const [saved, setSaved] = useState(false);

  const {
    slug,
    title,
    location,
    price,
    area,
    beds,
    baths,
    image,
    featured,
    verified,
    listedAgo,
    description,
    features,
    agent,
  } = property;

  const specs = [
    { Icon: AreaIcon, label: area },
    ...(beds !== null ? [{ Icon: BedIcon, label: `${beds} Beds` }] : []),
    ...(baths !== null ? [{ Icon: BathIcon, label: `${baths} Baths` }] : []),
  ];

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg lg:flex-row">
      {/* Photo */}
      <div className="relative h-[200px] shrink-0 overflow-hidden lg:h-auto lg:w-[240px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 240px, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <Link
          href={`/properties/${slug}`}
          aria-label={title}
          className="absolute inset-0 z-10"
        />

        {featured && (
          <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-white">
            Featured
          </span>
        )}

        <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-heading/85 px-3 py-1 text-[10px] font-semibold text-white">
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
      <div className="flex flex-1 flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-[16px] font-semibold text-heading">
            <Link
              href={`/properties/${slug}`}
              className="truncate transition-colors hover:text-primary"
            >
              {title}
            </Link>

            {verified && (
              <VerifiedTickIcon
                className="h-4 w-4 shrink-0 text-primary"
                aria-label="Verified listing"
              />
            )}
          </h3>

          <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-muted">
            <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </p>

          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-text">
            {specs.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                {label}
              </li>
            ))}
          </ul>

          {description && (
            <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-muted">
              {description}
            </p>
          )}

          {features && features.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-medium text-text"
                >
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price and agent */}
        <div className="flex shrink-0 flex-col items-start gap-3.5 border-border sm:w-[190px] sm:border-l sm:pl-5">
          <div>
            <p className="text-[17px] font-bold text-primary">
              {formatListingPrice(price)}
            </p>
            {listedAgo && (
              <p className="mt-1 text-[11px] text-muted">{listedAgo}</p>
            )}
          </div>

          <Link
            href={`/agents/${agent.slug}`}
            className="flex items-center gap-2.5 rounded-md py-1 transition-opacity hover:opacity-80"
          >
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-light">
              <Image
                src={agent.avatar}
                alt={agent.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-heading">
                {agent.name}
              </p>
              <p className="truncate text-[10px] text-muted">{agent.title}</p>
            </div>
          </Link>

          <div className="flex w-full items-center gap-2">
            {agent.phone && (
              <a
                href={`tel:${agent.phone.replace(/\s/g, "")}`}
                aria-label={`Call ${agent.name}`}
                className="flex h-9 flex-1 items-center justify-center rounded-md border border-primary text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <PhoneIcon className="h-4 w-4" />
              </a>
            )}

            {agent.whatsapp && (
              <a
                href={`https://wa.me/${agent.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${agent.name}`}
                className="flex h-9 flex-1 items-center justify-center rounded-md border border-[#0f8a3e] bg-[#25D366] text-white transition-opacity hover:opacity-90"
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
