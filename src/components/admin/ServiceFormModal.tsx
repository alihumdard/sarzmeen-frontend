"use client";

import { useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import {
  SERVICE_ICONS,
  type Service,
  type ServiceIcon,
  type ServiceInput,
  type ServiceStatus,
} from "@/types/service";

type ServiceFormModalProps = {
  open: boolean;
  onClose: () => void;
  service?: Service | null;
  onSubmit: (input: ServiceInput) => Promise<void>;
};

/** What each icon key draws, so the picker reads as more than a slug. */
const ICON_LABELS: Record<ServiceIcon, string> = {
  handshake: "Handshake — dealing, negotiation",
  document: "Document — plans, paperwork",
  search: "Search — SEO, marketing",
  globe: "Globe — websites, online",
  camera: "Camera — photography, tours",
  chart: "Chart — advisory, analysis",
};

const emptyForm: ServiceInput = {
  slug: "",
  title: "",
  outcome: "",
  summary: "",
  points: [""],
  icon: "handshake",
  status: "published",
  featured: false,
  position: 0,
};

/** Turns a title into the URL-safe slug the API expects. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export default function ServiceFormModal({
  open,
  onClose,
  service,
  onSubmit,
}: ServiceFormModalProps) {
  const isEdit = Boolean(service);

  const [form, setForm] = useState<ServiceInput>(
    service
      ? {
          slug: service.slug,
          title: service.title,
          outcome: service.outcome,
          summary: service.summary,
          /* Always leave one empty line to type into. */
          points: service.points.length ? service.points : [""],
          icon: service.icon,
          status: service.status,
          featured: service.featured,
          position: service.position,
        }
      : emptyForm,
  );
  /*
   * An edit keeps its published slug, since changing it would break any link
   * already pointing at the service.
   */
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ServiceInput>(
    key: K,
    value: ServiceInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      // Follow the title until the slug is edited by hand.
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  }

  function updatePoint(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      points: prev.points.map((p, i) => (i === index ? value : p)),
    }));
  }

  function addPoint() {
    setForm((prev) => ({ ...prev, points: [...prev.points, ""] }));
  }

  function removePoint(index: number) {
    setForm((prev) => {
      const next = prev.points.filter((_, i) => i !== index);
      return { ...prev, points: next.length ? next : [""] };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;

    const points = form.points.map((p) => p.trim()).filter(Boolean);

    if (!form.title.trim() || !form.summary.trim()) {
      setError("Title and summary are required.");
      return;
    }
    if (!form.slug.trim()) {
      setError("A slug is required. It is filled in from the title.");
      return;
    }
    if (points.length === 0) {
      setError("List at least one thing the client receives.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSubmit({
        ...form,
        slug: form.slug.trim(),
        title: form.title.trim(),
        outcome: form.outcome.trim(),
        summary: form.summary.trim(),
        points,
      });
      onClose();
    } catch (err: unknown) {
      /* The API says why it refused — a duplicate slug, a field over its limit. */
      const e = err as Error & { errors?: Record<string, string[]> };
      const fieldMessages = e.errors
        ? Array.from(new Set(Object.values(e.errors).flat()))
        : [];
      setError(
        fieldMessages.join(" ") ||
          e.message ||
          "Could not save the service. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Service" : "Add New Service"}
      description={
        isEdit
          ? "Update how this service appears on the Services page."
          : "Add a service to the public Services page."
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
            form="service-form"
            disabled={saving}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Service"}
          </button>
        </div>
      }
    >
      <form id="service-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
            Title<span className="ml-0.5 text-red-500">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Property Dealing"
            className={adminInputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
            Slug<span className="ml-0.5 text-red-500">*</span>
          </label>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", e.target.value);
            }}
            placeholder="property-dealing"
            className={adminInputClass}
          />
          <p className="mt-1 text-[10.5px] text-gray-400">
            Lowercase letters, numbers and hyphens. Filled in from the title.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
            Outcome
          </label>
          <input
            value={form.outcome}
            onChange={(e) => update("outcome", e.target.value)}
            placeholder="e.g. From first viewing to transfer"
            className={adminInputClass}
          />
          <p className="mt-1 text-[10.5px] text-gray-400">
            The short line in the green pill above the description.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
            Summary<span className="ml-0.5 text-red-500">*</span>
          </label>
          <textarea
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            rows={3}
            placeholder="One or two sentences describing the service."
            className={adminTextareaClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
            What the client gets<span className="ml-0.5 text-red-500">*</span>
          </label>

          <div className="space-y-2">
            {form.points.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={point}
                  onChange={(e) => updatePoint(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                  className={adminInputClass}
                />
                <button
                  type="button"
                  onClick={() => removePoint(index)}
                  aria-label={`Remove point ${index + 1}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPoint}
            className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 px-3 text-[11px] font-semibold text-gray-600 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add point
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
              Icon
            </label>
            <select
              value={form.icon}
              onChange={(e) => update("icon", e.target.value as ServiceIcon)}
              className={adminSelectClass}
            >
              {SERVICE_ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {ICON_LABELS[icon]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                update("status", e.target.value as ServiceStatus)
              }
              className={adminSelectClass}
            >
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
              Order
            </label>
            <input
              type="number"
              min={0}
              value={form.position}
              onChange={(e) => update("position", Number(e.target.value) || 0)}
              className={adminInputClass}
            />
            <p className="mt-1 text-[10.5px] text-gray-400">
              Lower numbers come first on the page.
            </p>
          </div>

          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2.5 pb-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-[12px] font-medium text-gray-700">
                Featured
              </span>
            </label>
          </div>
        </div>
      </form>
    </AdminModal>
  );
}
