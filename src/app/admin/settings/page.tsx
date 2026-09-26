"use client";

import { useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminFormField, {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import StatusBadge from "@/components/admin/StatusBadge";

type TabKey =
  | "general"
  | "system"
  | "email"
  | "seo"
  | "appearance"
  | "audit";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "general", label: "General Settings", icon: <SettingsIcon /> },
  { key: "system", label: "System Settings", icon: <ServerIcon /> },
  { key: "email", label: "Email Settings", icon: <MailIcon /> },
  { key: "seo", label: "SEO Settings", icon: <SeoIcon /> },
  { key: "appearance", label: "Appearance", icon: <PaletteIcon /> },
  { key: "audit", label: "Audit Logs", icon: <AuditIcon /> },
];

type LogEntry = {
  id: number;
  date: string;
  user: string;
  role: string;
  action: "Created" | "Updated" | "Deleted" | "Login" | "Failed Login";
  module: string;
  details: string;
  ip: string;
  status: "Success" | "Failed";
  icon: "doc" | "edit" | "trash" | "user" | "location" | "login" | "building" | "quote" | "settings" | "alert";
};

const logs: LogEntry[] = [
  {
    id: 1,
    date: "May 20, 2024 10:30:45 AM",
    user: "Admin",
    role: "Super Admin",
    action: "Updated",
    module: "Properties",
    details: 'Updated property "5 Marla House"',
    ip: "192.168.1.10",
    status: "Success",
    icon: "doc",
  },
  {
    id: 2,
    date: "May 20, 2024 09:15:22 AM",
    user: "Sarah Khan",
    role: "Admin",
    action: "Created",
    module: "Blog",
    details: 'Created new blog post "Real Estate Market Trends"',
    ip: "192.168.1.15",
    status: "Success",
    icon: "edit",
  },
  {
    id: 3,
    date: "May 19, 2024 06:42:11 PM",
    user: "Usman Ahmed",
    role: "Editor",
    action: "Deleted",
    module: "Media",
    details: 'Deleted image "banner-old.jpg"',
    ip: "192.168.1.22",
    status: "Success",
    icon: "trash",
  },
  {
    id: 4,
    date: "May 19, 2024 03:20:33 PM",
    user: "Ayesha Malik",
    role: "Agent",
    action: "Updated",
    module: "Agent",
    details: "Updated agent profile",
    ip: "192.168.1.18",
    status: "Success",
    icon: "user",
  },
  {
    id: 5,
    date: "May 18, 2024 11:10:05 AM",
    user: "Bilal Khan",
    role: "Admin",
    action: "Created",
    module: "Location",
    details: 'Added new location "DHA Lahore"',
    ip: "192.168.1.12",
    status: "Success",
    icon: "location",
  },
  {
    id: 6,
    date: "May 18, 2024 09:45:19 AM",
    user: "System",
    role: "System",
    action: "Login",
    module: "Authentication",
    details: "User login successful",
    ip: "192.168.1.10",
    status: "Success",
    icon: "login",
  },
  {
    id: 7,
    date: "May 17, 2024 05:30:27 PM",
    user: "Zainab Fatima",
    role: "Admin",
    action: "Updated",
    module: "Project",
    details: 'Updated project "Bahria Town Karachi"',
    ip: "192.168.1.20",
    status: "Success",
    icon: "building",
  },
  {
    id: 8,
    date: "May 17, 2024 02:14:33 PM",
    user: "Ahmad Ali",
    role: "Editor",
    action: "Created",
    module: "Testimonial",
    details: "Added new testimonial",
    ip: "192.168.1.16",
    status: "Success",
    icon: "quote",
  },
  {
    id: 9,
    date: "May 16, 2024 11:05:18 AM",
    user: "Admin",
    role: "Super Admin",
    action: "Updated",
    module: "Settings",
    details: "Updated site settings",
    ip: "192.168.1.10",
    status: "Success",
    icon: "settings",
  },
  {
    id: 10,
    date: "May 15, 2024 09:22:44 AM",
    user: "Unknown",
    role: "-",
    action: "Failed Login",
    module: "Authentication",
    details: "Invalid login attempt",
    ip: "192.168.1.200",
    status: "Failed",
    icon: "alert",
  },
];

