"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import Carousel from "@/components/ui/Carousel";
import { LocationPinIcon } from "@/components/ui/Icons";
import { listAgencies, type AgencyListItem } from "@/lib/api/agencies";

function PartnerAgencyCard({ agency }: { agency: AgencyListItem }) {
  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className="flex items-center gap-3.5 rounded-lg border border-border bg-white p-3.5 transition-colors hover:border-primary hover:bg-primary-light/20"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-surface">
        {agency.logo ? (
          <SafeImage src={agency.logo} alt={agency.name} fill sizes="56px" className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-light text-[18px] font-bold text-primary">
            {agency.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[14px] font-bold text-heading">{agency.name}</p>
        {agency.city && (
          <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
            <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
            {agency.city}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function PartnerAgencies() {
  const [agencies, setAgencies] = useState<AgencyListItem[]>([]);

  useEffect(() => {
    listAgencies({ per_page: 12 })
      .then((res) => setAgencies(res.data))
      .catch(() => {});
  }, []);

  if (agencies.length === 0) return null;

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
            href="/agencies"
            className="rounded-md border-2 border-primary px-5 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View All Agencies
          </Link>
        </div>

        <Carousel
          itemCount={Math.ceil(agencies.length / 2)}
          itemsPerPage={4}
          label="partner agencies"
        >
          {Array.from({ length: Math.ceil(agencies.length / 2) }).map((_, columnIndex) => {
            const pair = agencies.slice(columnIndex * 2, columnIndex * 2 + 2);
            return (
              <div
                key={columnIndex}
                className="flex w-[260px] shrink-0 snap-start flex-col gap-3 sm:w-[290px] lg:w-[calc((100%-60px)/4)]"
              >
                {pair.map((agency) => (
                  <PartnerAgencyCard key={agency.id} agency={agency} />
                ))}
              </div>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
}
