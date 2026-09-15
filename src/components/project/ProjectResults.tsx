"use client";

import { useState } from "react";
import ProjectCard from "@/components/project/ProjectCard";
import ProjectListRow from "@/components/project/ProjectListRow";
import { GridViewIcon, ListViewIcon } from "@/components/ui/Icons";
import Dropdown from "@/components/ui/Dropdown";
import Pagination from "@/components/ui/Pagination";
import type { Project } from "@/types/project";

type ProjectResultsProps = {
  projects: Project[];
  total: number;
};

/** Listings per page, matching what the API will return. */
const PAGE_SIZE = 9;

const sortOptions = [
  { label: "Featured First", value: "featured" },
  { label: "Name: A to Z", value: "name-asc" },
];

/** Results toolbar and list, mirroring PropertyResults for the projects listing. */
export default function ProjectResults({
  projects,
  total,
}: ProjectResultsProps) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const sorted = [...projects].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    return Number(b.featured) - Number(a.featured);
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const toggleClasses =
    "flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-[11px] font-medium transition-colors sm:px-3";

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <p className="min-w-0 shrink truncate text-[11px] text-text sm:text-[12px]">
          <span className="font-semibold text-heading">
            {total.toLocaleString("en-US")}
          </span>{" "}
          <span className="hidden sm:inline">Projects Found</span>
          <span className="sm:hidden">Found</span>
        </p>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={`${toggleClasses} ${
                view === "grid"
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border text-muted hover:text-primary"
              }`}
            >
              <GridViewIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              type="button"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={`${toggleClasses} ${
                view === "list"
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border text-muted hover:text-primary"
              }`}
            >
              <ListViewIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden text-[11px] text-muted sm:inline">
              Sort by:
            </span>

            <Dropdown
              label="Sort by"
              options={sortOptions}
              value={sort}
              onChange={setSort}
              className="w-[100px] sm:w-[168px]"
              triggerClassName="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-white py-2 pl-2.5 pr-2 text-[11px] text-heading outline-none transition-colors hover:border-primary focus:border-primary sm:pl-3"
            />
          </div>
        </div>
      </div>

      <div
        className={
          view === "grid" ? "mt-5 flex flex-col gap-4 sm:hidden" : "mt-5 flex flex-col gap-4"
        }
      >
        {sorted.map((project) => (
          <ProjectListRow key={project.id} project={project} />
        ))}
      </div>

      {view === "grid" && (
        <div className="hidden gap-5 sm:mt-5 sm:grid sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
