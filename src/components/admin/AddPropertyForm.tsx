"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api/client";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";

type PropertyType = { id: string; name: string; slug: string };
type Location = { id: string; name: string; slug: string; type: string; parent: string | null };

const steps = [
  { id: 1, title: "Basic Information", description: "Title, type, price, location" },
  { id: 2, title: "Property Details", description: "Features, size, description" },
  { id: 3, title: "Media & Gallery", description: "Images and videos" },
  { id: 4, title: "Additional Info", description: "Amenities, maps, documents" },
  { id: 5, title: "SEO & Settings", description: "Meta, status, featured" },
];

const AMENITIES = ["Parking", "Gas", "Electricity", "Water Supply", "Security", "Lawn", "Swimming Pool", "Gym"];

export default function AddPropertyForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<"sale" | "rent">("sale");
  const [description, setDescription] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    api<{ data: PropertyType[] }>("/property-types").then((r) => setPropertyTypes(r.data)).catch(() => {});
    api<{ data: Location[] }>("/locations").then((r) => setLocations(r.data)).catch(() => {});
  }, []);

  const handleClose = () => router.push("/admin/properties");
  const isLastStep = step === steps.length;

  const toggleFeature = (f: string) => {
    setSelectedFeatures((cur) => cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]);
  };

  const handleSubmit = useCallback(async () => {
    if (!formRef.current) return;
    setSubmitting(true);
    setError("");
    setFieldErrors({});

    const fd = new FormData(formRef.current);
    const body = new FormData();

    const text = (key: string) => (fd.get(key) as string) ?? "";
    body.append("title", text("title"));
    body.append("propertyTypeId", text("propertyTypeId"));
    body.append("purpose", purpose);
    body.append("price", String(Number(text("price").replace(/,/g, "")) || 0));
    body.append("areaValue", text("areaValue") || "0");
    body.append("areaUnit", text("areaUnit") || "marla");
    body.append("locationId", text("locationId"));
    if (text("fullLocation")) body.append("fullLocation", text("fullLocation"));
    if (text("description")) body.append("description", text("description"));
    if (text("beds")) body.append("beds", text("beds"));
    if (text("baths")) body.append("baths", text("baths"));
    if (text("floors")) body.append("floors", text("floors"));
    if (text("carParking")) body.append("carParking", text("carParking"));
    if (text("metaTitle")) body.append("metaTitle", text("metaTitle"));
    if (text("metaDescription")) body.append("metaDescription", text("metaDescription"));
    selectedFeatures.forEach((f) => body.append("features[]", f));
    selectedImages.forEach((file) => body.append("images[]", file));

    try {
      await api<{ data: { id: string } }>("/my/properties", { method: "POST", body: body as unknown as Record<string, unknown> });
      router.push("/admin/properties");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errors" in err) {
        setFieldErrors((err as { errors: Record<string, string[]> }).errors ?? {});
      }
      setError(err instanceof Error ? err.message : "Failed to create property");
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  }, [purpose, selectedFeatures, selectedImages, router]);

  const goNext = () => {
    if (isLastStep) {
      handleSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length));
  };

  const goBack = () => {
    if (step === 1) { handleClose(); return; }
    setStep((s) => Math.max(s - 1, 1));
  };

  const firstError = Object.values(fieldErrors).flat()[0];
  const cities = locations.filter((l) => l.type === "city");
  const areas = locations.filter((l) => l.type !== "city");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col justify-between border-b border-gray-100 bg-gray-50/60 p-4 md:border-b-0 md:border-r">
            <div className="space-y-1">
              {steps.map((s) => {
                const active = s.id === step;
                const completed = s.id < step;
                return (
                  <button key={s.id} type="button" onClick={() => setStep(s.id)}
                    className={["flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors", active ? "bg-primary/10" : "hover:bg-white"].join(" ")}>
                    <span className={["flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold", active ? "bg-primary text-white" : completed ? "bg-primary/20 text-primary" : "border border-gray-300 bg-white text-gray-400"].join(" ")}>
                      {completed ? <CheckIcon /> : s.id}
                    </span>
                    <span className="min-w-0">
                      <span className={["block text-[12px] font-semibold", active ? "text-primary" : "text-gray-700"].join(" ")}>{s.title}</span>
                      <span className="mt-0.5 block text-[10px] text-gray-400">{s.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {(error || firstError) && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
                {firstError ?? error}
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">Basic Information</h3>
                <p className="mt-1 text-[12px] text-gray-500">Add the essential details about the property.</p>
                <div className="mt-5 space-y-4">
                  <Field label="Property Title" required>
                    <input name="title" placeholder="e.g. Luxury 5 Marla House in DHA Lahore" className={adminInputClass} required />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Property Type" required>
                      <select name="propertyTypeId" className={adminSelectClass} required>
                        <option value="">Select type...</option>
                        {propertyTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Purpose" required>
                      <div className="flex items-center gap-2">
                        <PurposeOption label="For Sale" selected={purpose === "sale"} onClick={() => setPurpose("sale")} />
                        <PurposeOption label="For Rent" selected={purpose === "rent"} onClick={() => setPurpose("rent")} />
                      </div>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Price (PKR)" required>
                      <input name="price" placeholder="e.g. 8500000" className={adminInputClass} required />
                    </Field>
                    <Field label="Bedrooms">
                      <input name="beds" type="number" placeholder="e.g. 3" className={adminInputClass} />
                    </Field>
                    <Field label="Bathrooms">
                      <input name="baths" type="number" placeholder="e.g. 3" className={adminInputClass} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Area" required>
                      <input name="areaValue" type="number" placeholder="e.g. 5" className={adminInputClass} required />
                    </Field>
                    <Field label="Area Unit" required>
                      <select name="areaUnit" defaultValue="marla" className={adminSelectClass}>
                        <option value="marla">Marla</option>
                        <option value="kanal">Kanal</option>
                        <option value="sqft">Sq Ft</option>
                        <option value="sqm">Sq M</option>
                        <option value="sqyd">Sq Yd</option>
                      </select>
                    </Field>
                    <Field label="Location" required>
                      <select name="locationId" className={adminSelectClass} required>
                        <option value="">Select location...</option>
                        {cities.length > 0 && <optgroup label="Cities">
                          {cities.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </optgroup>}
                        {areas.length > 0 && <optgroup label="Areas / Societies">
                          {areas.map((l) => <option key={l.id} value={l.id}>{l.name}{l.parent ? ` (${l.parent})` : ""}</option>)}
                        </optgroup>}
                      </select>
                    </Field>
                  </div>
                  <Field label="Full Address">
                    <input name="fullLocation" placeholder="e.g. DHA Phase 6, Block D, Street 5" className={adminInputClass} />
                  </Field>
                  <Field label="Short Description">
                    <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value.slice(0, 2000))} placeholder="Property description..." className={adminTextareaClass} maxLength={2000} />
                    <p className="mt-1 text-right text-[10px] text-gray-400">{description.length}/2000</p>
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <StepPlaceholder title="Property Details" description="Add features, size details and a full description.">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Floors"><input name="floors" type="number" placeholder="e.g. 2" className={adminInputClass} /></Field>
                  <Field label="Parking Spaces"><input name="carParking" type="number" placeholder="e.g. 2" className={adminInputClass} /></Field>
                  <Field label="Year Built"><input name="yearBuilt" placeholder="e.g. 2022" className={adminInputClass} /></Field>
                </div>
              </StepPlaceholder>
            )}

            {step === 3 && (
              <StepPlaceholder title="Media & Gallery" description="Upload images for this listing.">
                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center cursor-pointer" onClick={() => document.getElementById("prop-images")?.click()}>
                  <div>
                    <UploadIcon />
                    <p className="mt-2 text-[12px] font-medium text-gray-600">Click to browse images</p>
                    <p className="mt-1 text-[10.5px] text-gray-400">PNG, JPG up to 5MB each (max 20)</p>
                  </div>
                </div>
                <input id="prop-images" type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                  if (e.target.files) setSelectedImages((prev) => [...prev, ...Array.from(e.target.files!)].slice(0, 20));
                }} />
                {selectedImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {selectedImages.map((file, i) => (
                      <div key={i} className="group relative h-20 overflow-hidden rounded-md bg-gray-100">
                        <Image src={URL.createObjectURL(file)} alt="" fill sizes="100px" className="object-cover" />
                        <button type="button" onClick={() => setSelectedImages((cur) => cur.filter((_, j) => j !== i))} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </StepPlaceholder>
            )}

            {step === 4 && (
              <StepPlaceholder title="Additional Info" description="Features and amenities.">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {AMENITIES.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-[11.5px] text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={selectedFeatures.includes(amenity)} onChange={() => toggleFeature(amenity)} className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40" />
                      {amenity}
                    </label>
                  ))}
                </div>
              </StepPlaceholder>
            )}

            {step === 5 && (
              <StepPlaceholder title="SEO & Settings" description="Meta information for search engines.">
                <Field label="Meta Title"><input name="metaTitle" placeholder="e.g. 5 Marla House for Sale in DHA Lahore" className={adminInputClass} maxLength={70} /></Field>
                <Field label="Meta Description"><textarea name="metaDescription" placeholder="Short SEO description..." className={adminTextareaClass} maxLength={160} /></Field>
              </StepPlaceholder>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <button type="button" onClick={goBack} className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50">
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] text-gray-400 sm:inline">Step {step} of {steps.length}</span>
            <button type="button" onClick={goNext} disabled={submitting} className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
              {submitting ? "Saving..." : isLastStep ? "Publish Property" : "Next Step"}
              {!isLastStep && !submitting && <ArrowRightIcon />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function StepPlaceholder({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-[12px] text-gray-500">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function PurposeOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={["flex h-10 flex-1 items-center justify-center gap-2 rounded-md border text-[12px] font-medium transition-colors", selected ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"].join(" ")}>
      <span className={["flex h-4 w-4 items-center justify-center rounded-full border-2", selected ? "border-primary" : "border-gray-300"].join(" ")}>
        {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
      {label}
    </button>
  );
}

function CheckIcon() { return <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>; }
function ArrowRightIcon() { return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>; }
function UploadIcon() { return <svg className="mx-auto h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4" /><path d="m7 8 5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>; }
