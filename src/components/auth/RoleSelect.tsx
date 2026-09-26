"use client";

import { useState } from "react";
import AuthField from "@/components/auth/AuthField";
import { BuildingIcon, UserCircleIcon, UsersIcon } from "@/components/ui/Icons";

type Role = "user" | "agent" | "agency";

const roles: { value: Role; label: string; hint: string; Icon: typeof UserCircleIcon }[] = [
  {
    value: "user",
    label: "User",
    hint: "Buy or rent a property",
    Icon: UserCircleIcon,
  },
  {
    value: "agent",
    label: "Agent",
    hint: "List and sell properties",
    Icon: UsersIcon,
  },
  {
    value: "agency",
    label: "Agency",
    hint: "Register your firm and team",
    Icon: BuildingIcon,
  },
];

/**
 * Account-type picker plus the fields that only apply to the chosen type.
 *
 * The selected role posts as a hidden `role` input so the surrounding
 * server-rendered form submits it like any other field once the API exists.
 */
export default function RoleSelect() {
  const [role, setRole] = useState<Role>("user");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[12px] font-semibold text-heading">
          I am registering as
        </p>

        <div
          role="radiogroup"
          aria-label="Account type"
          className="mt-2 grid grid-cols-3 gap-2"
        >
          {roles.map(({ value, label, hint, Icon }) => {
            const isActive = role === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setRole(value)}
                className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center transition-colors ${
                  isActive
                    ? "border-primary bg-primary-light"
                    : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted"}`}
                />
                <span
                  className={`text-[13px] font-semibold ${
                    isActive ? "text-primary" : "text-heading"
                  }`}
                >
                  {label}
                </span>
                <span className="text-[10.5px] leading-tight text-muted">
                  {hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <input type="hidden" name="role" value={role} />

      {/* Agency registration needs the firm's own details. */}
      {role === "agency" && (
        <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-4">
          <p className="text-[12px] font-semibold text-heading">
            Agency Details
          </p>

          <AuthField
            label="Agency Name"
            name="agencyName"
            type="text"
            placeholder="Enter your agency name"
            icon="user"
            autoComplete="organization"
            required
          />

          <AuthField
            label="Office Address"
            name="officeAddress"
            type="text"
            placeholder="Office number, area, city"
            icon="user"
            autoComplete="street-address"
            required
          />
        </div>
      )}

      {/* An agent joins an existing agency, so we only need which one. */}
      {role === "agent" && (
        <div className="rounded-lg border border-border bg-surface p-4">
          <AuthField
            label="Agency Name"
            name="agencyName"
            type="text"
            placeholder="Which agency do you work for?"
            icon="user"
            autoComplete="organization"
            required
          />
          <p className="mt-2 text-[11px] text-muted">
            Your agency owner will be asked to confirm you as a team member.
          </p>
        </div>
      )}
    </div>
  );
}
