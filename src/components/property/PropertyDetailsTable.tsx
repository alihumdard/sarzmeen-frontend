import { formatPostDate } from "@/lib/utils/format";
import type { PropertyDetail } from "@/types/property";

type PropertyDetailsTableProps = {
  property: PropertyDetail;
};

export default function PropertyDetailsTable({
  property,
}: PropertyDetailsTableProps) {
  const rows: { label: string; value: string | null | undefined }[] = [
    { label: "Property ID", value: property.propertyId },
    { label: "Property Type", value: property.propertyType },
    {
      label: "Purpose",
      value: property.purpose === "rent" ? "For Rent" : property.purpose === "installment" ? "Installment" : "For Sale",
    },
    { label: "Area Size", value: property.area },
    ...(property.beds !== null ? [{ label: "Bedrooms", value: String(property.beds) }] : []),
    ...(property.baths !== null ? [{ label: "Bathrooms", value: String(property.baths) }] : []),
    { label: "Living Rooms", value: String(property.livingRooms || 0) },
    { label: "Kitchens", value: String(property.kitchens || 0) },
    { label: "Car Parking", value: String(property.carParking || 0) },
    ...(property.floors ? [{ label: "Floors", value: String(property.floors) }] : []),
    { label: "Furnishing", value: property.furnishing },
    { label: "Condition", value: property.propertyStatus },
    { label: "Listed By", value: property.listedBy },
    { label: "Listed On", value: formatPostDate(property.listedOn) },
  ].filter((r): r is { label: string; value: string } => !!r.value && r.value !== "null");

  return (
    <div>
      <div className="border-b border-border bg-surface/60 px-5 py-3">
        <h2 className="text-[14px] font-bold text-heading">Property Details</h2>
      </div>

      <div className="grid sm:grid-cols-2">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={[
              "flex items-center justify-between gap-4 px-5 py-3",
              index % 2 === 0 ? "bg-white" : "bg-surface/30",
              "sm:border-b sm:border-border/50",
              index % 2 === 0 ? "sm:border-r sm:border-r-border/50" : "",
            ].join(" ")}
          >
            <dt className="text-[12px] text-muted">{row.label}</dt>
            <dd className="text-right text-[12px] font-semibold text-heading">{row.value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
