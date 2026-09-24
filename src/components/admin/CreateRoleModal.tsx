"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminInputClass, adminSelectClass } from "@/components/admin/AdminFormField";

type CreateRoleModalProps = {
  open: boolean;
  onClose: () => void;
};

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Name, description",
  },
  {
    id: 2,
    title: "Permissions",
    description: "Module access rights",
  },
  {
    id: 3,
    title: "Additional Settings",
    description: "Status and options",
  },
];

type PermissionAction = {
  key: string;
  label: string;
};

type ModuleDefinition = {
  key: string;
  label: string;
  iconClassName: string;
  icon: React.ReactNode;
  actions: PermissionAction[];
  defaults: string[];
};

const modules: ModuleDefinition[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    iconClassName: "bg-blue-50 text-blue-600",
    icon: <DashboardIcon />,
    actions: [
      { key: "view", label: "View Dashboard" },
      { key: "analytics", label: "View Analytics" },
    ],
    defaults: ["view"],
  },
  {
    key: "properties",
    label: "Properties",
    iconClassName: "bg-emerald-50 text-emerald-600",
    icon: <PropertyIcon />,
    actions: [
      { key: "view", label: "View Properties" },
      { key: "edit", label: "Add / Edit Properties" },
      { key: "delete", label: "Delete Properties" },
    ],
    defaults: ["view", "edit"],
  },
  {
    key: "projects",
    label: "Projects",
    iconClassName: "bg-violet-50 text-violet-600",
    icon: <ProjectIcon />,
    actions: [
      { key: "view", label: "View Projects" },
      { key: "edit", label: "Add / Edit Projects" },
      { key: "delete", label: "Delete Projects" },
    ],
    defaults: ["view", "edit"],
  },
  {
    key: "locations",
    label: "Locations",
    iconClassName: "bg-red-50 text-red-500",
    icon: <LocationIcon />,
    actions: [
      { key: "view", label: "View Locations" },
      { key: "edit", label: "Add / Edit Locations" },
      { key: "delete", label: "Delete Locations" },
    ],
    defaults: ["view", "edit"],
  },
  {
    key: "agents",
    label: "Agents",
    iconClassName: "bg-orange-50 text-orange-600",
    icon: <AgentIcon />,
    actions: [
      { key: "view", label: "View Agents" },
      { key: "edit", label: "Add / Edit Agents" },
      { key: "delete", label: "Delete Agents" },
    ],
    defaults: ["view"],
  },
  {
    key: "inquiries",
    label: "Inquiries",
    iconClassName: "bg-blue-50 text-blue-600",
    icon: <InquiryIcon />,
    actions: [
      { key: "view", label: "View Inquiries" },
      { key: "manage", label: "Manage Inquiries" },
      { key: "export", label: "Export Inquiries" },
    ],
    defaults: ["view", "manage"],
  },
  {
    key: "blogs",
    label: "Blogs",
    iconClassName: "bg-violet-50 text-violet-600",
    icon: <BlogIcon />,
    actions: [
      { key: "view", label: "View Blogs" },
      { key: "edit", label: "Add / Edit Blogs" },
      { key: "delete", label: "Delete Blogs" },
    ],
    defaults: [],
  },
  {
    key: "media",
    label: "Media Library",
    iconClassName: "bg-emerald-50 text-emerald-600",
    icon: <MediaIcon />,
    actions: [
      { key: "view", label: "View Media" },
      { key: "edit", label: "Upload / Edit Media" },
      { key: "delete", label: "Delete Media" },
    ],
    defaults: [],
  },
  {
    key: "settings",
    label: "Settings",
    iconClassName: "bg-gray-100 text-gray-600",
    icon: <SettingsIcon />,
    actions: [
      { key: "view", label: "View Settings" },
      { key: "edit", label: "Edit Settings" },
      { key: "seo", label: "Manage SEO" },
    ],
    defaults: [],
  },
];

