import { formatPostDate } from "@/lib/utils/format";
import type { PropertyDetail } from "@/types/property";

type PropertyDetailsTableProps = {
  property: PropertyDetail;
};

/** Middle column of the Overview tab: the full specification list. */
export default function PropertyDetailsTable({
  property,
}: PropertyDetailsTableProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Property ID", value: property.propertyId },
    { label: "Area Size", value: property.area },
    ...(property.beds !== null
      ? [{ label: "Bedrooms", value: String(property.beds) }]
      : []),
    ...(property.baths !== null
      ? [{ label: "Bathrooms", value: String(property.baths) }]
      : []),
    { label: "Living Rooms", value: String(property.livingRooms) },
    { label: "Kitchens", value: String(property.kitchens) },
    { label: "Car Parking", value: String(property.carParking) },
    { label: "Floors", value: String(property.floors) },
    { label: "Furnishing", value: property.furnishing },
    { label: "Property Type", value: property.propertyType },
    {
      label: "Purpose",
      value: property.purpose === "sale" ? "For Sale" : "For Rent",
    },
    { label: "Property Status", value: property.propertyStatus },
    { label: "Listed By", value: property.listedBy },
    { label: "Listed On", value: formatPostDate(property.listedOn) },
  ];

  return (
    <div>
      <h2 className="text-[15px] font-bold text-heading">Property Details</h2>

      <dl className="mt-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-b-0"
          >
            <dt className="text-[11px] text-muted">{row.label}</dt>
            <dd className="truncate text-[11px] font-medium text-heading">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
