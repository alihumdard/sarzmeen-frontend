"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Name, type, location",
  },
  {
    id: 2,
    title: "Project Details",
    description: "Units, description, features",
  },
  {
    id: 3,
    title: "Media & Gallery",
    description: "Images, brochure, video",
  },
  {
    id: 4,
    title: "Amenities & Features",
    description: "Facilities and highlights",
  },
  {
    id: 5,
    title: "SEO & Settings",
    description: "Meta, status, featured",
  },
];

export default function AddProjectForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");

  /** Leaving the form returns to the listing page. */
  const handleClose = () => router.push("/admin/projects");

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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Body. On a page the columns grow with their content instead of
          scrolling inside a fixed-height dialog. */}
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
          {/* Steps sidebar */}
          <div className="flex flex-col justify-between border-b border-gray-100 bg-gray-50/60 p-4 md:border-b-0 md:border-r">
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
                  src="/images/project-1.jpg"
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
                Add detailed project information to attract more buyers and investors.
              </p>
            </div>
          </div>

          {/* Step content */}
          <div className="p-6">
            {step === 1 && (
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">
                  Basic Information
                </h3>
                <p className="mt-1 text-[12px] text-gray-500">
                  Enter the essential details about the project.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Project Name" required>
                      <input
                        placeholder="e.g. Lahore Smart City"
                        className={adminInputClass}
                      />
                    </Field>

                    <Field label="Project Type" required>
                      <select defaultValue="" className={adminSelectClass}>
                        <option value="" disabled>
                          Select Project Type
                        </option>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Mixed Use</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Location" required>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <select defaultValue="" className={adminSelectClass}>
                        <option value="" disabled>
                          Select City
                        </option>
                        <option>Lahore</option>
                        <option>Karachi</option>
                        <option>Islamabad</option>
                      </select>

                      <select defaultValue="" className={adminSelectClass}>
                        <option value="" disabled>
                          Select Area
                        </option>
                        <option>DHA</option>
                        <option>Gulberg</option>
                        <option>Bahria Town</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-primary hover:underline"
                    >
                      <PinIcon />
                      Add New Location
                    </button>
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Developer / Builder" required>
                      <input
                        placeholder="e.g. DHA, Bahria Town, Private Developer"
                        className={adminInputClass}
                      />
                    </Field>

                    <Field label="Total Units" required>
                      <input placeholder="e.g. 5200" className={adminInputClass} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Price Range (PKR)">
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="From" className={adminInputClass} />
                        <input placeholder="To" className={adminInputClass} />
                      </div>
                    </Field>

                    <Field label="Project Status" required>
                      <select defaultValue="" className={adminSelectClass}>
                        <option value="" disabled>
                          Select Status
                        </option>
                        <option>Active</option>
                        <option>Upcoming</option>
                        <option>Completed</option>
                        <option>On Hold</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Short Description" required>
                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value.slice(0, 500))
                      }
                      placeholder="Write a brief description about the project..."
                      className={adminTextareaClass}
                      maxLength={500}
                    />
                    <p className="mt-1 text-right text-[10px] text-gray-400">
                      {description.length}/500
                    </p>
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <StepPlaceholder
                title="Project Details"
                description="Add unit breakdown, features and a full description."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Residential Units">
                    <input placeholder="e.g. 3800" className={adminInputClass} />
                  </Field>
                  <Field label="Commercial Units">
                    <input placeholder="e.g. 1400" className={adminInputClass} />
                  </Field>
                  <Field label="Possession Year">
                    <input placeholder="e.g. 2027" className={adminInputClass} />
                  </Field>
                </div>

                <Field label="Full Description">
                  <textarea
                    placeholder="Describe the project in detail..."
                    className={adminTextareaClass}
                  />
                </Field>
              </StepPlaceholder>
            )}

            {step === 3 && (
              <StepPlaceholder
                title="Media & Gallery"
                description="Upload images, brochure and a project video."
              >
                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center">
                  <div>
                    <UploadIcon />
                    <p className="mt-2 text-[12px] font-medium text-gray-600">
                      Drag and drop images here, or click to browse
                    </p>
                    <p className="mt-1 text-[10.5px] text-gray-400">
                      PNG, JPG up to 10MB each
                    </p>
                  </div>
                </div>

                <Field label="Brochure (PDF)">
                  <input type="file" accept=".pdf" className={adminInputClass} />
                </Field>

                <Field label="Project Video URL">
                  <input placeholder="https://youtube.com/..." className={adminInputClass} />
                </Field>
              </StepPlaceholder>
            )}

            {step === 4 && (
              <StepPlaceholder
                title="Amenities & Features"
                description="Highlight the facilities available in this project."
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    "Parks",
                    "Mosque",
                    "School",
                    "Hospital",
                    "Community Center",
                    "Security",
                    "Underground Electricity",
                    "Wide Roads",
                    "Commercial Zone",
                  ].map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-[11.5px] text-gray-600"
                    >
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </StepPlaceholder>
            )}

            {step === 5 && (
              <StepPlaceholder
                title="SEO & Settings"
                description="Meta information, listing status and visibility."
              >
                <Field label="Meta Title">
                  <input
                    placeholder="e.g. Lahore Smart City — Project Overview"
                    className={adminInputClass}
                  />
                </Field>

                <Field label="Meta Description">
                  <textarea placeholder="Short SEO description..." className={adminTextareaClass} />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Status">
                    <select defaultValue="Draft" className={adminSelectClass}>
                      <option>Draft</option>
                      <option>Published</option>
                    </select>
                  </Field>

                  <Field label="Featured Project">
                    <select defaultValue="No" className={adminSelectClass}>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </Field>
                </div>
              </StepPlaceholder>
            )}
          </div>
        </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
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
            {isLastStep ? "Publish Project" : "Next Step"}
            {!isLastStep && <ArrowRightIcon />}
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

function PinIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s6.5-5.4 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.8" r="2.4" />
    </svg>
  );
}
