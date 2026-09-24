"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import StatusBadge from "@/components/admin/StatusBadge";
import CreateRoleModal from "@/components/admin/CreateRoleModal";

type RoleStatus = "Active" | "Inactive";

type Role = {
  id: number;
  name: string;
  description: string;
  users: number;
  keyPermissions: string[];
  status: RoleStatus;
  createdAt: string;
  iconClassName: string;
  icon: "crown" | "briefcase" | "user" | "pen";
};

const roles: Role[] = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access with all permissions.",
    users: 2,
    keyPermissions: ["All Modules", "System Settings"],
    status: "Active",
    createdAt: "May 01, 2024 10:30 AM",
    iconClassName: "bg-amber-50 text-amber-500",
    icon: "crown",
  },
  {
    id: 2,
    name: "Employer / Agent",
    description: "Manage own listings, projects and leads.",
    users: 4,
    keyPermissions: ["Properties", "Projects", "Inquiries"],
    status: "Active",
    createdAt: "May 02, 2024 11:15 AM",
    iconClassName: "bg-violet-50 text-violet-500",
    icon: "briefcase",
  },
  {
    id: 3,
    name: "Job Seeker / User",
    description: "Manage profile, saved listings and inquiries.",
    users: 5,
    keyPermissions: ["Profile", "Inquiries", "Favorites"],
    status: "Active",
    createdAt: "May 03, 2024 02:45 PM",
    iconClassName: "bg-blue-50 text-blue-500",
    icon: "user",
  },
  {
    id: 4,
    name: "Author",
    description: "Create and manage blog posts and media.",
    users: 1,
    keyPermissions: ["Blogs", "Media"],
    status: "Active",
    createdAt: "May 04, 2024 09:20 AM",
    iconClassName: "bg-sky-50 text-sky-500",
    icon: "pen",
  },
];

const permissionChipClasses: Record<string, string> = {
  "All Modules": "bg-emerald-50 text-emerald-700",
  "System Settings": "bg-gray-100 text-gray-600",
  Properties: "bg-blue-50 text-blue-600",
  Projects: "bg-violet-50 text-violet-600",
  Inquiries: "bg-amber-50 text-amber-600",
  Profile: "bg-blue-50 text-blue-600",
  Favorites: "bg-emerald-50 text-emerald-600",
  Blogs: "bg-violet-50 text-violet-600",
  Media: "bg-gray-100 text-gray-600",
};

const modules = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" as const },
  { key: "properties", label: "Properties", icon: "properties" as const },
  { key: "projects", label: "Projects", icon: "projects" as const },
  { key: "blogs", label: "Blogs", icon: "blogs" as const },
  { key: "locations", label: "Locations", icon: "locations" as const },
  { key: "inquiries", label: "Inquiries", icon: "inquiries" as const },
  { key: "users", label: "Users", icon: "users" as const },
  { key: "media", label: "Media Library", icon: "media" as const },
  { key: "settings", label: "Settings", icon: "settings" as const },
];

const matrixRoles = ["Administrator", "Employer / Agent", "Job Seeker / User", "Author"];

const matrix: Record<string, Record<string, boolean>> = {
  dashboard: {
    Administrator: true,
    "Employer / Agent": true,
    "Job Seeker / User": true,
    Author: true,
  },
  properties: {
    Administrator: true,
    "Employer / Agent": true,
    "Job Seeker / User": false,
    Author: false,
  },
  projects: {
    Administrator: true,
    "Employer / Agent": true,
    "Job Seeker / User": false,
    Author: false,
  },
  blogs: {
    Administrator: true,
    "Employer / Agent": false,
    "Job Seeker / User": false,
    Author: true,
  },
  locations: {
    Administrator: true,
    "Employer / Agent": false,
    "Job Seeker / User": false,
    Author: false,
  },
  inquiries: {
    Administrator: true,
    "Employer / Agent": true,
    "Job Seeker / User": true,
    Author: false,
  },
  users: {
    Administrator: true,
    "Employer / Agent": false,
    "Job Seeker / User": false,
    Author: false,
  },
  media: {
    Administrator: true,
    "Employer / Agent": true,
    "Job Seeker / User": false,
    Author: true,
  },
  settings: {
    Administrator: true,
    "Employer / Agent": false,
    "Job Seeker / User": false,
    Author: false,
  },
};