function buildDefaultPermissions() {
  return modules.reduce<Record<string, string[]>>((acc, mod) => {
    acc[mod.key] = [...mod.defaults];
    return acc;
  }, {});
}

export default function CreateRoleModal({
  open,
  onClose,
}: CreateRoleModalProps) {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState(
    "Can manage properties, projects, locations and view inquiries. Cannot access user management or system settings.",
  );
  const [permissions, setPermissions] = useState(buildDefaultPermissions);

  const handleClose = () => {
    setStep(1);
    setPermissions(buildDefaultPermissions());
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const isLastStep = step === steps.length;

  const goNext = () => {
    if (isLastStep) {
      handleClose();
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length));
  };

  const goBack = () => {
    if (step === 1) {
      handleClose();
      return;
    }
    setStep((s) => Math.max(s - 1, 1));
  };

  const toggleAction = (moduleKey: string, actionKey: string) => {
    setPermissions((current) => {
      const active = current[moduleKey] ?? [];
      const next = active.includes(actionKey)
        ? active.filter((a) => a !== actionKey)
        : [...active, actionKey];
      return { ...current, [moduleKey]: next };
    });
  };

  const selectAll = () => {
    setPermissions(
      modules.reduce<Record<string, string[]>>((acc, mod) => {
        acc[mod.key] = mod.actions.map((a) => a.key);
        return acc;
      }, {}),
    );
  };

  const deselectAll = () => {
    setPermissions(
      modules.reduce<Record<string, string[]>>((acc, mod) => {
        acc[mod.key] = [];
        return acc;
      }, {}),
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={handleClose}
        className="absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-role-title"
        className="relative flex h-[min(760px,92vh)] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldIcon />
            </span>

            <div>
              <h2 id="create-role-title" className="text-[18px] font-bold text-gray-900">
                Create New Role
              </h2>
              <p className="mt-0.5 text-[12px] text-gray-500">
                Define a new role and set permissions for accessing different modules.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[240px_1fr]">
          {/* Steps sidebar */}
          <div className="flex min-h-0 flex-col justify-between overflow-y-auto border-b border-gray-100 bg-gray-50/60 p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:border-b-0 md:border-r">
            <div className="space-y-1">
              {steps.map((s) => {
                const active = s.id === step;
                const completed = s.id < step;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStep(s.id)}
                    className={[
                      "flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors",
                      active ? "bg-primary/10" : "hover:bg-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                        active
                          ? "bg-primary text-white"
                          : completed
                            ? "bg-primary/20 text-primary"
                            : "border border-gray-300 bg-white text-gray-400",
                      ].join(" ")}
                    >
                      {completed ? <CheckIcon /> : s.id}
                    </span>

                    <span className="min-w-0">
                      <span
                        className={[
                          "block text-[12px] font-semibold",
                          active ? "text-primary" : "text-gray-700",
                        ].join(" ")}
                      >
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-gray-400">
                        {s.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 hidden rounded-lg bg-white p-3 text-center lg:block">
              <div className="relative mx-auto mb-2 h-12 w-20">
                <Image
                  src="/images/team-1.jpg"
                  alt=""
                  fill
                  sizes="80px"
                  className="rounded-md object-cover"
                />
              </div>
              <p className="text-[11px] font-semibold text-gray-800">
                Role Based Access
              </p>
              <p className="mt-1 text-[10.5px] leading-4 text-gray-400">
                Assign specific permissions to control what users can access and manage.
              </p>
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-0 overflow-y-auto p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900">
                    Basic Information
                  </h3>
                  <p className="mt-1 text-[12px] text-gray-500">
                    Enter the basic details for this role.
                  </p>

                  <div className="mt-4 space-y-4">
                    <Field label="Role Name" required>
                      <input
                        defaultValue="Property Manager"
                        placeholder="e.g. Property Manager"
                        className={adminInputClass}
                      />
                    </Field>

                    <Field label="Description" required>
                      <textarea
                        value={description}
                        onChange={(event) =>
                          setDescription(event.target.value.slice(0, 500))
                        }
                        className="min-h-[80px] w-full resize-y rounded-md border border-gray-200 bg-white px-3 py-2.5 text-[12px] leading-5 text-gray-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                        maxLength={500}
                      />
                      <p className="mt-1 text-right text-[10px] text-gray-400">
                        {description.length}/500
                      </p>
                    </Field>
                  </div>
                </div>

                <PermissionsGrid
                  permissions={permissions}
                  onToggle={toggleAction}
                  onSelectAll={selectAll}
                  onDeselectAll={deselectAll}
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">
                  Permissions
                </h3>
                <p className="mt-1 text-[12px] text-gray-500">
                  Review and fine-tune module access rights for this role.
                </p>

                <div className="mt-5">
                  <PermissionsGrid
                    permissions={permissions}
                    onToggle={toggleAction}
                    onSelectAll={selectAll}
                    onDeselectAll={deselectAll}
                    hideHeading
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">
                  Additional Settings
                </h3>
                <p className="mt-1 text-[12px] text-gray-500">
                  Configure the status and visibility options for this role.
                </p>

                <div className="mt-5 space-y-4">
                  <Field label="Status">
                    <select defaultValue="Active" className={adminSelectClass}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </Field>

                  <Field label="Assign to Existing Users" hint="Optional — you can also assign this role later.">
                    <select defaultValue="" className={adminSelectClass}>
                      <option value="" disabled>
                        Select users
                      </option>
                      <option>Ali Raza</option>
                      <option>Sarah Khan</option>
                      <option>Usman Ahmed</option>
                    </select>
                  </Field>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] text-gray-400 sm:inline">
              Step {step} of {steps.length}
            </span>

            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              {isLastStep ? "Create Role" : "Next Step"}
              {!isLastStep && <ArrowRightIcon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PermissionsGrid({
  permissions,
  onToggle,
  onSelectAll,
  onDeselectAll,
  hideHeading,
}: {
  permissions: Record<string, string[]>;
  onToggle: (moduleKey: string, actionKey: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  hideHeading?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        {!hideHeading && (
          <div>
            <h3 className="text-[14px] font-bold text-gray-900">
              Module Permissions
            </h3>
            <p className="mt-0.5 text-[11.5px] text-gray-500">
              Select which modules and actions this role can access.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={onSelectAll}
            className="inline-flex h-8 items-center rounded-md border border-gray-200 px-3 text-[10.5px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
          >
            Select All
          </button>

          <button
            type="button"
            onClick={onDeselectAll}
            className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-[10.5px] font-semibold text-gray-500 transition-colors hover:border-gray-300"
          >
            Deselect All
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <div
            key={mod.key}
            className="rounded-lg border border-gray-200 p-3.5"
          >
            <div className="mb-2.5 flex items-center gap-2">
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  mod.iconClassName,
                ].join(" ")}
              >
                {mod.icon}
              </span>
              <span className="text-[12.5px] font-semibold text-gray-800">
                {mod.label}
              </span>
            </div>

            <div className="space-y-1.5">
              {mod.actions.map((action) => {
                const checked = permissions[mod.key]?.includes(action.key) ?? false;

                return (
                  <label
                    key={action.key}
                    className="flex cursor-pointer items-center gap-2 text-[11.5px] text-gray-600"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(mod.key, action.key)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
                    />
                    {action.label}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[10.5px] text-gray-400">{hint}</p>}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
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

function CheckIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}

function PropertyIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5M9 21v-6h6v6" />
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 20V9h8v11" />
      <path d="M8 13h8M8 16h8M10 7h4" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s6.5-5.4 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.8" r="2.4" />
    </svg>
  );
}

function AgentIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function InquiryIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3.5h10l4 4V20H5z" />
      <path d="M15 3.5V8h4M8 12h8M8 15.5h6" />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m5 17 4.5-4 3 2.5 2.5-2.5 4 4" />
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
