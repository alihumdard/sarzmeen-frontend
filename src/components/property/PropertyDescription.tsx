import { CheckIcon } from "@/components/ui/Icons";
import type { PropertyDetail } from "@/types/property";

type PropertyDescriptionProps = {
  property: PropertyDetail;
};

/** Left column of the Overview tab: prose plus the highlights list. */
export default function PropertyDescription({
  property,
}: PropertyDescriptionProps) {
  return (
    <div>
      <h2 className="text-[15px] font-bold text-heading">
        Property Description
      </h2>

      {property.descriptionParagraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="mt-3 text-[12px] leading-relaxed text-text"
        >
          {paragraph}
        </p>
      ))}

      <h3 className="mt-7 text-[15px] font-bold text-heading">Highlights</h3>

      <ul className="mt-3 flex flex-col gap-2.5">
        {property.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2.5">
            <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-[12px] leading-relaxed text-text">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
