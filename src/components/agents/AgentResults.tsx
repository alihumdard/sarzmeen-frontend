import { Agent } from "@/data/agents";
import AgentCard from "./AgentCard";
import { ResetIcon } from "@/components/ui/Icons";

type AgentResultsProps = {
  agents: Agent[];
  selectedCity: string;
  onClearFilters: () => void;
};

export default function AgentResults({
  agents,
  selectedCity,
  onClearFilters,
}: AgentResultsProps) {
  const cityTitle = selectedCity ? `Real Estate Agents in ${selectedCity}` : "Real Estate Agents in Pakistan";

  return (
    <section className="pb-12">
      <div className="container-page">
        {/* Results Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[20px] font-bold text-heading sm:text-[22px]">
            {cityTitle}
          </h2>
          <p className="text-[13px] font-medium text-muted">
            {agents.length} {agents.length === 1 ? "Property Agent" : "Property Agents"} Found
          </p>
        </div>

        {/* Results Grid or Empty State */}
        {agents.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-border bg-white p-12 text-center shadow-sm">
            <h3 className="text-[18px] font-bold text-heading">No agents found</h3>
            <p className="mt-2 max-w-sm text-[13px] text-text">
              Try changing your search filters or browse popular cities below.
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-6 flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <ResetIcon className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
