import {
  AreaIcon,
  BathIcon,
  BedIcon,
  CarIcon,
  KitchenIcon,
  SofaIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { formatListingPrice } from "@/lib/utils/format";
import type { PropertyDetail } from "@/types/property";

type PropertyPriceBoxProps = {
  property: PropertyDetail;
};

/** Price, key specs and the two contact actions. */
export default function PropertyPriceBox({ property }: PropertyPriceBoxProps) {
  const {
    price,
    purpose,
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
        {formatListingPrice(price, purpose)}
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

      <a
        href={agent.phone ? `tel:${agent.phone.replace(/\s/g, "")}` : "/contact"}
        className="mt-5 block rounded-md bg-primary py-3 text-center text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Contact Agent
      </a>

      {agent.whatsapp && (
        <a
          href={`https://wa.me/${agent.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-md border border-border py-3 text-[13px] font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
        >
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          Chat on WhatsApp
        </a>
      )}
    </div>
  );
}
