import { CheckIcon } from "@/components/ui/Icons";
import type { ProjectDetail } from "@/types/project";

type ProjectDescriptionProps = {
  project: ProjectDetail;
};

/** Left column of the Overview tab: prose plus the highlights list. */
export default function ProjectDescription({ project }: ProjectDescriptionProps) {
  return (
    <div>
      <h2 className="text-[16px] font-bold text-heading">
        Project Description
      </h2>

      {project.descriptionParagraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-[13px] leading-relaxed text-text">
          {paragraph}
        </p>
      ))}

      <h3 className="mt-7 text-[16px] font-bold text-heading">Highlights</h3>

      <ul className="mt-3.5 flex flex-col gap-2.5">
        {project.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2.5 rounded-md bg-primary-light/50 px-3 py-2.5"
          >
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-[13px] font-medium leading-relaxed text-heading">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
