import type { Metadata } from "next";
import { Suspense } from "react";
import AgentsHero from "@/components/agents/AgentsHero";
import AgentsContent from "@/components/agents/AgentsContent";

export const metadata: Metadata = {
  title: "Real Estate Agents",
  description:
    "Find verified real estate agents across Pakistan. Browse agent profiles, see their listings and get in touch.",
};

export default function AgentsPage() {
  return (
    <main>
      <AgentsHero />
      <Suspense fallback={<div className="py-20 text-center text-muted">Loading agents...</div>}>
        <AgentsContent />
      </Suspense>
    </main>
  );
}
