"use client";

import { useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import type {
  AdminTestimonial,
  TestimonialInput,
  TestimonialStatus,
} from "@/types/testimonial";

type TestimonialFormModalProps = {
  open: boolean;
  onClose: () => void;
  /** Passed when editing; omitted when creating. */
  testimonial?: AdminTestimonial | null;
  onSubmit: (input: TestimonialInput) => Promise<void>;
};

const DEFAULT_AVATAR = "/images/team-1.jpg";

const emptyForm: TestimonialInput = {
  name: "",
  city: "",
  avatar: DEFAULT_AVATAR,
  rating: 5,
  purchase: "",
  quote: "",
  status: "published",
  featured: false,
};

export default function TestimonialFormModal({
  open,
  onClose,
  testimonial,
  onSubmit,
}: TestimonialFormModalProps) {
  const isEdit = Boolean(testimonial);

  // Seeded from props on mount. The parent remounts this component per
  // open via `key`, so there is no effect syncing props into state.
  const [form, setForm] = useState<TestimonialInput>(
    testimonial
      ? {
          name: testimonial.name,
          city: testimonial.city,
          avatar: testimonial.avatar,
          rating: testimonial.rating,
          purchase: testimonial.purchase,
          quote: testimonial.quote,
          status: testimonial.status,
          featured: testimonial.featured,
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof TestimonialInput>(
    key: K,
    value: TestimonialInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;

    if (!form.name.trim() || !form.quote.trim()) {
      setError("Name and quote are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        city: form.city.trim(),
        purchase: form.purchase.trim(),
        quote: form.quote.trim(),
        avatar: form.avatar.trim() || DEFAULT_AVATAR,
      });
      onClose();
    } catch {
      setError("Could not save the testimonial. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Testimonial" : "Add New Testimonial"}
      description={
        isEdit
          ? "Update this review's details."
          : "Add a client review to show on the home page."
      }
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="testimonial-form"
            disabled={saving}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Testimonial"}
          </button>
        </div>
      }
    >
      <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-600">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Client Name" required>
            <input
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="e.g. Mubashir Ali"
              className={adminInputClass}
            />
          </Field>

          <Field label="City">
            <input
              value={form.city}
              onChange={(event) => update("city", event.target.value)}
              placeholder="e.g. Lahore"
              className={adminInputClass}
            />
          </Field>
        </div>

        <Field label="Purchase / Deal" hint="Shown above the quote as context.">
          <input
            value={form.purchase}
            onChange={(event) => update("purchase", event.target.value)}
            placeholder="e.g. Bought a 1 Kanal House in DHA Phase 6"
            className={adminInputClass}
          />
        </Field>

        <Field label="Quote" required>
          <textarea
            rows={4}
            value={form.quote}
            onChange={(event) => update("quote", event.target.value)}
            placeholder="What the client said…"
            className={adminTextareaClass}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Rating">
            <select
              value={form.rating}
              onChange={(event) =>
                update("rating", Number(event.target.value))
              }
              className={adminSelectClass}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} Star{value !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(event) =>
                update("status", event.target.value as TestimonialStatus)
              }
              className={adminSelectClass}
            >
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </select>
          </Field>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => update("featured", event.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
          />
          <span className="text-[12px] leading-relaxed text-gray-600">
            Feature this testimonial
            <span className="block text-[11px] text-gray-400">
              Featured reviews appear first on the home page.
            </span>
          </span>
        </label>
      </form>
    </AdminModal>
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
      <label className="text-[12px] font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
