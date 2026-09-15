import { CheckIcon } from "@/components/ui/Icons";
import type { ProjectDetail } from "@/types/project";

type ProjectAmenitiesProps = {
  project: ProjectDetail;
};

/** Middle column of the Overview tab: the amenities grid. */
export default function ProjectAmenities({ project }: ProjectAmenitiesProps) {
  return (
    <div>
      <h2 className="text-[16px] font-bold text-heading">Amenities</h2>

      <ul className="mt-3.5 grid grid-cols-2 gap-2.5">
        {project.amenities.map((amenity, index) => (
          <li
            key={amenity}
            className={`flex items-center gap-2 rounded-md px-3 py-2.5 ${
              index % 2 === 0 ? "bg-surface" : "bg-white"
            } border border-border`}
          >
            <CheckIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate text-[12px] font-medium text-heading">
              {amenity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
