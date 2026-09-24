"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import StatusBadge from "@/components/admin/StatusBadge";
import AddUserModal from "@/components/admin/AddUserModal";

type UserRole = "Agent" | "Employer" | "Job Seeker";
type UserStatus = "Active" | "Pending" | "Suspended";

type UserRow = {
  id: number;
  name: string;
  company: string;
  role: UserRole;
  email: string;
  phone: string;
  joinedOn: string;
  status: UserStatus;
  avatar: string | null;
};

const users: UserRow[] = [
  {
    id: 1,
    name: "Ali Raza",
    company: "Skyline Properties",
    role: "Agent",
    email: "ali.raza@email.com",
    phone: "+92 300 1234567",
    joinedOn: "May 20, 2024 10:30 AM",
    status: "Active",
    avatar: "/images/agent-1.jpg",
  },
  {
    id: 2,
    name: "Sarah Khan",
    company: "Khan Estate & Builders",
    role: "Employer",
    email: "sarah.khan@email.com",
    phone: "+92 321 9876543",
    joinedOn: "May 19, 2024 09:15 AM",
    status: "Active",
    avatar: "/images/team-1.jpg",
  },
  {
    id: 3,
    name: "Usman Ahmed",
    company: "Individual User",
    role: "Job Seeker",
    email: "usman.ahmed@email.com",
    phone: "+92 333 4567890",
    joinedOn: "May 18, 2024 05:40 PM",
    status: "Pending",
    avatar: "/images/agent-1.jpg",
  },
  {
    id: 4,
    name: "Ayesha Malik",
    company: "Malik Associates",
    role: "Agent",
    email: "ayesha.malik@email.com",
    phone: "+92 300 1122334",
    joinedOn: "May 18, 2024 11:10 AM",
    status: "Active",
    avatar: "/images/team-1.jpg",
  },
  {
    id: 5,
    name: "Fahad Hussain",
    company: "Urban Developers",
    role: "Employer",
    email: "fahad.hussain@email.com",
    phone: "+92 321 6677889",
    joinedOn: "May 17, 2024 10:00 AM",
    status: "Active",
    avatar: null,
  },
  {
    id: 6,
    name: "Zainab Fatima",
    company: "Individual User",
    role: "Job Seeker",
    email: "zainab.fatima@email.com",
    phone: "+92 333 9988776",
    joinedOn: "May 16, 2024 02:30 PM",
    status: "Active",
    avatar: "/images/team-1.jpg",
  },
  {
    id: 7,
    name: "Bilal Khan",
    company: "Bahria Realtors",
    role: "Agent",
    email: "bilal.khan@email.com",
    phone: "+92 300 5544332",
    joinedOn: "May 15, 2024 04:20 PM",
    status: "Suspended",
    avatar: "/images/agent-1.jpg",
  },
  {
    id: 8,
    name: "Hira Noor",
    company: "Noor Properties",
    role: "Agent",
    email: "hira.noor@email.com",
    phone: "+92 321 2233445",
    joinedOn: "May 14, 2024 09:30 AM",
    status: "Active",
    avatar: "/images/team-1.jpg",
  },
  {
    id: 9,
    name: "Ahmad Ali",
    company: "Investment Group",
    role: "Employer",
    email: "ahmad.ali@email.com",
    phone: "+92 333 7766554",
    joinedOn: "May 13, 2024 11:20 AM",
    status: "Active",
    avatar: "/images/agent-1.jpg",
  },
  {
    id: 10,
    name: "Maria Ahmed",
    company: "Individual User",
    role: "Job Seeker",
    email: "maria.ahmed@email.com",
    phone: "+92 300 8899001",
    joinedOn: "May 12, 2024 03:45 PM",
    status: "Pending",
    avatar: null,
  },
];

