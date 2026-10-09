import type { PropertyDetail } from "@/types/property";

type PropertyDescriptionProps = {
  property: PropertyDetail;
};

export default function PropertyDescription({
  property,
}: PropertyDescriptionProps) {
  const hasHighlights = property.highlights && property.highlights.length > 0;
  const hasDescription = property.descriptionHtml || property.descriptionParagraphs?.length > 0;

  if (!hasDescription && !hasHighlights) return null;

  return (
    <div>
      {hasDescription && (
        <>
          <h2 className="text-[15px] font-bold text-heading">Description</h2>

          {property.descriptionHtml ? (
            <div
              className="mt-3 max-w-none text-[13px] leading-[1.85] text-text/80 [&_h2]:mt-5 [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:text-heading [&_h3]:mt-4 [&_h3]:text-[14px] [&_h3]:font-semibold [&_h3]:text-heading [&_li]:mt-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: property.descriptionHtml }}
            />
          ) : (
            <div className="mt-3 space-y-3">
              {property.descriptionParagraphs.map((paragraph, i) => (
                <p key={i} className="text-[13px] leading-[1.85] text-text/80">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </>
      )}

      {hasHighlights && (
        <div className={hasDescription ? "mt-6" : ""}>
          <h3 className="text-[14px] font-bold text-heading">Key Highlights</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {property.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-center gap-2.5 rounded-md border border-border/60 bg-surface/50 px-3 py-2.5"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </span>
                <span className="text-[12px] font-medium text-heading">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
