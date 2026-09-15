import type { ProjectDetail } from "@/types/project";

type ProjectPaymentPlanProps = {
  project: ProjectDetail;
};

/** Payment Plan tab: an installment breakdown table. */
export default function ProjectPaymentPlan({ project }: ProjectPaymentPlanProps) {
  return (
    <div className="max-w-[520px]">
      <h2 className="text-[16px] font-bold text-heading">Payment Plan</h2>
      <p className="mt-1.5 text-[12px] text-muted">
        Indicative installment breakdown — contact us for the full schedule.
      </p>

      <dl className="mt-4 overflow-hidden rounded-md border border-border">
        {project.paymentPlan.map((row, index) => (
          <div
            key={row.label}
            className={`flex items-center justify-between gap-3 px-3 py-3 ${
              index % 2 === 0 ? "bg-surface" : "bg-white"
            }`}
          >
            <dt className="text-[12px] font-medium text-muted">{row.label}</dt>
            <dd className="text-[13px] font-bold text-primary">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
