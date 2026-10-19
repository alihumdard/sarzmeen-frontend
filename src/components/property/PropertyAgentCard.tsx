import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import {
  PhoneIcon,
  VerifiedTickIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import type { PropertyDetail } from "@/types/property";

type Props = {
  agent: PropertyDetail["agent"];
};

export default function PropertyAgentCard({ agent }: Props) {
  /*
   * A listing owned by a plain user has no agent profile, so the slug comes
   * back empty and a link would point at /agents/ — a dead page. Show the
   * same details without wrapping them in a link.
   */
  const profileHref = agent.slug ? `/agents/${agent.slug}` : null;

  const identity = (
    <>
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-light">
          {agent.avatar ? (
            <SafeImage
              src={agent.avatar}
              alt={agent.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs font-semibold text-gray-500">
              {agent.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-[13px] font-bold text-heading">
            {agent.name}
            {agent.verified && (
              <VerifiedTickIcon
                className="h-3.5 w-3.5 shrink-0 text-primary"
                aria-label="Verified agent"
              />
            )}
          </p>
          <p className="truncate text-[11px] text-muted">{agent.title}</p>
        </div>
    </>
  );

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      {profileHref ? (
        <Link
          href={profileHref}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          {identity}
        </Link>
      ) : (
        <div className="flex items-center gap-3">{identity}</div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <a
          href={agent.phone ? `tel:${agent.phone.replace(/\s/g, "")}` : "/contact"}
          className="flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <PhoneIcon className="h-4 w-4" />
          Contact Agent
        </a>

        {agent.whatsapp && (
          <a
            href={`https://wa.me/${agent.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 rounded-md border border-[#0f8a3e] py-3 text-[13px] font-semibold text-heading transition-colors hover:bg-[#25D366] hover:text-white"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366] group-hover:text-white" />
            Chat on WhatsApp
          </a>
        )}
      </div>

      <Link
        href={`/agents/${agent.slug}`}
        className="mt-3 block rounded-md border border-border py-2.5 text-center text-[12px] font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
      >
        View All Properties by {agent.name.split(" ")[0]}
      </Link>
    </div>
  );
}
