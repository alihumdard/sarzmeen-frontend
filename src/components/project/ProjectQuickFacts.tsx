import {
  AreaSizeIcon,
  HomeStatIcon,
  StatusIcon,
  TrustedAgentIcon,
} from "@/components/ui/Icons";
import type { ProjectDetail } from "@/types/project";

type ProjectQuickFactsProps = {
  project: ProjectDetail;
};

/** Four-up summary strip sitting between the gallery and the detail tabs. */
export default function ProjectQuickFacts({ project }: ProjectQuickFactsProps) {
  const facts = [
    { Icon: HomeStatIcon, label: "Category", value: project.category },
    { Icon: StatusIcon, label: "Status", value: project.status },
    { Icon: AreaSizeIcon, label: "Total Area", value: project.totalArea },
    { Icon: TrustedAgentIcon, label: "Developer", value: project.developer },
  ];

  return (
    <dl className="grid grid-cols-2 gap-y-5 rounded-lg border border-border bg-surface px-5 py-5 sm:grid-cols-4">
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
