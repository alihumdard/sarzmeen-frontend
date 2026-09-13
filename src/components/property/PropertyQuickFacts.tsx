import {
  AreaSizeIcon,
  FurnishingIcon,
  HomeStatIcon,
  StatusIcon,
  TrustedAgentIcon,
} from "@/components/ui/Icons";
import type { PropertyDetail } from "@/types/property";

type PropertyQuickFactsProps = {
  property: PropertyDetail;
};

/** Six-up summary strip sitting between the gallery and the detail tabs. */
export default function PropertyQuickFacts({
  property,
}: PropertyQuickFactsProps) {
  const facts = [
    { Icon: HomeStatIcon, label: "Property Type", value: property.propertyType },
    {
      Icon: TrustedAgentIcon,
      label: "Purpose",
      value: property.purpose === "sale" ? "For Sale" : "For Rent",
    },
    { Icon: AreaSizeIcon, label: "Area Size", value: property.area },
    {
      Icon: StatusIcon,
      label: "Property Status",
      value: property.propertyStatus,
    },
    {
      Icon: FurnishingIcon,
      label: "Furnishing",
      value: property.furnishing,
    },
    {
      Icon: TrustedAgentIcon,
      label: "Listed By",
      value: property.listedBy,
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-y-5 rounded-lg border border-border bg-surface px-5 py-5 sm:grid-cols-3 lg:grid-cols-6">
      {facts.map(({ Icon, label, value }) => (
        <div key={label} className="flex items-center gap-2.5 px-1">
          <Icon className="h-5 w-5 shrink-0 text-primary" />

          <div className="min-w-0">
            <dt className="truncate text-[10px] text-muted">{label}</dt>
            <dd className="mt-0.5 truncate text-[12px] font-semibold text-heading">
              {value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
