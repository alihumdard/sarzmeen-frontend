"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProjectDetail } from "@/types/project";

type Props = {
  project: ProjectDetail;
};

/**
 * Tower and floor breakdown (spec section 9).
 *
 * Shown only when a project models towers — housing schemes and plot projects
 * have none, and the tab is hidden for them.
 */
export default function ProjectTowers({ project }: Props) {
  const towers = project.towers ?? [];
  const [activeId, setActiveId] = useState(towers[0]?.id);

  if (towers.length === 0) {
    return (
      <p className="py-8 text-center text-[12px] text-muted">
        No tower breakdown has been published for this project.
      </p>
    );
  }

  const tower = towers.find((t) => t.id === activeId) ?? towers[0];
  const units = project.units ?? [];

  return (
    <div className="max-w-[760px]">
      <h2 className="text-[16px] font-bold text-heading">Towers &amp; Floors</h2>
      <p className="mt-1.5 text-[12px] text-muted">
        How the project is laid out. Select a tower to see its floors.
      </p>

      {/* Tower switcher — only worth showing when there is a choice. */}
      {towers.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {towers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className={`rounded-md px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                t.id === tower.id
                  ? "bg-primary text-white"
                  : "bg-surface text-text hover:bg-primary-light hover:text-primary"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        {/* Tower summary */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border bg-surface px-4 py-3">
          <span className="text-[14px] font-bold text-heading">{tower.name}</span>
          {tower.floorsCount != null && (
            <Stat label="Floors" value={String(tower.floorsCount)} />
          )}
          {tower.unitsCount != null && (
            <Stat label="Units" value={String(tower.unitsCount)} />
          )}
        </div>

        {tower.image && (
          <div className="relative aspect-[16/7] w-full bg-surface">
            <Image
              src={tower.image}
              alt={tower.name}
              fill
              sizes="(min-width: 1024px) 760px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        {tower.description && (
          <p className="border-b border-border px-4 py-3 text-[12.5px] leading-6 text-muted">
            {tower.description}
          </p>
        )}

        {/* Floors, highest first — how a building is read. */}
        {tower.floors.length === 0 ? (
          <p className="px-4 py-6 text-center text-[12px] text-muted">
            Floor details for this tower are not published yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {[...tower.floors]
              .sort((a, b) => b.floorNumber - a.floorNumber)
              .map((floor) => {
                const onThisFloor = units.filter((u) => u.floorId === floor.id);

                return (
                  <li
                    key={floor.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-heading">
                        {floor.name}
                      </p>
                      {onThisFloor.length > 0 && (
                        <p className="mt-0.5 text-[11px] text-muted">
                          {onThisFloor
                            .map((u) => u.unitNumber || u.unitType)
                            .join(" · ")}
                        </p>
                      )}
                    </div>

                    {(floor.floorPlanImage || floor.floorPlanPdf) && (
                      <a
                        href={floor.floorPlanPdf || floor.floorPlanImage || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-md border border-border px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:border-primary"
                      >
                        View floor plan
                      </a>
                    )}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[12px] text-muted">
      {label}: <span className="font-semibold text-heading">{value}</span>
    </span>
  );
}
