"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createAdminProject } from "@/lib/api/adminProjects";
import { listProjectCategories } from "@/lib/api/projectCategories";
import { listLocations, type Location } from "@/lib/api/locations";
import { api } from "@/lib/api/client";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";

type ProjectCategory = { id: string; name: string; slug: string };

const steps = [
  { id: 1, title: "Basic Information", description: "Name, type, location" },
  { id: 2, title: "Project Details", description: "Units, description, features" },
  { id: 3, title: "Media & Gallery", description: "Images, brochure, video" },
  { id: 4, title: "Amenities & Features", description: "Facilities and highlights" },
  { id: 5, title: "SEO & Settings", description: "Meta, status, featured" },
];

const COMMON_AMENITIES = [
  "Parks", "Mosque", "School", "Hospital", "Community Center",
  "Security", "Underground Electricity", "Wide Roads", "Commercial Zone",
  "Swimming Pool", "Gym", "Playground", "Water Supply", "Gas Supply",
];

function slugify(val: string) {
  return val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function AddProjectForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [developer, setDeveloper] = useState("");
  const [locationId, setLocationId] = useState("");
  const [status, setStatus] = useState("Active");
  const [priceFrom, setPriceFrom] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [description, setDescription] = useState("");

  const [amenities, setAmenities] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [plotSizes, setPlotSizes] = useState<string[]>([""]);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [verified, setVerified] = useState(false);
  const [featured, setFeatured] = useState(false);

  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    listProjectCategories().then(setCategories).catch(() => {});
    listLocations().then(setLocations).catch(() => {});
  }, []);

  useEffect(() => {
    if (!slug || slug === slugify(name.slice(0, -1))) {
      setSlug(slugify(name));
    }
  }, [name]);

  const handleClose = () => router.push("/admin/projects");
  const isLastStep = step === steps.length;

  const goNext = async () => {
    if (isLastStep) {
      await handleSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length));
  };

  const goBack = () => {
    if (step === 1) { handleClose(); return; }
    setStep((s) => Math.max(s - 1, 1));
  };

  const fieldError = (key: string) => fieldErrors[key]?.[0];

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setFieldErrors({});

    try {
      const body: Record<string, unknown> = {
        name,
        slug,
        projectCategoryId: Number(categoryId),
        developer,
        locationId: Number(locationId),
        status,
        priceFrom: priceFrom || undefined,
        totalArea: totalArea || undefined,
        totalUnits: totalUnits ? Number(totalUnits) : undefined,
        description: description || undefined,
        verified,
        featured,
        amenities: amenities.length > 0 ? amenities : undefined,
        highlights: highlights.filter(Boolean),
        plotSizes: plotSizes.filter(Boolean),
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
      };

      const res = await createAdminProject(body);

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((f) => formData.append("images[]", f));
        await api(`/admin/projects/${res.data.id}`, {
          method: "PUT",
          body: { ...body, images: undefined },
        });
        // Upload images separately via FormData
        const imgData = new FormData();
        images.forEach((f) => imgData.append("images[]", f));
        await api(`/admin/projects/${res.data.id}`, {
          method: "PUT",
          body: imgData,
        });
      }

      router.push("/admin/projects");
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      setError(e.message || "Failed to create project");
      if (e.errors) {
        setFieldErrors(e.errors);
        const firstErrorKey = Object.keys(e.errors)[0];
        if (firstErrorKey) {
          if (["name", "slug", "projectCategoryId", "developer", "locationId", "status"].includes(firstErrorKey)) setStep(1);
          else if (["totalUnits", "description"].includes(firstErrorKey)) setStep(2);
          else if (firstErrorKey === "images") setStep(3);
          else if (["amenities", "highlights"].includes(firstErrorKey)) setStep(4);
          else setStep(5);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
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
                  className={["flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors", active ? "bg-primary/10" : "hover:bg-white"].join(" ")}
                >
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

        {/* Step content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Basic Information</h3>
              <p className="mt-1 text-[12px] text-gray-500">Enter the essential details about the project.</p>
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Project Name" required error={fieldError("name")}>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lahore Smart City" className={adminInputClass} />
                  </Field>
                  <Field label="Slug" required error={fieldError("slug")}>
                    <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="lahore-smart-city" className={adminInputClass} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Project Category" required error={fieldError("projectCategoryId")}>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={adminSelectClass}>
                      <option value="">Select Category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Developer / Builder" required error={fieldError("developer")}>
                    <input value={developer} onChange={(e) => setDeveloper(e.target.value)} placeholder="e.g. DHA, Bahria Town" className={adminInputClass} />
                  </Field>
                </div>
                <Field label="Location" required error={fieldError("locationId")}>
                  <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className={adminSelectClass}>
                    <option value="">Select Location</option>
                    {locations.map((l) => <option key={l.id} value={l.id}>{l.parent ? `${l.parent} › ` : ""}{l.name}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Price From (PKR)" error={fieldError("priceFrom")}>
                    <input value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="e.g. Rs 25 Lac" className={adminInputClass} />
                  </Field>
                  <Field label="Project Status" required error={fieldError("status")}>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={adminSelectClass}>
                      <option>Active</option>
                      <option>Upcoming</option>
                      <option>Completed</option>
                      <option>On Hold</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Project Details</h3>
              <p className="mt-1 text-[12px] text-gray-500">Add unit details and description.</p>
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Total Units" error={fieldError("totalUnits")}>
                    <input type="number" value={totalUnits} onChange={(e) => setTotalUnits(e.target.value)} placeholder="e.g. 5200" className={adminInputClass} />
                  </Field>
                  <Field label="Total Area" error={fieldError("totalArea")}>
                    <input value={totalArea} onChange={(e) => setTotalArea(e.target.value)} placeholder="e.g. 20,000 Kanal" className={adminInputClass} />
                  </Field>
                </div>
                <Field label="Description" error={fieldError("description")}>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 5000))} placeholder="Describe the project in detail..." className={adminTextareaClass} maxLength={5000} />
                  <p className="mt-1 text-right text-[10px] text-gray-400">{description.length}/5000</p>
                </Field>
                <Field label="Plot Sizes">
                  {plotSizes.map((s, i) => (
                    <div key={i} className="mt-1 flex gap-2">
                      <input value={s} onChange={(e) => { const n = [...plotSizes]; n[i] = e.target.value; setPlotSizes(n); }} placeholder="e.g. 5 Marla" className={adminInputClass} />
                      {plotSizes.length > 1 && (
                        <button type="button" onClick={() => setPlotSizes(plotSizes.filter((_, j) => j !== i))} className="text-red-500 text-[11px] font-semibold">Remove</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setPlotSizes([...plotSizes, ""])} className="mt-2 text-[11px] font-semibold text-primary hover:underline">+ Add Size</button>
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Media & Gallery</h3>
              <p className="mt-1 text-[12px] text-gray-500">Upload images for the project.</p>
              <div className="mt-5 space-y-4">
                <label className="flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center hover:border-primary">
                  <div>
                    <UploadIcon />
                    <p className="mt-2 text-[12px] font-medium text-gray-600">Click to upload images</p>
                    <p className="mt-1 text-[10.5px] text-gray-400">JPG, PNG, WebP up to 5MB each</p>
                  </div>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => { const f = Array.from(e.target.files || []); setImages((prev) => [...prev, ...f].slice(0, 20)); e.target.value = ""; }} />
                </label>
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((file, i) => (
                      <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                        <Image src={URL.createObjectURL(file)} alt="" fill sizes="100px" className="object-cover" unoptimized />
                        <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute right-1 top-1 hidden rounded bg-red-600 p-1 text-white group-hover:block">
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Amenities & Features</h3>
              <p className="mt-1 text-[12px] text-gray-500">Select amenities and add highlights.</p>
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {COMMON_AMENITIES.map((a) => (
                    <label key={a} className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-[11.5px] text-gray-600">
                      <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40" />
                      {a}
                    </label>
                  ))}
                </div>
                <Field label="Highlights">
                  {highlights.map((h, i) => (
                    <div key={i} className="mt-1 flex gap-2">
                      <input value={h} onChange={(e) => { const n = [...highlights]; n[i] = e.target.value; setHighlights(n); }} placeholder="e.g. NOC Approved" className={adminInputClass} />
                      {highlights.length > 1 && (
                        <button type="button" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))} className="text-red-500 text-[11px] font-semibold">Remove</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setHighlights([...highlights, ""])} className="mt-2 text-[11px] font-semibold text-primary hover:underline">+ Add Highlight</button>
                </Field>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">SEO & Settings</h3>
              <p className="mt-1 text-[12px] text-gray-500">Meta information and visibility.</p>
              <div className="mt-5 space-y-4">
                <Field label="Meta Title" error={fieldError("metaTitle")}>
                  <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="e.g. Lahore Smart City — Project Overview" className={adminInputClass} maxLength={70} />
                </Field>
                <Field label="Meta Description" error={fieldError("metaDescription")}>
                  <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Short SEO description..." className={adminTextareaClass} maxLength={160} />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-[12px] text-gray-700">
                    <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary" />
                    Verified Project
                  </label>
                  <label className="flex items-center gap-2 text-[12px] text-gray-700">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary" />
                    Featured Project
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <button type="button" onClick={goBack} className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50">
          {step === 1 ? "Cancel" : "Back"}
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden text-[11px] text-gray-400 sm:inline">Step {step} of {steps.length}</span>
          <button
            type="button"
            onClick={goNext}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : isLastStep ? "Publish Project" : "Next Step"}
            {!isLastStep && !saving && <ArrowRightIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

function CheckIcon() {
  return <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>;
}

function ArrowRightIcon() {
  return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function UploadIcon() {
  return <svg className="mx-auto h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4" /><path d="m7 8 5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>;
}
