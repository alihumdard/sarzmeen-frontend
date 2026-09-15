"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PlusCircleIcon, UploadIcon } from "@/components/ui/Icons";
import Dropdown from "@/components/ui/Dropdown";
import {
  areaOptions,
  locations,
  propertyTypes,
} from "@/constants/searchOptions";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-[12px] font-semibold text-heading">
      {children}
    </label>
  );
}

const inputClasses =
  "w-full rounded-md border border-border bg-white px-4 py-3 text-[13px] text-heading outline-none transition-colors placeholder:text-muted focus:border-primary";

/**
 * "List Your Property" form reached from the header's Sell menu.
 *
 * V1 has no submission API yet — this only validates and shows a
 * confirmation message, matching the other forms in the app (contact,
 * newsletter) until the Laravel backend exists.
 */
export default function AddPropertyForm() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState(initialType);
  const [area, setArea] = useState("");
  const [size, setSize] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-center shadow-[0_12px_34px_rgba(15,35,28,0.08)] sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
          <PlusCircleIcon className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-[20px] font-bold text-heading">
          Property Submitted
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
          Thanks for listing with Sarzameen.com. Our team reviews every
          submission and publishes it within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-white p-5 shadow-[0_12px_34px_rgba(15,35,28,0.08)] sm:p-6"
    >
      <h2 className="text-[20px] font-bold text-heading">
        Property Details
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        Tell us about your property — our team verifies every listing before
        it goes live.
      </p>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <FieldLabel htmlFor="title">Property Title</FieldLabel>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. 1 Kanal Luxury House in DHA Phase 6"
            className={inputClasses}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="type">Property Type</FieldLabel>
            <Dropdown
              name="type"
              required
              label="Property Type"
              placeholder="Select property type"
              options={propertyTypes}
              value={type}
              onChange={setType}
              triggerClassName={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="city">City</FieldLabel>
            <input
              id="city"
              name="city"
              type="text"
              value="Lahore"
              readOnly
              disabled
              className={`${inputClasses} cursor-not-allowed bg-surface text-muted`}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="area">Area / Society</FieldLabel>
            <Dropdown
              name="area"
              required
              label="Area / Society"
              placeholder="Select area"
              options={locations}
              value={area}
              onChange={setArea}
              triggerClassName={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="size">Plot / Covered Area</FieldLabel>
            <Dropdown
              name="size"
              required
              label="Plot / Covered Area"
              placeholder="Select size"
              options={areaOptions}
              value={size}
              onChange={setSize}
              triggerClassName={inputClasses}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="price">Asking Price (PKR)</FieldLabel>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              required
              placeholder="e.g. 12500000"
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="phone">Contact Number</FieldLabel>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="03XX XXXXXXX"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            placeholder="Describe the property — condition, features, nearby landmarks..."
            className={`${inputClasses} resize-y`}
          />
        </div>

        <div className="space-y-2">
          <span className="text-[12px] font-semibold text-heading">
            Photos
          </span>
          <label
            htmlFor="photos"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-surface px-4 py-8 text-center transition-colors hover:border-primary"
          >
            <UploadIcon className="h-6 w-6 text-muted" />
            <span className="text-[13px] font-semibold text-heading">
              Click to upload photos
            </span>
            <span className="text-[11px] text-muted">
              PNG or JPG, up to 10 images
            </span>
            <input id="photos" name="photos" type="file" accept="image/*" multiple className="sr-only" />
          </label>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Submit Property
          <PlusCircleIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </form>
  );
}
