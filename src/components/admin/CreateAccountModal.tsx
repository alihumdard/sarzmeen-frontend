"use client";

import { useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { createAccount } from "@/lib/api/accountUsers";
import type { AccountRole } from "@/types/accountUser";

type CreateAccountModalProps = {
  open: boolean;
  onClose: () => void;
  /** The page this was opened from, which fixes the role being created. */
  role: AccountRole;
  /** "Agent", "Agency", "User", "Admin" — used throughout the copy. */
  noun: string;
  onCreated: () => void;
};

/**
 * Creates an account from the admin panel.
 *
 * The only way in before this was the public register page, which leaves
 * agents and agencies pending — so an admin adding a colleague had to ask
 * them to sign up first and then approve them. Accounts made here are
 * approved immediately.
 */
export default function CreateAccountModal({
  open,
  onClose,
  role,
  noun,
  onCreated,
}: CreateAccountModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [title, setTitle] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setCity("");
    setAgencyName("");
    setTitle("");
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSave() {
    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email and password are required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createAccount({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        agencyName: role === "agency" ? agencyName.trim() || name.trim() : undefined,
        title: role === "agent" ? title.trim() || undefined : undefined,
      });

      reset();
      onCreated();
      onClose();
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      const messages = e.errors
        ? Array.from(new Set(Object.values(e.errors).flat()))
        : [];
      setError(messages.join(" ") || e.message || "Could not create the account.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title={`Add New ${noun}`}
      description={`Creates an approved ${noun.toLowerCase()} account — they can sign in straight away.`}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Creating..." : `Create ${noun}`}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium leading-relaxed text-red-700">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" required>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Ahmed Raza"
              className={inputClass}
            />
          </Field>

          <Field label="Email Address" required>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" required hint="At least 8 characters.">
            <input
              type="text"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Share this with them"
              className={inputClass}
            />
          </Field>

          <Field label="Phone">
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="03001234567"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City">
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Lahore"
              className={inputClass}
            />
          </Field>

          {role === "agency" && (
            <Field label="Agency Name" hint="Defaults to the full name.">
              <input
                value={agencyName}
                onChange={(event) => setAgencyName(event.target.value)}
                placeholder="e.g. Oracle Estates"
                className={inputClass}
              />
            </Field>
          )}

          {role === "agent" && (
            <Field label="Job Title">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Sales Agent"
                className={inputClass}
              />
            </Field>
          )}
        </div>
      </div>
    </AdminModal>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-gray-200 px-3 text-[12px] outline-none focus:border-primary";

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
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
