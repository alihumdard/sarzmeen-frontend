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
    description: "Title, type, price, location",
  },
  {
    id: 2,
    title: "Property Details",
    description: "Features, size, description",
  },
  {
    id: 3,
    title: "Media & Gallery",
    description: "Images and videos",
  },
  {
    id: 4,
    title: "Additional Info",
    description: "Amenities, maps, documents",
  },
  {
    id: 5,
    title: "SEO & Settings",
    description: "Meta, status, featured",
  },
];

export default function AddPropertyForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<"sale" | "rent">("sale");
  const [description, setDescription] = useState("");

  /** Leaving the form returns to the listing page. */
  const handleClose = () => router.push("/admin/properties");

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
                  src="/images/property-1.jpg"
                  alt=""
                  fill
                  sizes="80px"
                  className="rounded-md object-cover"
                />
              </div>
              <p className="text-[11px] font-semibold text-gray-800">
                List Better Properties
              </p>
              <p className="mt-1 text-[10.5px] leading-4 text-gray-400">
                High quality listings get more views and leads.
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
                  Add the essential details about the property.
                </p>

                <div className="mt-5 space-y-4">
                  <Field label="Property Title" required>
                    <input
                      placeholder="e.g. Luxury 5 Marla House in DHA Lahore"
                      className={adminInputClass}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Property Type" required>
                      <select defaultValue="House" className={adminSelectClass}>
                        <option>House</option>
                        <option>Apartment</option>
                        <option>Plot</option>
                        <option>Commercial</option>
                      </select>
                    </Field>

                    <Field label="Purpose" required>
                      <div className="flex items-center gap-2">
                        <PurposeOption
                          label="For Sale"
                          selected={purpose === "sale"}
                          onClick={() => setPurpose("sale")}
                        />
                        <PurposeOption
                          label="For Rent"
                          selected={purpose === "rent"}
                          onClick={() => setPurpose("rent")}
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Price (PKR)" required>
                      <input placeholder="e.g. 8,500,000" className={adminInputClass} />
                    </Field>

                    <Field label="Bedrooms">
                      <input placeholder="e.g. 3" className={adminInputClass} />
                    </Field>

                    <Field label="Bathrooms">
                      <input placeholder="e.g. 3" className={adminInputClass} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Area (Marla / Kanal / Sq Ft)" required>
                      <input placeholder="e.g. 5 Marla" className={adminInputClass} />
                    </Field>

                    <Field label="Location" required>
                      <div className="grid grid-cols-2 gap-2">
                        <select defaultValue="Lahore" className={adminSelectClass}>
                          <option>Lahore</option>
                          <option>Karachi</option>
                          <option>Islamabad</option>
                        </select>
                        <select defaultValue="DHA" className={adminSelectClass}>
                          <option>DHA</option>
                          <option>Gulberg</option>
                          <option>Bahria Town</option>
                        </select>
                      </div>
                    </Field>
                  </div>

                  <Field label="Address / Society">
                    <input placeholder="e.g. DHA Phase 6, Lahore" className={adminInputClass} />
                  </Field>

                  <Field label="Short Description" required>
                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value.slice(0, 250))
                      }
                      placeholder="Write a brief description about the property..."
                      className={adminTextareaClass}
                      maxLength={250}
                    />
                    <p className="mt-1 text-right text-[10px] text-gray-400">
                      {description.length}/250
                    </p>
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <StepPlaceholder
                title="Property Details"
                description="Add features, size details and a full description."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Floors">
                    <input placeholder="e.g. 2" className={adminInputClass} />
                  </Field>
                  <Field label="Parking Spaces">
                    <input placeholder="e.g. 2" className={adminInputClass} />
                  </Field>
                  <Field label="Year Built">
                    <input placeholder="e.g. 2022" className={adminInputClass} />
                  </Field>
                </div>

                <Field label="Full Description">
                  <textarea
                    placeholder="Describe the property in detail..."
                    className={adminTextareaClass}
                  />
                </Field>
              </StepPlaceholder>
            )}

            {step === 3 && (
              <StepPlaceholder
                title="Media & Gallery"
                description="Upload images and videos for this listing."
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
              </StepPlaceholder>
            )}

            {step === 4 && (
              <StepPlaceholder
                title="Additional Info"
                description="Amenities, map location and supporting documents."
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {["Parking", "Gas", "Electricity", "Water Supply", "Security", "Lawn"].map(
                    (amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-[11.5px] text-gray-600"
                      >
                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40" />
                        {amenity}
                      </label>
                    ),
                  )}
                </div>

                <Field label="Google Maps Link">
                  <input placeholder="https://maps.google.com/..." className={adminInputClass} />
                </Field>
              </StepPlaceholder>
            )}

            {step === 5 && (
              <StepPlaceholder
                title="SEO & Settings"
                description="Meta information, listing status and visibility."
              >
                <Field label="Meta Title">
                  <input placeholder="e.g. 5 Marla House for Sale in DHA Lahore" className={adminInputClass} />
                </Field>

                <Field label="Meta Description">
                  <textarea placeholder="Short SEO description..." className={adminTextareaClass} />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Status">
                    <select defaultValue="Draft" className={adminSelectClass}>
                      <option>Draft</option>
                      <option>Published</option>
                      <option>Pending</option>
                    </select>
                  </Field>

                  <Field label="Featured Listing">
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
            {isLastStep ? "Publish Property" : "Next Step"}
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

function PurposeOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-10 flex-1 items-center justify-center gap-2 rounded-md border text-[12px] font-medium transition-colors",
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-gray-200 text-gray-500 hover:border-gray-300",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-4 w-4 items-center justify-center rounded-full border-2",
          selected ? "border-primary" : "border-gray-300",
        ].join(" ")}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
      {label}
    </button>
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
