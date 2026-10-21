"use client";

import { prepareImages } from "@/lib/utils/resizeImage";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { api } from "@/lib/api/client";
import { cachedGet } from "@/lib/api/taxonomyCache";
import {
  fetchPropertySchema,
  groupsFor,
  showsCore,
  type PropertySchema,
} from "@/lib/api/propertySchema";
import SpecFieldGroup, { type SpecValue } from "@/components/admin/SpecFieldGroup";
import PaymentPlanStep from "@/components/admin/PaymentPlanStep";
import PaymentPlanCalculator from "@/components/admin/PaymentPlanCalculator";
// TipTap is heavy and sits in a later step, so it loads on demand.
const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] animate-pulse rounded-lg border border-gray-200 bg-gray-50" />
    ),
  },
);
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";

type PropertyType = { id: string; name: string; slug: string; category: string };
type Category = { id: string; name: string; slug: string };
type Location = { id: string; name: string; slug: string; type: string; parent: string | null };

type StepKey = "basic" | "details" | "plan" | "media" | "seo";

const ALL_STEPS: Array<{ key: StepKey; title: string; description: string }> = [
  { key: "basic", title: "Basic Information", description: "Category, type, price, location" },
  { key: "details", title: "Property Details", description: "Fields for the chosen type" },
  { key: "plan", title: "Payment Plan", description: "Instalments and schedule" },
  { key: "media", title: "Media & Gallery", description: "Images" },
  { key: "seo", title: "SEO & Settings", description: "Meta description" },
];

const PURPOSES = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
  { value: "installment", label: "On Installments" },
] as const;

const CORE_NUMBERS: Array<{ key: string; label: string }> = [
  { key: "beds", label: "Bedrooms" },
  { key: "baths", label: "Bathrooms" },
  { key: "kitchens", label: "Kitchens" },
  { key: "livingRooms", label: "Living Rooms" },
  { key: "floors", label: "Floors" },
  { key: "carParking", label: "Car Parking" },
];

