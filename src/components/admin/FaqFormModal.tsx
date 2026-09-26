"use client";

import { useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import type { Faq, FaqInput, FaqStatus } from "@/types/faq";

type FaqFormModalProps = {
  open: boolean;
  onClose: () => void;
  /** Passed when editing; omitted when creating. */
  faq?: Faq | null;
  /** Categories already in use, offered in the dropdown alongside a free-text option. */
  categories: string[];
  onSubmit: (input: FaqInput) => Promise<void>;
};

const emptyForm: FaqInput = {
  question: "",
  answer: "",
  category: "General",
  status: "published",
  order: 1,
};

export default function FaqFormModal({
  open,
  onClose,
  faq,
  categories,
  onSubmit,
}: FaqFormModalProps) {
  const isEdit = Boolean(faq);

  // Seeded from props on mount. The parent remounts this component per
  // open via `key`, so there is no effect syncing props into state.
  const [form, setForm] = useState<FaqInput>(
    faq
      ? {
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          status: faq.status,
          order: faq.order,
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FaqInput>(key: K, value: FaqInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;

    if (!form.question.trim() || !form.answer.trim()) {
      setError("Both the question and the answer are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSubmit({
        ...form,
        question: form.question.trim(),
        answer: form.answer.trim(),
        category: form.category.trim() || "General",
      });
      onClose();
    } catch {
      setError("Could not save the FAQ. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit FAQ" : "Add New FAQ"}
      description={
        isEdit
          ? "Update this question and answer."
          : "Add a question that visitors commonly ask."
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
            form="faq-form"
            disabled={saving}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create FAQ"}
          </button>
        </div>
      }
    >
      <form id="faq-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-600">
            {error}
          </p>
        )}

        <Field label="Question" required>
          <input
            value={form.question}
            onChange={(event) => update("question", event.target.value)}
            placeholder="e.g. How can I list my property on Sarzameen.com?"
            className={adminInputClass}
          />
        </Field>

        <Field label="Answer" required>
          <textarea
            rows={4}
            value={form.answer}
            onChange={(event) => update("answer", event.target.value)}
            placeholder="Write the answer visitors will see…"
            className={adminTextareaClass}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category" hint="Groups related questions together.">
            <input
              list="faq-categories"
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
              placeholder="e.g. Buying"
              className={adminInputClass}
            />
            <datalist id="faq-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(event) =>
                update("status", event.target.value as FaqStatus)
              }
              className={adminSelectClass}
            >
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </select>
          </Field>
        </div>

        <Field
          label="Display Order"
          hint="Lower numbers show first on the public page."
        >
          <input
            type="number"
            min={1}
            value={form.order}
            onChange={(event) =>
              update("order", Number(event.target.value) || 1)
            }
            className={adminInputClass}
          />
        </Field>
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
