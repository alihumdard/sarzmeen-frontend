import type { ProjectDetail } from "@/types/project";

type Props = {
  project: ProjectDetail;
};

/** Towers, floors and handover timelines (spec section 4). */
export default function ProjectSpecifications({ project }: Props) {
  const rows = [
    { label: "Towers / Buildings", value: project.towersCount },
    { label: "Total Floors", value: project.totalFloors },
    { label: "Basement Floors", value: project.basementFloors },
    { label: "Parking Spaces", value: project.parkingSpaces?.toLocaleString("en-US") },
    { label: "Total Units", value: project.totalUnits?.toLocaleString("en-US") },
    { label: "Payment", value: project.paymentTypeLabel },
    { label: "Expected Completion", value: project.expectedCompletion },
    { label: "Possession", value: project.possessionTimeline },
  ].filter((r) => r.value !== null && r.value !== undefined && r.value !== "");

  if (rows.length === 0) return null;

  return (
    <div>
      <h3 className="text-[14px] font-bold text-heading">Specifications</h3>
      <dl className="mt-3 overflow-hidden rounded-md border border-border">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 ${
              i % 2 === 0 ? "bg-surface" : "bg-white"
            }`}
          >
            <dt className="text-[12px] text-muted">{row.label}</dt>
            <dd className="text-[12.5px] font-semibold text-heading">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
