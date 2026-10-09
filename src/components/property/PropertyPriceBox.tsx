import {
  AreaIcon,
  BathIcon,
  BedIcon,
  CarIcon,
  KitchenIcon,
  SofaIcon,
} from "@/components/ui/Icons";
import { formatListingPrice } from "@/lib/utils/format";
import type { PropertyDetail } from "@/types/property";

type PropertyPriceBoxProps = {
  property: PropertyDetail;
};

export default function PropertyPriceBox({ property }: PropertyPriceBoxProps) {
  const { price, purpose, negotiable, area, beds, baths, livingRooms, kitchens, carParking } = property;

  const specs = [
    { Icon: AreaIcon, value: area, label: "Area" },
    ...(beds !== null ? [{ Icon: BedIcon, value: String(beds), label: "Bedrooms" }] : []),
    ...(baths !== null ? [{ Icon: BathIcon, value: String(baths), label: "Bathrooms" }] : []),
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
        <p className="mt-1 text-[12px] font-medium text-text">Price is Negotiable</p>
      )}

      <dl className="mt-5 grid grid-cols-3 gap-y-5 border-t border-border pt-5">
        {specs.map(({ Icon, value, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="h-[18px] w-[18px] shrink-0 text-muted" />
            <div className="min-w-0">
              <dd className="text-[13px] font-semibold leading-none text-heading">{value}</dd>
              <dt className="mt-1 truncate text-[10px] text-muted">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
