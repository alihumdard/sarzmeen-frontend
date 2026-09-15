"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminActionMenu from "@/components/admin/AdminActionMenu";
import StatusBadge from "@/components/admin/StatusBadge";

type ProjectStatus =
  | "Active"
  | "Upcoming"
  | "Completed"
  | "On Hold";

type Project = {
  id: number;
  title: string;
  projectId: string;
  type: string;
  location: string;
  units: number;
  status: ProjectStatus;
  featured: boolean;
  date: string;
};

const initialProjects: Project[] = [
  {
    id: 1,
    title: "Lahore Smart City",
    projectId: "PRJ-0096",
    type: "Residential",
    location: "GT Road, Lahore",
    units: 5200,
    status: "Active",
    featured: true,
    date: "May 20, 2024",
  },
  {
    id: 2,
    title: "Bahria Town Karachi",
    projectId: "PRJ-0095",
    type: "Residential",
    location: "Super Highway, Karachi",
    units: 12500,
    status: "Active",
    featured: true,
    date: "May 20, 2024",
  },
  {
    id: 3,
    title: "DHA Lahore Phase 9 Prism",
    projectId: "PRJ-0094",
    type: "Residential",
    location: "DHA Phase 9, Lahore",
    units: 3800,
    status: "Active",
    featured: false,
    date: "May 19, 2024",
  },
  {
    id: 4,
    title: "Eighteen Islamabad",
    projectId: "PRJ-0093",
    type: "Residential",
    location: "Islamabad Expressway",
    units: 2300,
    status: "Upcoming",
    featured: true,
    date: "May 19, 2024",
  },
  {
    id: 5,
    title: "Gwadar Golf City",
    projectId: "PRJ-0092",
    type: "Residential",
    location: "Gwadar, Balochistan",
    units: 6500,
    status: "Upcoming",
    featured: false,
    date: "May 18, 2024",
  },
  {
    id: 6,
    title: "Mall of Gulberg",
    projectId: "PRJ-0091",
    type: "Commercial",
    location: "Gulberg III, Lahore",
    units: 350,
    status: "Active",
    featured: false,
    date: "May 18, 2024",
  },
  {
    id: 7,
    title: "Park View City Islamabad",
    projectId: "PRJ-0090",
    type: "Residential",
    location: "Islamabad",
    units: 4100,
    status: "Active",
    featured: true,
    date: "May 17, 2024",
  },
  {
    id: 8,
    title: "Ocean Mall Karachi",
    projectId: "PRJ-0089",
    type: "Commercial",
    location: "Clifton, Karachi",
    units: 420,
    status: "Completed",
    featured: false,
    date: "May 17, 2024",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [projectType, setProjectType] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 8;

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase().trim();

    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.projectId.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query);

      const matchesStatus = !status || project.status === status;
      const matchesCity =
        !city ||
        project.location.toLowerCase().includes(city.toLowerCase());
      const matchesType = !projectType || project.type === projectType;

      return matchesSearch && matchesStatus && matchesCity && matchesType;
    });
  }, [projects, search, status, city, projectType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / itemsPerPage),
  );

  const paginatedProjects = filteredProjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setCity("");
    setProjectType("");
    setPage(1);
  };

  const deleteProject = (id: number) => {
    setProjects((current) =>
      current.filter((project) => project.id !== id),
    );
  };

  const toggleFeatured = (id: number) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? { ...project, featured: !project.featured }
          : project,
      ),
    );
  };

  const columns: AdminTableColumn<Project>[] = [
    {
      key: "title",
      label: "Project",
      width: "27%",
      render: (project) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
            <ProjectImageIcon />
          </div>

          <div className="min-w-0">
            <Link
              href={`/admin/projects/${project.id}`}
              onClick={(event) => event.stopPropagation()}
              className="block truncate text-[11px] font-semibold text-gray-800 hover:text-primary"
            >
              {project.title}
            </Link>

            <p className="mt-1 text-[9px] text-gray-400">
              ID: {project.projectId}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (project) => (
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
            <BuildingIcon />
          </span>
          <span className="text-[10px]">{project.type}</span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (project) => (
        <span className="max-w-[125px] leading-4 text-gray-600">
          {project.location}
        </span>
      ),
    },
    {
      key: "units",
      label: "Total Units",
      align: "right",
      render: (project) => (
        <span className="font-medium text-gray-700">
          {project.units.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (project) => <StatusBadge status={project.status} />,
    },
    {
      key: "featured",
      label: "Featured",
      align: "center",
      render: (project) => (
        <button
          type="button"
          aria-label={
            project.featured
              ? "Remove from featured"
              : "Mark as featured"
          }
          onClick={(event) => {
            event.stopPropagation();
            toggleFeatured(project.id);
          }}
          className={
            project.featured
              ? "text-primary"
              : "text-gray-300 hover:text-primary"
          }
        >
          <StarIcon filled={project.featured} />
        </button>
      ),
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (project) => (
        <div onClick={(event) => event.stopPropagation()}>
          <AdminActionMenu
            actions={[
              {
                label: "View Project",
                onClick: () => {},
                icon: <EyeIcon />,
              },
              {
                label: "Edit Project",
                onClick: () => {},
                icon: <EditIcon />,
              },
              {
                label: project.featured
                  ? "Remove Featured"
                  : "Make Featured",
                onClick: () => toggleFeatured(project.id),
                icon: <StarIcon />,
                dividerBefore: true,
              },
              {
                label: "Delete Project",
                onClick: () => deleteProject(project.id),
                icon: <TrashIcon />,
                variant: "danger",
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects Management"
        description="Manage real estate projects, development status and project units."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Projects" },
          { label: "All Projects" },
        ]}
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90"
          >
            <PlusIcon />
            Add New Project
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <SummaryCard
          label="Total Projects"
          value={projects.length}
          trend="+8.4%"
          icon={<BuildingIcon />}
        />
        <SummaryCard
          label="Active Projects"
          value={projects.filter((p) => p.status === "Active").length}
          trend="+10.7%"
          icon={<CheckIcon />}
        />
        <SummaryCard
          label="Completed Projects"
          value={projects.filter((p) => p.status === "Completed").length}
          trend="+5.2%"
          icon={<CompletedIcon />}
        />
        <SummaryCard
          label="Upcoming Projects"
          value={projects.filter((p) => p.status === "Upcoming").length}
          trend="+3.6%"
          icon={<CalendarIcon />}
        />
        <SummaryCard
          label="On Hold"
          value={projects.filter((p) => p.status === "On Hold").length}
          trend="-2.1%"
          negative
          icon={<HoldIcon />}
        />
      </section>

      <AdminFilterBar
        searchPlaceholder="Search projects..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={[
          {
            label: "All Statuses",
            value: status,
            options: [
              { label: "Active", value: "Active" },
              { label: "Upcoming", value: "Upcoming" },
              { label: "Completed", value: "Completed" },
              { label: "On Hold", value: "On Hold" },
            ],
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
          },
          {
            label: "All Cities",
            value: city,
            options: [
              { label: "Lahore", value: "Lahore" },
              { label: "Karachi", value: "Karachi" },
              { label: "Islamabad", value: "Islamabad" },
              { label: "Gwadar", value: "Gwadar" },
            ],
            onChange: (value) => {
              setCity(value);
              setPage(1);
            },
          },
          {
            label: "All Project Types",
            value: projectType,
            options: [
              { label: "Residential", value: "Residential" },
              { label: "Commercial", value: "Commercial" },
            ],
            onChange: (value) => {
              setProjectType(value);
              setPage(1);
            },
          },
        ]}
        onReset={resetFilters}
        onExport={() => exportProjects(filteredProjects)}
      />

      <section>
        <AdminTable
          columns={columns}
          data={paginatedProjects}
          rowKey={(project) => project.id}
          emptyMessage="No projects found."
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredProjects.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  trend,
  negative,
  icon,
}: {
  label: string;
  value: number;
  trend: string;
  negative?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>

      <p className="mt-2 text-[19px] font-semibold leading-none text-gray-800">
        {value.toLocaleString()}
      </p>

      <p
        className={[
          "mt-2 text-[9px] font-medium",
          negative ? "text-red-500" : "text-emerald-600",
        ].join(" ")}
      >
        {trend}
        <span className="ml-1 font-normal text-gray-400">
          from last month
        </span>
      </p>
    </div>
  );
}

function exportProjects(data: Project[]) {
  const headers = [
    "Project",
    "ID",
    "Type",
    "Location",
    "Total Units",
    "Status",
    "Featured",
    "Date",
  ];

  const rows = data.map((project) => [
    project.title,
    project.projectId,
    project.type,
    project.location,
    project.units,
    project.status,
    project.featured ? "Yes" : "No",
    project.date,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "projects.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function ProjectImageIcon() {
  return (
    <svg
      className="h-7 w-7 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M3 21V7l9-4 9 4v14" />
      <path d="M7 21v-8h10v8M8 10h2M14 10h2" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5l8-3 8 3v16" />
      <path d="M8 9h1M8 13h1M8 17h1M15 9h1M15 13h1M15 17h1M10 21v-4h4v4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CompletedIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function HoldIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9v6M15 9v6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" />
      <path d="m14.5 6.5 3 3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}