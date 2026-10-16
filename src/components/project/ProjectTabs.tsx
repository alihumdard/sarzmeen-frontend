"use client";

import { useState } from "react";
import PropertyLocation from "@/components/property/PropertyLocation";
import ProjectAmenities from "@/components/project/ProjectAmenities";
import ProjectDescription from "@/components/project/ProjectDescription";
import ProjectPaymentPlan from "@/components/project/ProjectPaymentPlan";
import ProjectTowers from "@/components/project/ProjectTowers";
import ProjectSpecifications from "@/components/project/ProjectSpecifications";
import ProjectDeveloper from "@/components/project/ProjectDeveloper";
import ProjectFaqs from "@/components/project/ProjectFaqs";
import ProjectFloorPlans from "@/components/project/ProjectFloorPlans";
import ProjectInventory from "@/components/project/ProjectInventory";
import type { ProjectDetail } from "@/types/project";

type ProjectTabsProps = {
  project: ProjectDetail;
};

const BASE_TABS = ["Overview", "Amenities", "Location", "Payment Plan"];

/**
 * Tabbed detail panel, mirroring PropertyTabs. Overview carries the full
 * three-column layout; the remaining tabs reuse the pieces that belong to
 * them.
 */
export default function ProjectTabs({ project }: ProjectTabsProps) {
  const [active, setActive] = useState("Overview");

  // Only surface a tab once it has something to show.
  const tabs = [
    "Overview",
    ...((project.units?.length ?? 0) > 0 ? ["Inventory"] : []),
    ...((project.towers?.length ?? 0) > 0 ? ["Towers"] : []),
    ...BASE_TABS.slice(1),
    ...((project.floorPlans?.length ?? 0) > 0 || (project.documents?.length ?? 0) > 0
      ? ["Floor Plans"]
      : []),
    ...(project.developerProfile ? ["Developer"] : []),
    ...((project.faqs?.length ?? 0) > 0 ? ["FAQs"] : []),
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div
        role="tablist"
        aria-label="Project details"
        className="flex gap-1 overflow-x-auto border-b border-border px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`shrink-0 border-b-2 px-3.5 py-3.5 text-[12px] font-medium transition-colors ${
              active === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-heading"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="p-5">
        {active === "Overview" && (
          <div className="grid gap-8 lg:grid-cols-3 lg:divide-x lg:divide-border lg:gap-0">
            <div className="space-y-6">
              <ProjectDescription project={project} />
              <ProjectSpecifications project={project} />
            </div>
            <div className="lg:px-6">
              <ProjectAmenities project={project} />
            </div>
            <div className="lg:pl-6">
              <PropertyLocation property={project} />
            </div>
          </div>
        )}

        {active === "Amenities" && <ProjectAmenities project={project} />}

        {active === "Location" && (
          <div className="max-w-[380px]">
            <PropertyLocation property={project} />
          </div>
        )}

        {active === "Inventory" && <ProjectInventory project={project} />}

        {active === "Towers" && <ProjectTowers project={project} />}

        {active === "Payment Plan" && <ProjectPaymentPlan project={project} />}

        {active === "Floor Plans" && <ProjectFloorPlans project={project} />}

        {active === "Developer" && <ProjectDeveloper project={project} />}

        {active === "FAQs" && <ProjectFaqs project={project} />}
      </div>
    </div>
  );
}
