import Image from "next/image";
import Link from "next/link";
import {
  AreaIcon,
  BathIcon,
  BedIcon,
  CarIcon,
  KitchenIcon,
  PhoneIcon,
  SofaIcon,
  VerifiedTickIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { formatListingPrice } from "@/lib/utils/format";
import type { PropertyDetail } from "@/types/property";

type PropertyPriceBoxProps = {
  property: PropertyDetail;
};

/**
 * Price, key specs, agent identity and contact actions — one unified card,
 * rather than splitting the agent into a second card with its own duplicate
 * call/WhatsApp buttons right below.
 */
export default function PropertyPriceBox({ property }: PropertyPriceBoxProps) {
  const {
    price,
    negotiable,
    area,
    beds,
    baths,
    livingRooms,
    kitchens,
    carParking,
    agent,
  } = property;

  const specs = [
    { Icon: AreaIcon, value: area, label: "Area" },
    ...(beds !== null
      ? [{ Icon: BedIcon, value: String(beds), label: "Bedrooms" }]
      : []),
    ...(baths !== null
      ? [{ Icon: BathIcon, value: String(baths), label: "Bathrooms" }]
      : []),
    { Icon: SofaIcon, value: String(livingRooms), label: "Living Rooms" },
    { Icon: KitchenIcon, value: String(kitchens), label: "Kitchens" },
    { Icon: CarIcon, value: String(carParking), label: "Car Parking" },
  ];

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <p className="text-[21px] font-bold text-primary">
        {formatListingPrice(price)}
      </p>

      {negotiable && (
        <p className="mt-1 text-[12px] font-medium text-text">
          Price is Negotiable
        </p>
      )}

      {/* Specs */}
      <dl className="mt-5 grid grid-cols-3 gap-y-5 border-y border-border py-5">
        {specs.map(({ Icon, value, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="h-[18px] w-[18px] shrink-0 text-muted" />

            <div className="min-w-0">
              <dd className="text-[13px] font-semibold leading-none text-heading">
                {value}
              </dd>
              <dt className="mt-1 truncate text-[10px] text-muted">{label}</dt>
            </div>
          </div>
        ))}
      </dl>

      {/* Agent identity */}
      <Link
        href={`/agents/${agent.slug}`}
        className="mt-5 flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-light">
          <Image
            src={agent.avatar}
            alt={agent.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-[13px] font-bold text-heading">
            {agent.name}
            {agent.verified && (
              <VerifiedTickIcon
                className="h-3.5 w-3.5 shrink-0 text-primary"
                aria-label="Verified agent"
              />
            )}
          </p>
          <p className="truncate text-[11px] text-muted">{agent.title}</p>
        </div>
      </Link>

      {/* Contact actions */}
      <div className="mt-5 flex flex-col gap-3">
        <a
          href={agent.phone ? `tel:${agent.phone.replace(/\s/g, "")}` : "/contact"}
          className="flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <PhoneIcon className="h-4 w-4" />
          Contact Agent
        </a>

        {agent.whatsapp && (
          <a
            href={`https://wa.me/${agent.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 rounded-md border border-[#0f8a3e] py-3 text-[13px] font-semibold text-heading transition-colors hover:bg-[#25D366] hover:text-white"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366] group-hover:text-white" />
            Chat on WhatsApp
          </a>
        )}
      </div>

      <Link
        href={`/agents/${agent.slug}`}
        className="mt-3 block rounded-md border border-border py-2.5 text-center text-[12px] font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
      >
        View All Properties by {agent.name.split(" ")[0]}
      </Link>
    </div>
  );
}
