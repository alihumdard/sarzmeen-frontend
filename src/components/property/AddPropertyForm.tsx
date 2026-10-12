"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlusCircleIcon, UploadIcon } from "@/components/ui/Icons";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api/client";
import { listCategories, type Category } from "@/lib/api/categories";
import { listPropertyTypes, type PropertyTypeRecord } from "@/lib/api/propertyTypes";
import { listLocations, type Location } from "@/lib/api/locations";
import {
  fetchPropertySchema,
  groupsFor,
  showsCore,
  type PropertySchema,
} from "@/lib/api/propertySchema";
import SpecFieldGroup from "@/components/admin/SpecFieldGroup";
import type { SpecValue } from "@/components/admin/SpecFieldGroup";
import PaymentPlanStep from "@/components/admin/PaymentPlanStep";
import PaymentPlanCalculator from "@/components/admin/PaymentPlanCalculator";
import RichTextEditor from "@/components/admin/RichTextEditor";

const inputClasses =
  "w-full rounded-md border border-border bg-white px-4 py-3 text-[13px] text-heading outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10";

const selectClasses =
  "w-full appearance-none rounded-md border border-border bg-white px-4 py-3 text-[13px] text-heading outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10";

const PURPOSES = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
  { value: "installment", label: "On Installments" },
] as const;

const AREA_UNITS = [
  { value: "marla", label: "Marla" },
  { value: "kanal", label: "Kanal" },
  { value: "sqft", label: "Sq Ft" },
  { value: "sqyd", label: "Sq Yd" },
  { value: "sqm", label: "Sq M" },
] as const;

const CORE_NUMBERS: Array<{ key: string; label: string }> = [
  { key: "beds", label: "Bedrooms" },
  { key: "baths", label: "Bathrooms" },
  { key: "kitchens", label: "Kitchens" },
  { key: "livingRooms", label: "Living Rooms" },
  { key: "floors", label: "Floors" },
  { key: "carParking", label: "Car Parking" },
];

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-[12px] font-semibold text-heading">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