export default function AddPropertyForm() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const [schema, setSchema] = useState<PropertySchema | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // Cascade: category narrows the type list, type + purpose drive the fields.
  const [categorySlug, setCategorySlug] = useState("");
  const [typeId, setTypeId] = useState("");
  const [purpose, setPurpose] = useState<string>("sale");

  const [core, setCore] = useState<Record<string, string>>({});
  const [specs, setSpecs] = useState<Record<string, SpecValue>>({});
  const [basic, setBasic] = useState({
    title: "",
    price: "",
    areaValue: "",
    areaUnit: "marla",
    locationId: "",
    fullLocation: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageNotice, setImageNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchPropertySchema().then(setSchema).catch(() => {});
    // Cached: this taxonomy rarely changes and is refetched on every visit.
    cachedGet<{ data: Category[] }>("/categories").then((r) => setCategories(r.data)).catch(() => {});
    cachedGet<{ data: PropertyType[] }>("/property-types").then((r) => setPropertyTypes(r.data)).catch(() => {});
    cachedGet<{ data: Location[] }>("/locations").then((r) => setLocations(r.data)).catch(() => {});
  }, []);

  const typesInCategory = useMemo(
    () => propertyTypes.filter((t) => !categorySlug || t.category === categorySlug),
    [propertyTypes, categorySlug],
  );

  const selectedType = propertyTypes.find((t) => t.id === typeId);
  const typeSlug = selectedType?.slug ?? "";

  const visibleGroups = useMemo(
    () => (schema && typeSlug ? groupsFor(schema, typeSlug, purpose) : []),
    [schema, typeSlug, purpose],
  );

  const visibleCore = useMemo(
    () =>
      schema && typeSlug
        ? CORE_NUMBERS.filter((f) => showsCore(schema, typeSlug, f.key))
        : [],
    [schema, typeSlug],
  );

  const showsFurnishing = schema && typeSlug ? showsCore(schema, typeSlug, "furnishing") : false;
  const showsCondition = schema && typeSlug ? showsCore(schema, typeSlug, "propertyCondition") : false;

  // The payment-plan step only exists for instalment listings.
  const steps = useMemo(
    () => ALL_STEPS.filter((s) => s.key !== "plan" || purpose === "installment"),
    [purpose],
  );
  const current = steps[Math.min(stepIndex, steps.length - 1)];

  // Switching away from instalments removes a step, so pull the cursor back
  // rather than leaving it past the end.
  useEffect(() => {
    setStepIndex((i) => Math.min(i, steps.length - 1));
  }, [steps.length]);

  // Payment-plan fields are rendered by their own step, not inline with the
  // type's groups, so filter that group out of the details step.
  const detailGroups = useMemo(
    () => visibleGroups.filter(({ name }) => name !== "paymentPlan"),
    [visibleGroups],
  );

  const totalPrice = Number(basic.price.replace(/,/g, "")) || 0;

  /** Changing category invalidates the chosen type and everything below it. */
  const handleCategoryChange = (slug: string) => {
    setCategorySlug(slug);
    setTypeId("");
    setCore({});
    setSpecs({});
  };

  /** A new type means a different field set, so drop values that no longer apply. */
  const handleTypeChange = (id: string) => {
    setTypeId(id);
    setCore({});
    setSpecs({});
  };

  const setSpec = (key: string, value: SpecValue) =>
    setSpecs((cur) => ({ ...cur, [key]: value }));

  const applySpecs = (patch: Record<string, string>) =>
    setSpecs((cur) => ({ ...cur, ...patch }));

  const priceLabel =
    purpose === "rent" ? "Monthly Rent (PKR)" : purpose === "installment" ? "Total Price (PKR)" : "Price (PKR)";

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setError("");
    setFieldErrors({});

    const body = new FormData();
    body.append("title", basic.title);
    body.append("propertyTypeId", typeId);
    body.append("purpose", purpose);
    body.append("price", String(Number(basic.price.replace(/,/g, "")) || 0));
    body.append("areaValue", basic.areaValue || "0");
    body.append("areaUnit", basic.areaUnit);
    body.append("locationId", basic.locationId);
    if (basic.fullLocation) body.append("fullLocation", basic.fullLocation);
    if (basic.description) body.append("description", basic.description);
    if (basic.metaTitle) body.append("metaTitle", basic.metaTitle);
    if (basic.metaDescription) body.append("metaDescription", basic.metaDescription);

    Object.entries(core).forEach(([k, v]) => {
      if (v !== "") body.append(k, v);
    });

    Object.entries(specs).forEach(([k, v]) => {
      if (v === "" || v === undefined || v === null) return;
      if (Array.isArray(v)) {
        v.forEach((item) => body.append(`specs[${k}][]`, item));
      } else {
        body.append(`specs[${k}]`, typeof v === "boolean" ? (v ? "1" : "0") : String(v));
      }
    });

    images.forEach((file) => body.append("images[]", file));

    try {
      await api("/my/properties", {
        method: "POST",
        body: body as unknown as Record<string, unknown>,
      });
      router.push("/admin/properties");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errors" in err) {
        setFieldErrors((err as { errors: Record<string, string[]> }).errors ?? {});
      }
      setError(err instanceof Error ? err.message : "Failed to create property");
      setStepIndex(0);
    } finally {
      setSubmitting(false);
    }
  }, [basic, core, specs, images, typeId, purpose, router]);

  const isLastStep = stepIndex >= steps.length - 1;
  const canLeaveStepOne = Boolean(typeId && basic.title && basic.locationId);

  const goNext = () => {
    if (current.key === "basic" && !canLeaveStepOne) {
      setError("Choose a category, type, title and location first.");
      return;
    }
    setError("");
    if (isLastStep) {
      handleSubmit();
      return;
    }
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => {
    if (stepIndex === 0) {
      router.push("/admin/properties");
      return;
    }
    setStepIndex((s) => Math.max(s - 1, 0));
  };

  const firstError = Object.values(fieldErrors).flat()[0];
  const cities = locations.filter((l) => l.type === "city");
  const areas = locations.filter((l) => l.type !== "city");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <div className="border-b border-gray-100 bg-gray-50/60 p-4 md:border-b-0 md:border-r">
          <div className="space-y-1">
            {steps.map((s, i) => {
              const active = i === stepIndex;
              const done = i < stepIndex;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStepIndex(i)}
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
                        : done
                          ? "bg-primary/20 text-primary"
                          : "border border-gray-300 bg-white text-gray-400",
                    ].join(" ")}
                  >
                    {done ? <CheckIcon /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={["block text-[12px] font-semibold", active ? "text-primary" : "text-gray-700"].join(" ")}>
                      {s.title}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-gray-400">{s.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {selectedType && (
            <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3">
              <p className="text-[10px] uppercase tracking-wide text-gray-500">Listing</p>
              <p className="mt-1 text-[12px] font-semibold text-primary">{selectedType.name}</p>
              <p className="mt-0.5 text-[10.5px] text-gray-500">
                {PURPOSES.find((p) => p.value === purpose)?.label}
              </p>
            </div>
          )}
        </div>

        <div className="p-6">
          {(error || firstError) && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
              {firstError ?? error}
            </div>
          )}

          {current.key === "basic" && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Basic Information</h3>
              <p className="mt-1 text-[12px] text-gray-500">
                The category and type decide which fields appear in the next step.
              </p>

              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Category" required>
                    <select
                      value={categorySlug}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className={adminSelectClass}
                    >
                      <option value="">Select category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Property Type" required>
                    <select
                      value={typeId}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      disabled={!categorySlug}
                      className={adminSelectClass}
                    >
                      <option value="">
                        {categorySlug ? "Select type..." : "Choose a category first"}
                      </option>
                      {typesInCategory.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Purpose" required>
                  <div className="flex flex-wrap items-center gap-2">
                    {PURPOSES.map((p) => (
                      <PurposeOption
                        key={p.value}
                        label={p.label}
                        selected={purpose === p.value}
                        onClick={() => setPurpose(p.value)}
                      />
                    ))}
                  </div>
                </Field>

                <Field label="Property Title" required>
                  <input
                    value={basic.title}
                    onChange={(e) => setBasic({ ...basic, title: e.target.value })}
                    placeholder="e.g. Luxury 10 Marla House in DHA Phase 6"
                    className={adminInputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label={priceLabel} required>
                    <input
                      value={basic.price}
                      onChange={(e) => setBasic({ ...basic, price: e.target.value })}
                      placeholder="e.g. 45000000"
                      className={adminInputClass}
                    />
                  </Field>
                  <Field label="Area" required>
                    <input
                      type="number"
                      value={basic.areaValue}
                      onChange={(e) => setBasic({ ...basic, areaValue: e.target.value })}
                      placeholder="e.g. 10"
                      className={adminInputClass}
                    />
                  </Field>
                  <Field label="Area Unit" required>
                    <select
                      value={basic.areaUnit}
                      onChange={(e) => setBasic({ ...basic, areaUnit: e.target.value })}
                      className={adminSelectClass}
                    >
                      <option value="marla">Marla</option>
                      <option value="kanal">Kanal</option>
                      <option value="sqft">Sq Ft</option>
                      <option value="sqyd">Sq Yd</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Location" required>
                    <select
                      value={basic.locationId}
                      onChange={(e) => setBasic({ ...basic, locationId: e.target.value })}
                      className={adminSelectClass}
                    >
                      <option value="">Select location...</option>
                      {cities.length > 0 && (
                        <optgroup label="Cities">
                          {cities.map((l) => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </optgroup>
                      )}
                      {areas.length > 0 && (
                        <optgroup label="Areas / Societies">
                          {areas.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.name}{l.parent ? ` (${l.parent})` : ""}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </Field>
                  <Field label="Full Address">
                    <input
                      value={basic.fullLocation}
                      onChange={(e) => setBasic({ ...basic, fullLocation: e.target.value })}
                      placeholder="e.g. DHA Phase 6, Block D, Street 12"
                      className={adminInputClass}
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <RichTextEditor
                    value={basic.description}
                    onChange={(html) => setBasic({ ...basic, description: html })}
                    placeholder="Describe the property, its location and nearby facilities..."
                    maxLength={5000}
                  />
                </Field>
              </div>
            </div>
          )}

          {current.key === "details" && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Property Details</h3>
              <p className="mt-1 text-[12px] text-gray-500">
                {selectedType
                  ? `Fields for ${selectedType.name}.`
                  : "Choose a property type on step 1 first."}
              </p>

              {!selectedType && (
                <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-8 text-center text-[12px] text-gray-500">
                  No type selected yet.
                </div>
              )}

              {selectedType && (
                <div className="mt-5 space-y-4">
                  {(visibleCore.length > 0 || showsFurnishing || showsCondition) && (
                    <fieldset className="rounded-lg border border-gray-200 p-4">
                      <legend className="px-1.5 text-[12px] font-semibold text-gray-700">
                        Main Details
                      </legend>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {visibleCore.map((f) => (
                          <div key={f.key}>
                            <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                              {f.label}
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={core[f.key] ?? ""}
                              onChange={(e) => setCore({ ...core, [f.key]: e.target.value })}
                              className={adminInputClass}
                            />
                          </div>
                        ))}

                        {showsFurnishing && (
                          <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                              Furnishing
                            </label>
                            <select
                              value={core.furnishing ?? ""}
                              onChange={(e) => setCore({ ...core, furnishing: e.target.value })}
                              className={adminSelectClass}
                            >
                              <option value="">Select...</option>
                              <option value="furnished">Furnished</option>
                              <option value="semi">Semi-Furnished</option>
                              <option value="unfurnished">Unfurnished</option>
                            </select>
                          </div>
                        )}

                        {showsCondition && (
                          <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                              Condition
                            </label>
                            <select
                              value={core.propertyCondition ?? ""}
                              onChange={(e) => setCore({ ...core, propertyCondition: e.target.value })}
                              className={adminSelectClass}
                            >
                              <option value="">Select...</option>
                              <option value="brand_new">Brand New</option>
                              <option value="like_new">Like New</option>
                              <option value="used">Used</option>
                              <option value="under_construction">Under Construction</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </fieldset>
                  )}

                  {detailGroups.map(({ name, group }) => (
                    <SpecFieldGroup
                      key={name}
                      group={group}
                      values={specs}
                      onChange={setSpec}
                      errors={fieldErrors}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {current.key === "plan" && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Payment Plan</h3>
              <p className="mt-1 text-[12px] text-gray-500">
                Break the price into booking, instalments and possession. Totals update as you type.
              </p>
              <div className="mt-5 space-y-4">
                <PaymentPlanCalculator specs={specs} onChange={setSpec} onApply={applySpecs} />
                <PaymentPlanStep specs={specs} onChange={setSpec} totalPrice={totalPrice} />
              </div>
            </div>
          )}

          {current.key === "media" && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Media & Gallery</h3>
              <p className="mt-1 text-[12px] text-gray-500">Upload images for this listing.</p>

              <div
                className="mt-5 flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center"
                onClick={() => document.getElementById("prop-images")?.click()}
              >
                <div>
                  <UploadIcon />
                  <p className="mt-2 text-[12px] font-medium text-gray-600">Click to browse images</p>
                  <p className="mt-1 text-[10.5px] text-gray-400">JPG, PNG, WebP · up to 2MB each · min 400×400px · max 20</p>
                </div>
              </div>
              <input
                id="prop-images"
                type="file"
                /* The API allows these three only; image/* let a GIF or
                   HEIC through the picker to fail on upload. */
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const picked = Array.from(e.target.files || []);
                  e.target.value = "";
                  if (picked.length === 0) return;

                  // Shrink before upload: a phone photo is several megabytes
                  // and far larger than anything the site displays.
                  const { files: ready, rejected } = await prepareImages(picked);
                  setImages((prev) => [...prev, ...ready].slice(0, 20));
                  setImageNotice(
                    rejected.length
                      ? rejected.map((r) => `${r.file.name}: ${r.reason}`).join(" · ")
                      : null,
                  );
                }}
              />

              {imageNotice && (
                <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] font-medium leading-relaxed text-amber-800">
                  {imageNotice}
                </p>
              )}

              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {images.map((file, i) => (
                    <div key={i} className="group relative h-20 overflow-hidden rounded-md bg-gray-100">
                      <SafeImage src={URL.createObjectURL(file)} alt="" fill sizes="100px" className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((cur) => cur.filter((_, j) => j !== i))}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {current.key === "seo" && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">SEO & Settings</h3>
              <p className="mt-1 text-[12px] text-gray-500">Meta information for search engines.</p>

              <div className="mt-5 space-y-4">
                <Field label="Meta Title">
                  <input
                    value={basic.metaTitle}
                    onChange={(e) => setBasic({ ...basic, metaTitle: e.target.value })}
                    maxLength={70}
                    placeholder="e.g. 10 Marla House for Sale in DHA Phase 6"
                    className={adminInputClass}
                  />
                </Field>
                <Field label="Meta Description">
                  <textarea
                    value={basic.metaDescription}
                    onChange={(e) => setBasic({ ...basic, metaDescription: e.target.value })}
                    maxLength={160}
                    placeholder="Short SEO description..."
                    className={adminTextareaClass}
                  />
                </Field>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          {stepIndex === 0 ? "Cancel" : "Back"}
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden text-[11px] text-gray-400 sm:inline">
            Step {stepIndex + 1} of {steps.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={submitting}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Saving..." : isLastStep ? "Publish Property" : "Next Step"}
            {!isLastStep && !submitting && <ArrowRightIcon />}
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
        "flex h-10 min-w-[130px] flex-1 items-center justify-center gap-2 rounded-md border text-[12px] font-medium transition-colors",
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
