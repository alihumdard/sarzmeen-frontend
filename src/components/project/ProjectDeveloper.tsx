import Image from "next/image";
import type { ProjectDetail } from "@/types/project";

type Props = {
  project: ProjectDetail;
};

/** Developer profile with contact details (spec section 4). */
export default function ProjectDeveloper({ project }: Props) {
  const dev = project.developerProfile;

  if (!dev) {
    return (
      <div className="max-w-[520px]">
        <h2 className="text-[16px] font-bold text-heading">Developer</h2>
        <p className="mt-3 text-[13px] text-text">{project.developer}</p>
      </div>
    );
  }

  const contacts = [
    { label: "Phone", value: dev.phone, href: dev.phone ? `tel:${dev.phone}` : null },
    { label: "Email", value: dev.email, href: dev.email ? `mailto:${dev.email}` : null },
    { label: "Website", value: dev.website, href: dev.website },
    { label: "Address", value: dev.address, href: null },
  ].filter((c) => c.value);

  return (
    <div className="max-w-[640px]">
      <h2 className="text-[16px] font-bold text-heading">Developer</h2>

      <div className="mt-4 flex items-start gap-4 rounded-lg border border-border bg-surface p-4">
        {dev.logo && (
          <Image
            src={dev.logo}
            alt={dev.name}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-md border border-border bg-white object-contain"
          />
        )}
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[14px] font-bold text-heading">
            {dev.name}
            {dev.verified && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                Verified
              </span>
            )}
          </p>
          {dev.description && (
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-text">{dev.description}</p>
          )}
        </div>
      </div>

      {contacts.length > 0 && (
        <dl className="mt-4 overflow-hidden rounded-md border border-border">
          {contacts.map((c, i) => (
            <div
              key={c.label}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 ${
                i % 2 === 0 ? "bg-surface" : "bg-white"
              }`}
            >
              <dt className="text-[12px] text-muted">{c.label}</dt>
              <dd className="truncate text-[12.5px] font-semibold text-heading">
                {c.href ? (
                  <a href={c.href} className="hover:text-primary" target={c.label === "Website" ? "_blank" : undefined} rel="noreferrer">
                    {c.value}
                  </a>
                ) : (
                  c.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