export default function AddPropertyForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeRecord[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [schema, setSchema] = useState<PropertySchema | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [propertyTypeId, setPropertyTypeId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [purpose, setPurpose] = useState("sale");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [areaValue, setAreaValue] = useState("");
  const [areaUnit, setAreaUnit] = useState("marla");
  const [coreNumbers, setCoreNumbers] = useState<Record<string, string>>({});
  const [specs, setSpecs] = useState<Record<string, SpecValue>>({});
  const [images, setImages] = useState<File[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const setSpec = (key: string, value: SpecValue) =>
    setSpecs((cur) => ({ ...cur, [key]: value }));

  const applySpecs = (patch: Record<string, string>) =>
    setSpecs((cur) => ({ ...cur, ...patch }));

  useEffect(() => {
    Promise.all([
      listCategories(),
      listPropertyTypes(),
      listLocations(),
      fetchPropertySchema(),
    ])
      .then(([cats, types, locs, sch]) => {
        setCategories(cats);
        setPropertyTypes(types);
        setLocations(locs);
        setSchema(sch);
      })
      .catch(() => setError("Failed to load form data"))
      .finally(() => setDataLoading(false));
  }, []);

  const selectedType = propertyTypes.find((t) => String(t.id) === propertyTypeId);
  const typeSlug = selectedType?.slug || "";
  const filteredTypes = categorySlug
    ? propertyTypes.filter((t) => t.category === categorySlug)
    : propertyTypes;

  const visibleGroups = schema && typeSlug ? groupsFor(schema, typeSlug, purpose) : [];
  const visibleCoreNumbers = schema && typeSlug
    ? CORE_NUMBERS.filter((f) => showsCore(schema, typeSlug, f.key))
    : [];

  if (authLoading || dataLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-white shadow-[0_12px_34px_rgba(15,35,28,0.08)]">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-center shadow-[0_12px_34px_rgba(15,35,28,0.08)]">
        <h2 className="text-[18px] font-bold text-heading">Sign In Required</h2>
        <p className="mt-2 text-[13px] text-muted">
          You need to be signed in to list a property.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
        >
          Sign In
        </button>
      </div>
    );
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
          Your property has been saved as a draft. You can edit it and submit for review from your dashboard.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => router.push("/admin/properties")}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            View My Properties
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setTitle("");
              setDescription("");
              setPropertyTypeId("");
              setLocationId("");
              setPurpose("sale");
              setPrice("");
              setNegotiable(false);
              setAreaValue("");
              setAreaUnit("marla");
              setCoreNumbers({});
              setSpecs({});
              setImages([]);
            }}
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-2.5 text-[13px] font-semibold text-heading hover:bg-surface"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const body: Record<string, unknown> = {
        title,
        description: description || undefined,
        propertyTypeId: Number(propertyTypeId),
        locationId: Number(locationId),
        purpose,
        price: Number(price),
        negotiable,
        areaValue: Number(areaValue),
        areaUnit,
        specs,
      };

      for (const { key } of visibleCoreNumbers) {
        if (coreNumbers[key]) body[key] = Number(coreNumbers[key]);
      }

      const res = await api<{ data: { id: number } }>("/my/properties", {
        method: "POST",
        body,
      });

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append("images[]", file));
        await api(`/my/properties/${res.data.id}/images`, {
          method: "POST",
          body: formData,
        });
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      setError(e.message || "Failed to submit property");
      if (e.errors) setFieldErrors(e.errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name: string) => fieldErrors[name]?.[0];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-border bg-white p-5 shadow-[0_12px_34px_rgba(15,35,28,0.08)] sm:p-6"
    >
      <div>
        <h2 className="text-[20px] font-bold text-heading">Property Details</h2>
        <p className="mt-1 text-[13px] text-muted">
          Fill in the details below. Your listing will be saved as a draft.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor="title" required>Property Title</FieldLabel>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. 1 Kanal Luxury House in DHA Phase 6"
          className={inputClasses}
        />
        {fieldError("title") && <p className="text-[11px] text-red-500">{fieldError("title")}</p>}
      </div>

      {/* Category + Type */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <select
            id="category"
            value={categorySlug}
            onChange={(e) => {
              setCategorySlug(e.target.value);
              setPropertyTypeId("");
            }}
            className={selectClasses}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="propertyTypeId" required>Property Type</FieldLabel>
          <select
            id="propertyTypeId"
            value={propertyTypeId}
            onChange={(e) => setPropertyTypeId(e.target.value)}
            required
            className={selectClasses}
          >
            <option value="">Select type</option>
            {filteredTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {fieldError("propertyTypeId") && <p className="text-[11px] text-red-500">{fieldError("propertyTypeId")}</p>}
        </div>
      </div>

      {/* Purpose + Price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <FieldLabel htmlFor="purpose" required>Purpose</FieldLabel>
          <select
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            className={selectClasses}
          >
            {PURPOSES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="price" required>Price (PKR)</FieldLabel>
          <input
            id="price"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="e.g. 12500000"
            className={inputClasses}
          />
          {fieldError("price") && <p className="text-[11px] text-red-500">{fieldError("price")}</p>}
        </div>
      </div>

      {/* Area + Unit */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <FieldLabel htmlFor="areaValue" required>Area Size</FieldLabel>
          <input
            id="areaValue"
            type="number"
            min={0}
            step="any"
            value={areaValue}
            onChange={(e) => setAreaValue(e.target.value)}
            required
            placeholder="e.g. 10"
            className={inputClasses}
          />
          {fieldError("areaValue") && <p className="text-[11px] text-red-500">{fieldError("areaValue")}</p>}
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="areaUnit" required>Area Unit</FieldLabel>
          <select
            id="areaUnit"
            value={areaUnit}
            onChange={(e) => setAreaUnit(e.target.value)}
            required
            className={selectClasses}
          >
            {AREA_UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor="locationId" required>Location</FieldLabel>
        <select
          id="locationId"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          required
          className={selectClasses}
        >
          <option value="">Select location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.parent ? `${loc.parent} › ` : ""}{loc.name}
            </option>
          ))}
        </select>
        {fieldError("locationId") && <p className="text-[11px] text-red-500">{fieldError("locationId")}</p>}
      </div>

      {/* Negotiable */}
      <label className="flex items-center gap-2 text-[13px] text-heading">
        <input
          type="checkbox"
          checked={negotiable}
          onChange={(e) => setNegotiable(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        Price is negotiable
      </label>

      {/* Core Numbers (beds, baths, etc.) */}
      {visibleCoreNumbers.length > 0 && (
        <div>
          <h3 className="mb-3 text-[14px] font-semibold text-heading">Room Details</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {visibleCoreNumbers.map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <FieldLabel htmlFor={key}>{label}</FieldLabel>
                <input
                  id={key}
                  type="number"
                  min={0}
                  max={99}
                  value={coreNumbers[key] || ""}
                  onChange={(e) => setCoreNumbers((prev) => ({ ...prev, [key]: e.target.value }))}
                  className={inputClasses}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type-specific fields */}
      {visibleGroups.length > 0 && (
        <div>
          <h3 className="mb-3 text-[14px] font-semibold text-heading">Additional Details</h3>
          {visibleGroups.map(({ name, group }) => (
            <SpecFieldGroup key={name} group={group} values={specs} onChange={setSpec} />
          ))}
        </div>
      )}

      {/* Payment Plan for installment */}
      {purpose === "installment" && (
        <div>
          <h3 className="mb-3 text-[14px] font-semibold text-heading">Payment Plan</h3>
          <div className="space-y-4 rounded-lg border border-border p-4">
            <PaymentPlanCalculator specs={specs} onChange={setSpec} onApply={applySpecs} />
            <PaymentPlanStep specs={specs} onChange={setSpec} totalPrice={Number(price) || 0} />
          </div>
        </div>
      )}

      {/* Description */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <RichTextEditor value={description} onChange={setDescription} maxLength={20000} />
      </div>

      {/* Photos */}
      <div className="space-y-2">
        <FieldLabel htmlFor="photos">Photos</FieldLabel>
        <label
          htmlFor="photos"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-surface px-4 py-6 text-center transition-colors hover:border-primary"
        >
          <UploadIcon className="h-6 w-6 text-muted" />
          <span className="text-[13px] font-semibold text-heading">
            Click to upload photos
          </span>
          <span className="text-[11px] text-muted">
            JPG, PNG or WebP — up to 20 images, 5MB each
          </span>
          <input
            id="photos"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setImages((prev) => [...prev, ...files].slice(0, 20));
              e.target.value = "";
            }}
          />
        </label>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((file, i) => (
              <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-md bg-surface">
                <Image
                  src={URL.createObjectURL(file)}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized
                />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 hidden rounded bg-red-600 p-1 text-white group-hover:block"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-1 py-0.5 text-[9px] text-white">
                  {file.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {submitting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Submitting…
          </>
        ) : (
          <>
            Submit Property
            <PlusCircleIcon className="h-[18px] w-[18px]" />
          </>
        )}
      </button>
    </form>
  );
}
