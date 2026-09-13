import Image from "next/image";
import Link from "next/link";
import {
  PhoneIcon,
  VerifiedTickIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import type { Agent } from "@/types/property";

type PropertyAgentCardProps = {
  agent: Agent;
};

/** Agent panel below the price box on the property detail page. */
export default function PropertyAgentCard({ agent }: PropertyAgentCardProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="flex items-center gap-3.5">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
          <Image
            src={agent.avatar}
            alt={agent.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-heading">
            {agent.name}
          </p>

          {agent.verified && (
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-primary">
              <VerifiedTickIcon className="h-3.5 w-3.5 shrink-0" />
              Verified Agent
            </p>
          )}

          <p className="mt-0.5 truncate text-[11px] text-muted">
            {agent.title}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {agent.phone && (
          <a
            href={`tel:${agent.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2.5 text-[13px] font-medium text-heading transition-colors hover:text-primary"
          >
            <PhoneIcon className="h-4 w-4 shrink-0 text-primary" />
            {agent.phone}
          </a>
        )}

        {agent.whatsapp && (
          <a
            href={`https://wa.me/${agent.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-[13px] font-medium text-heading transition-colors hover:text-primary"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
            Chat on WhatsApp
          </a>
        )}
      </div>

      <Link
        href={`/properties?agent=${agent.id}`}
        className="mt-5 block rounded-md border border-border py-2.5 text-center text-[12px] font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
      >
        View All Properties
      </Link>
    </div>
  );
}
