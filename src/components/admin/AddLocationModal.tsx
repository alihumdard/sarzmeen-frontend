"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";

type AddLocationModalProps = {
  open: boolean;
  onClose: () => void;
};

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Name, type, parent location",
  },
  {
    id: 2,
    title: "Additional Details",
    description: "Description, status",
  },
  {
    id: 3,
    title: "Map & Media",
    description: "Location map, image",
  },
  {
    id: 4,
    title: "SEO & Settings",
    description: "Meta, featured",
  },
];

export default function AddLocationModal({
  open,
  onClose,
}: AddLocationModalProps) {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  const handleClose = () => {
    setStep(1);
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
        aria-labelledby="add-location-title"
        className="relative flex h-[min(720px,92vh)] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PinIcon />
            </span>

            <div>
              <h2 id="add-location-title" className="text-[18px] font-bold text-gray-900">
                Add New Location
              </h2>
              <p className="mt-0.5 text-[12px] text-gray-500">
                Fill in the details below to add a new location (city, area or society).
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
                const stepActive = s.id === step;
                const completed = s.id < step;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStep(s.id)}
                    className={[
                      "flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors",
                      stepActive ? "bg-primary/10" : "hover:bg-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                        stepActive
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
                          stepActive ? "text-primary" : "text-gray-700",
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
                  src="/images/city-1.jpg"
                  alt=""
                  fill
                  sizes="80px"
                  className="rounded-md object-cover"
                />
              </div>
              <p className="text-[11px] font-semibold text-gray-800">
                Build Better Communities
              </p>
              <p className="mt-1 text-[10.5px] leading-4 text-gray-400">
                Add locations to organize your properties and projects efficiently.
              </p>
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-0 overflow-y-auto p-6">
            {step === 1 && (
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">
                  Basic Information
                </h3>
                <p className="mt-1 text-[12px] text-gray-500">
                  Enter the essential details about this location.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Location Name" required>
                      <input
                        placeholder="e.g. Lahore, DHA, Bahria Town"
                        className={adminInputClass}
                      />
                    </Field>

                    <Field label="Location Type" required>
                      <select defaultValue="" className={adminSelectClass}>
                        <option value="" disabled>
                          Select Type
                        </option>
                        <option>City</option>
                        <option>Area</option>
                        <option>Society</option>
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Parent Location" hint="Leave empty if this is a main city.">
                      <select defaultValue="" className={adminSelectClass}>
                        <option value="" disabled>
                          Select Parent Location
                        </option>
                        <option>Lahore</option>
                        <option>Karachi</option>
                        <option>Islamabad</option>
                      </select>
                    </Field>

                    <Field
                      label="Short Name / Slug"
                      required
                      hint="Used in URL (auto-generated if left empty)."
                    >
                      <input placeholder="e.g. lahore" className={adminInputClass} />
                    </Field>
                  </div>

                  <Field label="Description">
                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value.slice(0, 500))
                      }
                      placeholder="Write a short description about this location..."
                      className={adminTextareaClass}
                      maxLength={500}
                    />
                    <p className="mt-1 text-right text-[10px] text-gray-400">
                      {description.length}/500
                    </p>
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ToggleField
                      label="Status"
                      checked={active}
                      onChange={setActive}
                      activeLabel="Active"
                      inactiveLabel="Inactive"
                      hint="Inactive locations will not be shown on the website."
                    />

                    <ToggleField
                      label="Featured"
                      checked={featured}
                      onChange={setFeatured}
                      activeLabel="Mark as featured"
                      inactiveLabel="Mark as featured"
                      hint="Featured locations may appear on homepage."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <StepPlaceholder
                title="Additional Details"
                description="Add more context and set the visibility status."
              >
                <Field label="Full Description">
                  <textarea
                    placeholder="Describe this location in detail..."
                    className={adminTextareaClass}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Properties Count">
                    <input placeholder="e.g. 120" className={adminInputClass} />
                  </Field>
                  <Field label="Projects Count">
                    <input placeholder="e.g. 8" className={adminInputClass} />
                  </Field>
                </div>
              </StepPlaceholder>
            )}

            {step === 3 && (
              <StepPlaceholder
                title="Map & Media"
                description="Set the map position and upload a cover image."
              >
                <Field label="Google Maps Link">
                  <input placeholder="https://maps.google.com/..." className={adminInputClass} />
                </Field>

                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center">
                  <div>
                    <UploadIcon />
                    <p className="mt-2 text-[12px] font-medium text-gray-600">
                      Drag and drop a cover image here, or click to browse
                    </p>
                    <p className="mt-1 text-[10.5px] text-gray-400">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </StepPlaceholder>
            )}

            {step === 4 && (
              <StepPlaceholder
                title="SEO & Settings"
                description="Meta information and homepage visibility."
              >
                <Field label="Meta Title">
                  <input placeholder="e.g. Properties in Lahore" className={adminInputClass} />
                </Field>

                <Field label="Meta Description">
                  <textarea placeholder="Short SEO description..." className={adminTextareaClass} />
                </Field>
              </StepPlaceholder>
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
              {isLastStep ? "Save Location" : "Next Step"}
              {!isLastStep && <ArrowRightIcon />}
            </button>
          </div>
        </div>
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

function ToggleField({
  label,
  checked,
  onChange,
  activeLabel,
  inactiveLabel,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  activeLabel: string;
  inactiveLabel: string;
  hint: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
        {label}
      </label>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={() => onChange(!checked)}
          className={[
            "relative h-5 w-9 shrink-0 rounded-full transition-colors",
            checked ? "bg-primary" : "bg-gray-200",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
              checked ? "translate-x-[18px]" : "translate-x-0.5",
            ].join(" ")}
          />
        </button>

        <span className="text-[12px] text-gray-700">
          {checked ? activeLabel : inactiveLabel}
        </span>
      </div>

      <p className="mt-1 text-[10.5px] text-gray-400">{hint}</p>
    </div>
  );
}

function StepPlaceholder({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-[12px] text-gray-500">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
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

function PinIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s6.5-5.4 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.8" r="2.4" />
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

function UploadIcon() {
  return (
    <svg className="mx-auto h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4" />
      <path d="m7 8 5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