const roleBadgeClasses: Record<UserRole, string> = {
  Agent: "bg-emerald-50 text-emerald-600",
  Employer: "bg-blue-50 text-blue-600",
  "Job Seeker": "bg-violet-50 text-violet-600",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type TabKey = "all" | "Agent" | "Employer" | "Job Seeker";

export default function UsersPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [locationFilter, setLocationFilter] = useState("");

  const itemsPerPage = 10;

  const tabCounts = useMemo(
    () => ({
      all: users.length,
      Agent: users.filter((u) => u.role === "Agent").length,
      Employer: users.filter((u) => u.role === "Employer").length,
      "Job Seeker": users.filter((u) => u.role === "Job Seeker").length,
    }),
    [],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesTab = activeTab === "all" || user.role === activeTab;

      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query);

      const matchesRole = !role || user.role === role;
      const matchesStatus = !status || user.status === status;

      return matchesTab && matchesSearch && matchesRole && matchesStatus;
    });
  }, [activeTab, search, role, status]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const resetFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setLocationFilter("");
    setPage(1);
  };

  const columns: AdminTableColumn<UserRow>[] = [
    {
      key: "select",
      label: "",
      width: "36px",
      render: () => (
        <input
          type="checkbox"
          onClick={(event) => event.stopPropagation()}
          className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
        />
      ),
    },
    {
      key: "index",
      label: "#",
      width: "36px",
      render: (_user, index) => (
        <span className="text-gray-400">
          {(page - 1) * itemsPerPage + index + 1}
        </span>
      ),
    },
    {
      key: "name",
      label: "User",
      width: "20%",
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
              {getInitials(user.name)}
            </span>
          )}

          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-gray-800">
              {user.name}
            </p>
            <p className="truncate text-[10px] text-gray-400">
              {user.company}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <span
          className={[
            "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium",
            roleBadgeClasses[user.role],
          ].join(" ")}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "contact",
      label: "Contact Info",
      render: (user) => (
        <div className="min-w-0">
          <p className="truncate text-gray-600">{user.email}</p>
          <p className="mt-0.5 text-[10px] text-gray-400">{user.phone}</p>
        </div>
      ),
    },
    {
      key: "joinedOn",
      label: "Joined On",
      render: (user) => (
        <span className="whitespace-nowrap text-[11px] text-gray-400">
          {user.joinedOn}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user) => <StatusBadge status={user.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (user) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="View User"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EyeIcon />
          </button>

          <Link
            href={`/admin/users/${user.id}/edit`}
            aria-label="Edit User"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <EditIcon />
          </Link>

          <button
            type="button"
            aria-label="Delete User"
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
        title="Users / Agents Management"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Users" },
          { label: "All Users" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportUsers(filteredUsers)}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <DownloadIcon />
              Export
            </button>

            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <PlusIcon />
              Add New User
            </button>
          </div>
        }
      />

      <AddUserModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Users"
          value={users.length}
          trend="+12.5%"
          icon={<UsersGroupIcon />}
          iconClassName="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="Agents"
          value={tabCounts.Agent}
          trend="+18.3%"
          icon={<AgentIcon />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          label="Employers"
          value={tabCounts.Employer}
          trend="+7.1%"
          icon={<BuildingIcon />}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          label="Job Seekers"
          value={tabCounts["Job Seeker"]}
          trend="+10.2%"
          icon={<PeopleIcon />}
          iconClassName="bg-violet-50 text-violet-600"
        />
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="min-w-0 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200">
            {[
              { key: "all" as TabKey, label: `All Users (${tabCounts.all})` },
              { key: "Agent" as TabKey, label: `Agents (${tabCounts.Agent})` },
              { key: "Employer" as TabKey, label: `Employers (${tabCounts.Employer})` },
              { key: "Job Seeker" as TabKey, label: `Job Seekers (${tabCounts["Job Seeker"]})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setPage(1);
                }}
                className={[
                  "shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-[12px] font-semibold transition-colors",
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-800",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + filters row */}
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
                placeholder="Search by name, email, phone..."
                className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  setPage(1);
                }}
                className="h-10 min-w-[120px] rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
              >
                <option value="">All Roles</option>
                <option value="Agent">Agent</option>
                <option value="Employer">Employer</option>
                <option value="Job Seeker">Job Seeker</option>
              </select>

              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="h-10 min-w-[120px] rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>

              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={[
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-[11px] font-semibold transition-colors",
                  showFilters
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary",
                ].join(" ")}
              >
                <FilterIcon />
                Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <AdminTable
            columns={columns}
            data={paginatedUsers}
            rowKey={(user) => user.id}
            emptyMessage="No users match your filters."
          />

          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
          />
        </div>

        {/* Filters side panel */}
        {showFilters && (
          <aside className="h-fit rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
              <h2 className="text-[13px] font-semibold text-gray-800">Filters</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setShowFilters(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Search
                </label>
                <div className="relative">
                  <SearchIcon small />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Name, email or phone..."
                    className="h-9 w-full rounded-md border border-gray-200 bg-white pl-8 pr-3 text-[11px] text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
                >
                  <option value="">All Roles</option>
                  <option value="Agent">Agent</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Joined Date
                </label>
                <button
                  type="button"
                  className="flex h-9 w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-left text-[11px] text-gray-400 transition-colors hover:border-primary"
                >
                  <CalendarIcon />
                  Select date range
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
                >
                  <option value="">All Locations</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setPage(1)}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <FilterIcon />
                Apply Filters
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-gray-200 text-[12px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
              >
                <ResetIcon />
                Reset Filters
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  trend,
  icon,
  iconClassName,
}: {
  label: string;
  value: number;
  trend: string;
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
        <p className="mt-1.5 text-[9px] font-medium text-emerald-600">
          ↑ {trend}
          <span className="ml-1 font-normal text-gray-400">
            from last month
          </span>
        </p>
      </div>
    </div>
  );
}

function exportUsers(data: UserRow[]) {
  const headers = ["Name", "Company", "Role", "Email", "Phone", "Joined On", "Status"];

  const rows = data.map((user) => [
    user.name,
    user.company,
    user.role,
    user.email,
    user.phone,
    user.joinedOn,
    user.status,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "users.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
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

function AgentIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5l8-3 8 3v16" />
      <path d="M8 9h1M8 13h1M8 17h1M15 9h1M15 13h1M15 17h1M10 21v-4h4v4" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="9" r="2.6" />
      <circle cx="16" cy="9" r="2.6" />
      <path d="M3 19c.5-3 2.3-4.5 5-4.5S12.5 16 13 19M11 19c.5-3 2.3-4.5 5-4.5s4.5 1.5 5 4.5" />
    </svg>
  );
}

function SearchIcon({ small }: { small?: boolean }) {
  return (
    <svg
      className={[
        "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
        small ? "h-3.5 w-3.5" : "h-4 w-4",
      ].join(" ")}
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

function FilterIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16M7 12h10M10 19h4" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
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