const actionBadgeVariant: Record<
  LogEntry["action"],
  "success" | "info" | "danger" | "neutral"
> = {
  Created: "success",
  Updated: "info",
  Deleted: "danger",
  Login: "neutral",
  "Failed Login": "danger",
};

function getInitials(name: string) {
  if (name === "Admin") return "A";
  if (name === "System" || name === "Unknown") return "";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("audit");
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [user, setUser] = useState("");
  const [module, setModule] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const userOptions = useMemo(
    () => Array.from(new Set(logs.map((log) => log.user))),
    [],
  );

  const moduleOptions = useMemo(
    () => Array.from(new Set(logs.map((log) => log.module))),
    [],
  );

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !query ||
        log.user.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.module.toLowerCase().includes(query);

      const matchesAction = !action || log.action === action;
      const matchesUser = !user || log.user === user;
      const matchesModule = !module || log.module === module;

      return matchesSearch && matchesAction && matchesUser && matchesModule;
    });
  }, [search, action, user, module]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const activeTabLabel = tabs.find((tab) => tab.key === activeTab)?.label ?? "";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings & Audit"
        breadcrumbs={[
          { label: "Settings" },
          { label: activeTabLabel },
        ]}
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-[12px] font-semibold transition-colors",
              activeTab === tab.key
                ? "bg-primary/10 text-primary"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
            ].join(" ")}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "audit" ? (
        <>
          {/* Stats */}
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <SummaryCard
              label="Total Logs"
              value="2,458"
              trend="+12.5%"
              icon={<DocIcon />}
              iconClassName="bg-primary/10 text-primary"
            />
            <SummaryCard
              label="Admin Actions"
              value="1,124"
              trend="+8.3%"
              icon={<UserIcon />}
              iconClassName="bg-blue-50 text-blue-600"
            />
            <SummaryCard
              label="Security Events"
              value="86"
              trend="+15.6%"
              icon={<ShieldIcon />}
              iconClassName="bg-violet-50 text-violet-600"
            />
            <SummaryCard
              label="Failed Attempts"
              value="24"
              trend="+4.2%"
              negative
              icon={<AlertIcon />}
              iconClassName="bg-red-50 text-red-600"
            />
          </section>

          {/* Filters */}
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] xl:flex-row xl:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={action}
                onChange={(event) => {
                  setAction(event.target.value);
                  setPage(1);
                }}
                className="h-10 min-w-[130px] rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
              >
                <option value="">All Actions</option>
                <option value="Created">Created</option>
                <option value="Updated">Updated</option>
                <option value="Deleted">Deleted</option>
                <option value="Login">Login</option>
                <option value="Failed Login">Failed Login</option>
              </select>

              <select
                value={user}
                onChange={(event) => {
                  setUser(event.target.value);
                  setPage(1);
                }}
                className="h-10 min-w-[130px] rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
              >
                <option value="">All Users</option>
                {userOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <select
                value={module}
                onChange={(event) => {
                  setModule(event.target.value);
                  setPage(1);
                }}
                className="h-10 min-w-[130px] rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
              >
                <option value="">All Modules</option>
                {moduleOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
              >
                <CalendarIcon />
                May 01, 2024 - May 31, 2024
              </button>
            </div>

            <div className="relative min-w-0 flex-1">
              <SearchIcon />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search logs (user, action, module, details...)"
                className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <DownloadIcon />
              Export Logs
            </button>
          </div>

          {/* Log table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="w-10 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      Date &amp; Time
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      User
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      Action
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      Module
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      Details
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      IP Address
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      Status
                    </th>
                    <th className="w-10 px-3 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="transition-colors hover:bg-gray-50/70">
                      <td className="px-4 py-3.5">
                        <span
                          className={[
                            "flex h-7 w-7 items-center justify-center rounded-md",
                            log.status === "Failed"
                              ? "bg-red-50 text-red-500"
                              : "bg-primary/10 text-primary",
                          ].join(" ")}
                        >
                          <LogTypeIcon name={log.icon} />
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-[11px] text-gray-500">
                        {log.date}
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {getInitials(log.user) ? (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                              {getInitials(log.user)}
                            </span>
                          ) : (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                              <UserIcon small />
                            </span>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-semibold text-gray-800">
                              {log.user}
                            </p>
                            <p className="text-[10px] text-gray-400">{log.role}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5">
                        <StatusBadge
                          status={log.action}
                          variant={actionBadgeVariant[log.action]}
                        />
                      </td>

                      <td className="px-3 py-3.5 text-[12px] text-gray-600">
                        {log.module}
                      </td>

                      <td className="px-3 py-3.5">
                        <span className="block max-w-[220px] text-[12px] text-gray-500">
                          {log.details}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-[11px] text-gray-400">
                        {log.ip}
                      </td>

                      <td className="px-3 py-3.5">
                        <StatusBadge
                          status={log.status}
                          variant={log.status === "Success" ? "success" : "danger"}
                        />
                      </td>

                      <td className="px-3 py-3.5 text-right">
                        <button
                          type="button"
                          aria-label="More actions"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        >
                          <MoreIcon />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {paginatedLogs.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-14 text-center text-[12px] text-gray-400">
                        No log entries match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        <SettingsForm tab={activeTab} />
      )}
    </div>
  );
}

function SettingsForm({ tab }: { tab: TabKey }) {
  if (tab === "general") {
    return (
      <SettingsPanel title="General Settings" description="Basic information about your platform.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Site Name" name="siteName">
            <input id="siteName" defaultValue="Sarzameen" className={adminInputClass} />
          </AdminFormField>

          <AdminFormField label="Support Email" name="supportEmail">
            <input id="supportEmail" defaultValue="support@sarzameen.com" className={adminInputClass} />
          </AdminFormField>

          <AdminFormField label="Contact Phone" name="phone">
            <input id="phone" defaultValue="+92 300 1234567" className={adminInputClass} />
          </AdminFormField>

          <AdminFormField label="Timezone" name="timezone">
            <select id="timezone" defaultValue="Asia/Karachi" className={adminSelectClass}>
              <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
              <option value="UTC">UTC</option>
            </select>
          </AdminFormField>

          <AdminFormField label="Site Description" name="description" className="sm:col-span-2">
            <textarea
              id="description"
              defaultValue="Pakistan's trusted real estate marketplace."
              className={adminTextareaClass}
            />
          </AdminFormField>
        </div>

        <SaveBar />
      </SettingsPanel>
    );
  }

  if (tab === "system") {
    return (
      <SettingsPanel title="System Settings" description="Environment and platform-level configuration.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Default Currency" name="currency">
            <select id="currency" defaultValue="PKR" className={adminSelectClass}>
              <option value="PKR">PKR — Pakistani Rupee</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </AdminFormField>

          <AdminFormField label="Date Format" name="dateFormat">
            <select id="dateFormat" defaultValue="MMM D, YYYY" className={adminSelectClass}>
              <option value="MMM D, YYYY">MMM D, YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            </select>
          </AdminFormField>

          <AdminFormField label="Items Per Page" name="perPage">
            <input id="perPage" type="number" defaultValue={10} className={adminInputClass} />
          </AdminFormField>

          <AdminFormField label="Maintenance Mode" name="maintenance">
            <select id="maintenance" defaultValue="off" className={adminSelectClass}>
              <option value="off">Off</option>
              <option value="on">On</option>
            </select>
          </AdminFormField>
        </div>

        <SaveBar />
      </SettingsPanel>
    );
  }

  if (tab === "email") {
    return (
      <SettingsPanel title="Email Settings" description="Outgoing mail server configuration.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="SMTP Host" name="smtpHost">
            <input id="smtpHost" defaultValue="smtp.mailgun.org" className={adminInputClass} />
          </AdminFormField>

          <AdminFormField label="SMTP Port" name="smtpPort">
            <input id="smtpPort" defaultValue="587" className={adminInputClass} />
          </AdminFormField>

          <AdminFormField label="From Name" name="fromName">
            <input id="fromName" defaultValue="Sarzameen" className={adminInputClass} />
          </AdminFormField>

          <AdminFormField label="From Email" name="fromEmail">
            <input id="fromEmail" defaultValue="noreply@sarzameen.com" className={adminInputClass} />
          </AdminFormField>
        </div>

        <SaveBar />
      </SettingsPanel>
    );
  }

  if (tab === "seo") {
    return (
      <SettingsPanel title="SEO Settings" description="Default meta tags for search engines.">
        <div className="grid grid-cols-1 gap-4">
          <AdminFormField label="Meta Title" name="metaTitle">
            <input id="metaTitle" defaultValue="Sarzameen — Your Property, Our Priority" className={adminInputClass} />
          </AdminFormField>

          <AdminFormField label="Meta Description" name="metaDescription">
            <textarea
              id="metaDescription"
              defaultValue="Find verified properties, projects and real estate investment opportunities across Pakistan."
              className={adminTextareaClass}
            />
          </AdminFormField>

          <AdminFormField label="Meta Keywords" name="metaKeywords" hint="Comma separated">
            <input
              id="metaKeywords"
              defaultValue="real estate, property, Pakistan, plots, houses"
              className={adminInputClass}
            />
          </AdminFormField>
        </div>

        <SaveBar />
      </SettingsPanel>
    );
  }

  return (
    <SettingsPanel title="Appearance" description="Customize the look and feel of your platform.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminFormField label="Primary Color" name="primaryColor">
          <div className="flex items-center gap-2">
            <input
              id="primaryColor"
              type="color"
              defaultValue="#1f7a4d"
              className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
            />
            <input defaultValue="#1f7a4d" className={adminInputClass} />
          </div>
        </AdminFormField>

        <AdminFormField label="Theme Mode" name="themeMode">
          <select id="themeMode" defaultValue="light" className={adminSelectClass}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </AdminFormField>
      </div>

      <SaveBar />
    </SettingsPanel>
  );
}

function SettingsPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="mb-5 border-b border-gray-100 pb-4">
        <h2 className="text-[14px] font-semibold text-gray-800">{title}</h2>
        <p className="mt-0.5 text-[11px] text-gray-400">{description}</p>
      </div>

      {children}
    </div>
  );
}

function SaveBar() {
  return (
    <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        <SaveIcon />
        Save Changes
      </button>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  trend,
  negative,
  icon,
  iconClassName,
}: {
  label: string;
  value: string;
  trend: string;
  negative?: boolean;
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
          {value}
        </p>
        <p
          className={[
            "mt-1.5 text-[9px] font-medium",
            negative ? "text-red-500" : "text-emerald-600",
          ].join(" ")}
        >
          ↑ {trend}
          <span className="ml-1 font-normal text-gray-400">
            from last month
          </span>
        </p>
      </div>
    </div>
  );
}

function LogTypeIcon({ name }: { name: LogEntry["icon"] }) {
  const common = {
    className: "h-3.5 w-3.5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "doc":
      return (
        <svg {...common}>
          <path d="M6 2h9l3 3v17H6z" />
          <path d="M15 2v3h3" />
        </svg>
      );
    case "edit":
      return (
        <svg {...common}>
          <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case "location":
      return (
        <svg {...common}>
          <path d="M12 21s6.5-5.4 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
          <circle cx="12" cy="10.8" r="2.4" />
        </svg>
      );
    case "login":
      return (
        <svg {...common}>
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <path d="M10 17l5-5-5-5M15 12H3" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 20V9h8v11" />
        </svg>
      );
    case "quote":
      return (
        <svg {...common}>
          <path d="M6 5.5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1H15V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6H21a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5M12 16h.01" />
        </svg>
      );
    default:
      return null;
  }
}

function UserIcon({ small }: { small?: boolean }) {
  return (
    <svg className={small ? "h-4 w-4" : "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h9l3 3v17H6z" />
      <path d="M15 2v3h3" />
      <path d="M9 13h6M9 17h4" />
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

function AlertIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5M12 16h.01" />
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

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
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

function MoreIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M8 4v5h7V4M8 20v-6h8v6" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1H15V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6H21a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function SeoIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4M8 10.5h5M10.5 8v5" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2H17a4 4 0 0 0 4-4c0-4.4-4-7.4-9-7.4Z" />
      <circle cx="7.5" cy="10.5" r="1" />
      <circle cx="10.5" cy="7" r="1" />
      <circle cx="15" cy="7.5" r="1" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h9l3 3v17H6z" />
      <path d="M15 2v3h3" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}
