"use client";

import { useEffect, useState } from "react";
import { adminInputClass } from "@/components/admin/AdminFormField";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
};

type RoleOption = {
  key: string;
  title: string;
  description: string;
  iconClassName: string;
  icon: React.ReactNode;
};

const roleOptions: RoleOption[] = [
  {
    key: "administrator",
    title: "Administrator",
    description: "Full access to all modules and settings",
    iconClassName: "bg-amber-50 text-amber-500",
    icon: <CrownIcon />,
  },
  {
    key: "property-manager",
    title: "Property Manager",
    description: "Manage properties, projects and locations",
    iconClassName: "bg-emerald-50 text-emerald-600",
    icon: <HomeIcon />,
  },
  {
    key: "agent",
    title: "Agent",
    description: "Manage own listings and inquiries",
    iconClassName: "bg-emerald-50 text-emerald-600",
    icon: <UserIcon />,
  },
  {
    key: "employer",
    title: "Employer",
    description: "Post jobs and manage applications",
    iconClassName: "bg-blue-50 text-blue-600",
    icon: <BuildingIcon />,
  },
  {
    key: "job-seeker",
    title: "Job Seeker",
    description: "Apply for jobs and manage profile",
    iconClassName: "bg-violet-50 text-violet-600",
    icon: <PeopleIcon />,
  },
  {
    key: "content-editor",
    title: "Content Editor",
    description: "Manage blogs, pages and media",
    iconClassName: "bg-violet-50 text-violet-600",
    icon: <DocIcon />,
  },
];

export default function AddUserModal({ open, onClose }: AddUserModalProps) {
  const [role, setRole] = useState("administrator");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setRole("administrator");
    setStatus("active");
    setPassword("");
    setShowPassword(false);
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

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

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
        aria-labelledby="add-user-title"
        className="relative flex h-[min(760px,92vh)] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlusIcon />
            </span>

            <div>
              <h2 id="add-user-title" className="text-[18px] font-bold text-gray-900">
                Add New User
              </h2>
              <p className="mt-0.5 text-[12px] text-gray-500">
                Create a new user account and assign role and permissions.
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
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-2">
          {/* Basic Information */}
          <div className="min-h-0 overflow-y-auto border-b border-gray-100 p-6 md:border-b-0 md:border-r">
            <h3 className="text-[14px] font-bold text-gray-900">
              Basic Information
            </h3>
            <p className="mt-1 text-[11.5px] text-gray-500">
              Enter the user&apos;s basic details to create an account.
            </p>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name" required>
                  <input placeholder="e.g. Ali" className={adminInputClass} />
                </Field>

                <Field label="Last Name" required>
                  <input placeholder="e.g. Raza" className={adminInputClass} />
                </Field>
              </div>

              <Field label="Email Address" required>
                <div className="relative">
                  <MailIcon />
                  <input
                    type="email"
                    placeholder="e.g. ali.raza@example.com"
                    className={[adminInputClass, "pl-9"].join(" ")}
                  />
                </div>
              </Field>

              <Field label="Phone Number">
                <div className="relative">
                  <PhoneIcon />
                  <input
                    placeholder="e.g. +92 300 1234567"
                    className={[adminInputClass, "pl-9"].join(" ")}
                  />
                </div>
              </Field>

              <Field label="Password" required>
                <div className="relative">
                  <LockIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter a secure password"
                    className={[adminInputClass, "pl-9 pr-9"].join(" ")}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                  <PasswordRule met={hasMinLength} label="At least 8 characters" />
                  <PasswordRule met={hasUppercase} label="One uppercase letter" />
                  <PasswordRule met={hasNumber} label="One number" />
                </div>
              </Field>

              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
                  Status
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <StatusOption
                    label="Active"
                    description="User can log in and access the system"
                    selected={status === "active"}
                    onClick={() => setStatus("active")}
                  />
                  <StatusOption
                    label="Inactive"
                    description="Account will be disabled"
                    selected={status === "inactive"}
                    onClick={() => setStatus("inactive")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assign Role */}
          <div className="min-h-0 overflow-y-auto p-6">
            <h3 className="text-[14px] font-bold text-gray-900">
              Assign Role <span className="text-red-500">*</span>
            </h3>
            <p className="mt-1 text-[11.5px] text-gray-500">
              Select a role for this user. Permissions will be applied automatically.
            </p>

            <div className="mt-4 space-y-2">
              {roleOptions.map((option) => {
                const selected = role === option.key;

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setRole(option.key)}
                    className={[
                      "flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors",
                      selected
                        ? "border-primary/30 bg-primary/5"
                        : "border-gray-200 hover:border-gray-300",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                        selected ? "border-primary" : "border-gray-300",
                      ].join(" ")}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>

                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                        option.iconClassName,
                      ].join(" ")}
                    >
                      {option.icon}
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-semibold text-gray-800">
                        {option.title}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] text-gray-400">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2.5 rounded-lg bg-primary/5 p-3.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-primary">
                <InfoIcon />
              </span>

              <div>
                <p className="text-[11.5px] font-semibold text-gray-800">Tip</p>
                <p className="mt-0.5 text-[10.5px] leading-4 text-gray-500">
                  You can customize role permissions later from Roles &amp; Permissions section.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <UserPlusIcon small />
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <span
      className={[
        "flex items-center gap-1.5 text-[10.5px]",
        met ? "text-emerald-600" : "text-gray-400",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-3.5 w-3.5 items-center justify-center rounded-full",
          met ? "bg-emerald-100" : "bg-gray-100",
        ].join(" ")}
      >
        <CheckIcon />
      </span>
      {label}
    </span>
  );
}

function StatusOption({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
        selected ? "border-primary/30 bg-primary/5" : "border-gray-200 hover:border-gray-300",
      ].join(" ")}
    >
      <span
        className={[
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary" : "border-gray-300",
        ].join(" ")}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>

      <span className="min-w-0">
        <span className="block text-[12px] font-semibold text-gray-800">
          {label}
        </span>
        <span className="mt-0.5 block text-[10px] leading-4 text-gray-400">
          {description}
        </span>
      </span>
    </button>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function UserPlusIcon({ small }: { small?: boolean }) {
  return (
    <svg className={small ? "h-3.5 w-3.5" : "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M18 8v6M21 11h-6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5 6.1 1.5 1.5 0 0 1 6.5 3.5Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="10" width="15" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (!open) {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A9.9 9.9 0 0 1 12 5c6 0 9.5 6 9.5 6a15.6 15.6 0 0 1-3.1 3.8M6.8 6.8C4 8.6 2.5 11 2.5 11s3.5 6 9.5 6c1.2 0 2.3-.2 3.3-.6" />
      <path d="M9.9 10a2.5 2.5 0 0 0 3.6 3.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 8 4 3 5-6 5 6 4-3-1.5 10h-15L3 8Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5M9 21v-6h6v6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
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

function PeopleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="9" r="2.6" />
      <circle cx="16" cy="9" r="2.6" />
      <path d="M3 19c.5-3 2.3-4.5 5-4.5S12.5 16 13 19M11 19c.5-3 2.3-4.5 5-4.5s4.5 1.5 5 4.5" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14v18H5z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  );
}