export default function RolesPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const itemsPerPage = 10;

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return roles.filter((role) => {
      const matchesSearch =
        !query ||
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query);

      const matchesStatus = !status || role.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / itemsPerPage));

  const paginatedRoles = filteredRoles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const toggleSelected = (id: number) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const allSelected =
    paginatedRoles.length > 0 &&
    paginatedRoles.every((role) => selected.includes(role.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected((current) =>
        current.filter((id) => !paginatedRoles.some((role) => role.id === id)),
      );
    } else {
      setSelected((current) => [
        ...current,
        ...paginatedRoles.map((role) => role.id).filter((id) => !current.includes(id)),
      ]);
    }
  };

  const columns: AdminTableColumn<Role>[] = [
    {
      key: "select",
      label: "",
      width: "36px",
      render: (role) => (
        <input
          type="checkbox"
          checked={selected.includes(role.id)}
          onChange={() => toggleSelected(role.id)}
          onClick={(event) => event.stopPropagation()}
          className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
        />
      ),
    },
    {
      key: "index",
      label: "#",
      width: "36px",
      render: (_role, index) => (
        <span className="text-gray-400">
          {(page - 1) * itemsPerPage + index + 1}
        </span>
      ),
    },
    {
      key: "name",
      label: "Role Name",
      width: "18%",
      render: (role) => (
        <div className="flex items-center gap-2.5">
          <span
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              role.iconClassName,
            ].join(" ")}
          >
            <RoleIcon name={role.icon} />
          </span>
          <span className="truncate font-semibold text-gray-800">
            {role.name}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (role) => (
        <span className="block max-w-[220px] text-gray-500">
          {role.description}
        </span>
      ),
    },
    {
      key: "users",
      label: "Users",
      align: "center",
      render: (role) => (
        <span className="font-medium text-gray-700">{role.users}</span>
      ),
    },
    {
      key: "keyPermissions",
      label: "Key Permissions",
      render: (role) => (
        <div className="flex flex-wrap gap-1.5">
          {role.keyPermissions.map((permission) => (
            <span
              key={permission}
              className={[
                "whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium",
                permissionChipClasses[permission] ?? "bg-gray-100 text-gray-600",
              ].join(" ")}
            >
              {permission}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (role) => <StatusBadge status={role.status} />,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (role) => (
        <span className="whitespace-nowrap text-[11px] text-gray-400">
          {role.createdAt}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (role) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(event) => event.stopPropagation()}
        >
          <Link
            href={`/admin/roles/${role.id}/edit`}
            aria-label="Edit Role"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EditIcon />
          </Link>

          <button
            type="button"
            aria-label="Duplicate Role"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <DuplicateIcon />
          </button>

          <button
            type="button"
            aria-label="Delete Role"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
          >
            <TrashIcon />
          </button>

          <button
            type="button"
            aria-label="More actions"
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <MoreIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Roles & Permissions"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "User Management" },
          { label: "Roles & Permissions" },
        ]}
        action={
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <PlusIcon />
            Create New Role
          </button>
        }
      />

      <CreateRoleModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Roles"
          value={roles.length}
          trend="No change"
          neutral
          icon={<UserIcon />}
        />
        <SummaryCard
          label="Total Permissions"
          value={56}
          trend="+12.0%"
          icon={<KeyIcon />}
        />
        <SummaryCard
          label="Active Users"
          value={12}
          trend="+20.0%"
          icon={<UsersGroupIcon />}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          label="Role Assignments"
          value={12}
          trend="+9.1%"
          icon={<ShieldIcon />}
          iconClassName="bg-violet-50 text-violet-600"
        />
      </section>

      {/* Search + Status */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <SearchIcon />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search roles..."
            className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
          />
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="h-10 shrink-0 rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary sm:w-[160px]"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <section>
        <div className="mb-2 flex items-center gap-2 px-1">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
          />
          <span className="text-[11px] text-gray-500">
            {selected.length > 0 ? `${selected.length} selected` : "Select all"}
          </span>
        </div>

        <AdminTable
          columns={columns}
          data={paginatedRoles}
          rowKey={(role) => role.id}
          emptyMessage="No roles match your filters."
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredRoles.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        />
      </section>

      {/* Permissions Matrix */}
      <section className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-gray-800">
              Permissions Matrix
            </h2>
            <p className="mt-0.5 text-[11px] text-gray-400">
              Overview of module access for each role. You can manage detailed
              permissions from role settings.
            </p>
          </div>

          <Link
            href="/admin/roles/permissions"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
          >
            <SettingsIcon />
            Manage Permissions
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                  Module
                </th>
                {matrixRoles.map((role) => (
                  <th
                    key={role}
                    className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {modules.map((module) => (
                <tr key={module.key} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5 text-[12px] font-medium text-gray-700">
                      <ModuleIcon name={module.icon} />
                      {module.label}
                    </div>
                  </td>

                  {matrixRoles.map((role) => (
                    <td key={role} className="px-5 py-3.5 text-center">
                      {matrix[module.key][role] ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <CheckIcon />
                        </span>
                      ) : (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">
                          <CrossIcon />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  trend,
  neutral,
  icon,
  iconClassName,
}: {
  label: string;
  value: number;
  trend: string;
  neutral?: boolean;
  icon: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <span
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
          iconClassName ?? "bg-primary/10 text-primary",
        ].join(" ")}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[11px] text-gray-500">{label}</p>
        <p className="mt-0.5 text-[19px] font-bold leading-none text-gray-900">
          {value.toLocaleString()}
        </p>
        <p
          className={[
            "mt-1.5 text-[9px] font-medium",
            neutral ? "text-gray-400" : "text-emerald-600",
          ].join(" ")}
        >
          {neutral ? "—" : "↑"} {trend}
          <span className="ml-1 font-normal text-gray-400">
            from last month
          </span>
        </p>
      </div>
    </div>
  );
}

function RoleIcon({ name }: { name: Role["icon"] }) {
  switch (name) {
    case "crown":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 8 4 3 5-6 5 6 4-3-1.5 10h-15L3 8Z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
        </svg>
      );
    case "user":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case "pen":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" />
          <path d="m14.5 6.5 3 3" />
        </svg>
      );
    default:
      return null;
  }
}

function ModuleIcon({ name }: { name: string }) {
  const common = {
    className: "h-4 w-4 text-gray-400",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
        </svg>
      );
    case "properties":
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6 9.5V20h12V9.5" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );
    case "projects":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 20V9h8v11" />
          <path d="M8 13h8M8 16h8M10 7h4" />
        </svg>
      );
    case "blogs":
      return (
        <svg {...common}>
          <path d="M5 3.5h10l4 4V20H5z" />
          <path d="M15 3.5V8h4M8 12h8M8 15.5h6" />
        </svg>
      );
    case "locations":
      return (
        <svg {...common}>
          <path d="M12 21s6.5-5.4 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
          <circle cx="12" cy="10.8" r="2.4" />
        </svg>
      );
    case "inquiries":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="14" rx="2" />
          <path d="m4.5 7 7.5 6 7.5-6" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14.5a5.5 5.5 0 0 1 3.5 5" />
        </svg>
      );
    case "media":
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="17" height="16" rx="2" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="m5 17 4.5-4 3 2.5 2.5-2.5 4 4" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1H15V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6H21a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      );
    default:
      return null;
  }
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8-8M16 5l2.5 2.5M19 2l2.5 2.5" />
    </svg>
  );
}

function UsersGroupIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14.5a5.5 5.5 0 0 1 3.5 5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 19 6v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1H15V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6H21a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" />
      <path d="m14.5 6.5 3 3" />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
