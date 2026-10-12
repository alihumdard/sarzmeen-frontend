import Image from "next/image";
import type { ProjectDetail } from "@/types/project";

type Props = {
  project: ProjectDetail;
};

/** Floor plans and downloadable documents (spec sections 12 and 14). */
export default function ProjectFloorPlans({ project }: Props) {
  const plans = project.floorPlans ?? [];
  const documents = project.documents ?? [];

  if (plans.length === 0 && documents.length === 0) {
    return (
      <p className="py-8 text-center text-[12px] text-muted">
        No floor plans have been published for this project.
      </p>
    );
  }

  return (
    <div className="max-w-[760px] space-y-6">
      {plans.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-heading">Floor Plans</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => (
              <div key={plan.id} className="overflow-hidden rounded-lg border border-border">
                {plan.image && (
                  <Image
                    src={plan.image}
                    alt={plan.name}
                    width={400}
                    height={300}
                    className="h-44 w-full bg-surface object-contain"
                  />
                )}
                <div className="px-3 py-2.5">
                  <p className="text-[13px] font-semibold text-heading">{plan.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted">
                    {[plan.tower, plan.floorNumber && `Floor ${plan.floorNumber}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {plan.description && (
                    <p className="mt-1.5 text-[12px] text-text">{plan.description}</p>
                  )}
                  {plan.pdf && (
                    <a
                      href={plan.pdf}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-[11.5px] font-semibold text-primary hover:underline"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-heading">Documents</h2>
          <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-[12.5px] text-heading">{doc.title}</span>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-[11.5px] font-semibold text-primary hover:underline"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
