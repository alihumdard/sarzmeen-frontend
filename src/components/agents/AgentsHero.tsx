import PageBanner from "@/components/layout/PageBanner";
import {
  BuildingIcon,
  LocationPinIcon,
  VerifiedBadgeIcon,
} from "@/components/ui/Icons";
import { demoAgents } from "@/data/agents";

export default function AgentsHero() {
  const verifiedCount = demoAgents.filter((agent) => agent.verified).length;
  const cityCount = new Set(demoAgents.map((agent) => agent.city)).size;

  return (
    <PageBanner
      title="Real Estate Agents in Pakistan"
      description="Find trusted real estate agents and agencies in your city. Browse verified professionals, view active listings, and connect directly."
      crumbs={[{ label: "Home", href: "/" }, { label: "Agents" }]}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/15">
          <VerifiedBadgeIcon className="h-4 w-4 text-[#3DBB6E]" />
          {verifiedCount}+ Verified Agencies
        </span>
        <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/15">
          <LocationPinIcon className="h-4 w-4 text-[#3DBB6E]" />
          {cityCount}+ Cities Covered
        </span>
        <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/15">
          <BuildingIcon className="h-4 w-4 text-[#3DBB6E]" />
          {demoAgents.length}+ Listed Agencies
        </span>
      </div>
    </PageBanner>
  );
}
