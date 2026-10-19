"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import {
  createAdminProject,
  getAdminProject,
  updateAdminProject,
} from "@/lib/api/adminProjects";
import { listProjectCategories } from "@/lib/api/projectCategories";
import { listLocations, type Location } from "@/lib/api/locations";
import { api } from "@/lib/api/client";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import ProjectTowersStep, {
  type TowerDraft,
} from "@/components/admin/ProjectTowersStep";
import ProjectUnitsStep, {
  termsPayload,
  unitsPayload,
  type UnitDraft,
} from "@/components/admin/ProjectUnitsStep";
import { PERCENT_COMPONENTS } from "@/lib/paymentPlan";
import { listDevelopers } from "@/lib/api/developers";
import type { DeveloperProfile } from "@/types/project";

type ProjectCategory = { id: string; name: string; slug: string };

const steps = [
  { id: 1, title: "Basic Information", description: "Name, type, location" },
  { id: 2, title: "Project Details", description: "Units, description, features" },
  { id: 3, title: "Payment Plan", description: "Unit types and instalments" },
  { id: 4, title: "Towers & Floors", description: "High-rise structure (optional)" },
  { id: 5, title: "Media & Gallery", description: "Images, brochure, video" },
  { id: 6, title: "Amenities & Features", description: "Facilities and highlights" },
  { id: 7, title: "SEO & Settings", description: "Meta, status, featured" },
];

const COMMON_AMENITIES = [
  "Parks", "Mosque", "School", "Hospital", "Community Center",
  "Security", "Underground Electricity", "Wide Roads", "Commercial Zone",
  "Swimming Pool", "Gym", "Playground", "Water Supply", "Gas Supply",
];

const PROJECT_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "mixed_use", label: "Mixed Use" },
];

const PROJECT_FORMATS = [
  { value: "high_rise", label: "High-Rise" },
  { value: "mid_rise", label: "Mid-Rise" },
  { value: "low_rise", label: "Low-Rise" },
  { value: "mall", label: "Mall" },
  { value: "plaza", label: "Plaza" },
  { value: "villas", label: "Villas" },
  { value: "housing_community", label: "Housing Community" },
  { value: "other", label: "Other" },
];

const PAYMENT_TYPES = [
  { value: "full_payment", label: "Full Payment" },
  { value: "installment", label: "Installment" },
  { value: "booking_open", label: "Booking Open" },
  { value: "cash_installment", label: "Cash + Installment" },
];

const PROJECT_STATUSES = [
  "Pre-Launch",
  "Booking Open",
  "Under Construction",
  "Near Completion",
  "Ready to Move",
  "Possession Available",
  "Completed",
];

function slugify(val: string) {
  return val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** With `projectId` the form edits that project; without it, it creates one. */
export default function AddProjectForm({ projectId }: { projectId?: string } = {}) {
  const isEdit = Boolean(projectId);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(Boolean(projectId));
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
  const [status, setStatus] = useState("Pre-Launch");
  const [projectType, setProjectType] = useState("residential");
  const [projectFormat, setProjectFormat] = useState("other");
  const [paymentType, setPaymentType] = useState("full_payment");
  const [towersCount, setTowersCount] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [basementFloors, setBasementFloors] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState("");
  const [expectedCompletion, setExpectedCompletion] = useState("");
  const [possessionTimeline, setPossessionTimeline] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [description, setDescription] = useState("");

  const [amenities, setAmenities] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [plotSizes, setPlotSizes] = useState<string[]>([""]);

  const [units, setUnits] = useState<UnitDraft[]>([]);
  const [terms, setTerms] = useState<Record<string, string>>({});

  const [developers, setDevelopers] = useState<DeveloperProfile[]>([]);
  const [developerId, setDeveloperId] = useState("");
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [floorPlans, setFloorPlans] = useState<
    { name: string; floorNumber: string; tower: string; description: string }[]
  >([]);

  const [towers, setTowers] = useState<TowerDraft[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [verified, setVerified] = useState(false);
  const [featured, setFeatured] = useState(false);

  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    listProjectCategories().then(setCategories).catch(() => {});
    listLocations().then(setLocations).catch(() => {});
    listDevelopers().then(setDevelopers).catch(() => {});
  }, []);

  useEffect(() => {
    if (!projectId) return;

    getAdminProject(projectId)
      .then(({ data }) => {
        setName(data.name);
        setSlug(data.slug);
        setCategoryId(String(data.categoryId ?? ""));
        setDeveloper(data.developer ?? "");
        setLocationId(String(data.locationId ?? ""));
        setStatus(data.status ?? "Pre-Launch");
        setProjectType(data.projectType ?? "residential");
        setProjectFormat(data.projectFormat ?? "other");
        setPaymentType(data.paymentType ?? "full_payment");
        setTowersCount(data.towersCount != null ? String(data.towersCount) : "");
        setTotalFloors(data.totalFloors != null ? String(data.totalFloors) : "");
        setBasementFloors(data.basementFloors != null ? String(data.basementFloors) : "");
        setParkingSpaces(data.parkingSpaces != null ? String(data.parkingSpaces) : "");
        setExpectedCompletion(data.expectedCompletion ?? "");
        setPossessionTimeline(data.possessionTimeline ?? "");
        setDeveloperId(data.developerId ?? "");
        setFaqs((data.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })));
        setFloorPlans(
          (data.floorPlans ?? []).map((p) => ({
            name: p.name,
            floorNumber: p.floorNumber ?? "",
            tower: p.tower ?? "",
            description: p.description ?? "",
          })),
        );
        setPriceFrom(data.priceFrom ?? "");
        setTotalArea(data.totalArea ?? "");
        setTotalUnits(data.totalUnits != null ? String(data.totalUnits) : "");
        setDescription(data.description ?? "");
        setAmenities(data.amenities ?? []);
        setHighlights(data.highlights?.length ? data.highlights : [""]);
        setPlotSizes(data.plotSizes?.length ? data.plotSizes : [""]);
        setTowers(
          (data.towers ?? []).map((t) => ({
            name: t.name ?? "",
            floorsCount: t.floorsCount != null ? String(t.floorsCount) : "",
            unitsCount: t.unitsCount != null ? String(t.unitsCount) : "",
            description: t.description ?? "",
            floors: (t.floors ?? []).map((f) => ({
              floorNumber: String(f.floorNumber),
              name: f.name ?? "",
            })),
          })),
        );
        setMetaTitle(data.metaTitle ?? "");
        setMetaDescription(data.metaDescription ?? "");
        setFocusKeyword(data.seo?.focusKeyword ?? "");
        setCanonicalUrl(data.seo?.canonicalUrl ?? "");
        setOgTitle(data.seo?.ogTitle ?? "");
        setOgDescription(data.seo?.ogDescription ?? "");
        setOgImage(data.seo?.ogImage ?? "");
        setVerified(Boolean(data.verified));
        setFeatured(Boolean(data.featured));

        setUnits(
          (data.units ?? []).map((u) => ({
            unitType: u.unitType,
            unitName: u.unitName ?? "",
            category: u.category,
            area: String(u.area),
            minArea: u.minArea != null ? String(u.minArea) : "",
            maxArea: u.maxArea != null ? String(u.maxArea) : "",
            areaUnit: u.areaUnit ?? "sqft",
            ratePerSqft: String(u.ratePerSqft),
            maxPrice: u.maxPrice != null ? String(u.maxPrice) : "",
            availability: u.availability ?? "available",
            details: Object.fromEntries(
              Object.entries(u.details ?? {}).map(([k, v]) => [k, String(v)]),
            ),
          })),
        );

        const t = data.paymentTerms;
        if (t) {
          setTerms(
            Object.fromEntries(
              Object.entries(t)
                .filter(([, v]) => v != null)
                .map(([k, v]) => [k, String(v)]),
            ),
          );
        }
      })
      .catch(() => setError("Failed to load this project."))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    // Editing keeps the published slug: regenerating it would break the live URL.
    if (isEdit) return;

    if (!slug || slug === slugify(name.slice(0, -1))) {
      setSlug(slugify(name));
    }
  }, [name, isEdit]);

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
    const missing: Record<string, string[]> = {};
    if (!name.trim()) missing.name = ["The name field is required."];
    if (!slug.trim()) missing.slug = ["The slug field is required."];
    if (!categoryId) missing.projectCategoryId = ["Please select a project category."];
    if (!developer.trim()) missing.developer = ["The developer field is required."];
    if (!locationId) missing.locationId = ["Please select a location."];

    if (Object.keys(missing).length > 0) {
      setFieldErrors(missing);
      setError("Please fill in the required fields. If the browser auto-filled them, retype the values.");
      setStep(1);
      return;
    }

    const payload = termsPayload(terms);
    if (payload) {
      const pct = PERCENT_COMPONENTS.reduce((s, c) => s + (Number(terms[c.key]) || 0), 0);
      if (Math.abs(pct - 100) > 0.01) {
        setFieldErrors({
          paymentTerms: [`Payment percentages must equal 100%. They currently total ${pct.toFixed(2)}%.`],
        });
        setError("The payment plan does not add up to 100%.");
        setStep(3);
        return;
      }
    }

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
        towers: towers
          .filter((t) => t.name.trim())
          .map((t) => ({
            name: t.name.trim(),
            floorsCount: t.floorsCount ? Number(t.floorsCount) : undefined,
            unitsCount: t.unitsCount ? Number(t.unitsCount) : undefined,
            description: t.description || undefined,
            floors: t.floors
              .filter((f) => f.floorNumber !== "")
              .map((f) => ({
                floorNumber: Number(f.floorNumber),
                name: f.name || undefined,
              })),
          })),
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        focusKeyword: focusKeyword || undefined,
        canonicalUrl: canonicalUrl || undefined,
        ogTitle: ogTitle || undefined,
        ogDescription: ogDescription || undefined,
        ogImage: ogImage || undefined,
        units: unitsPayload(units),
        paymentTerms: termsPayload(terms),
        projectType,
        projectFormat,
        paymentType,
        towersCount: towersCount ? Number(towersCount) : undefined,
        totalFloors: totalFloors ? Number(totalFloors) : undefined,
        basementFloors: basementFloors ? Number(basementFloors) : undefined,
        parkingSpaces: parkingSpaces ? Number(parkingSpaces) : undefined,
        expectedCompletion: expectedCompletion || undefined,
        possessionTimeline: possessionTimeline || undefined,
        developerId: developerId ? Number(developerId) : undefined,
        faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
        floorPlans: floorPlans
          .filter((p) => p.name.trim())
          .map((p) => ({
            name: p.name.trim(),
            floorNumber: p.floorNumber || undefined,
            tower: p.tower || undefined,
            description: p.description || undefined,
          })),
      };

      const id = projectId
        ? (await updateAdminProject(projectId, body), projectId)
        : (await createAdminProject(body)).data.id;

      if (images.length > 0) {
        const imgData = new FormData();
        // PHP does not parse a multipart PUT body, so spoof the method.
        imgData.append("_method", "PUT");
        imgData.append("name", name);
        imgData.append("slug", slug);
        imgData.append("projectCategoryId", categoryId);
        imgData.append("developer", developer);
        imgData.append("locationId", locationId);
        imgData.append("status", status);
        /*
         * The update endpoint revalidates the whole project, not just the
         * images, so every required field has to ride along. Leaving these
         * three out failed the save with "project type is required" even
         * though the form had them filled in.
         */
        imgData.append("projectType", projectType);
        imgData.append("projectFormat", projectFormat);
        imgData.append("paymentType", paymentType);
        images.forEach((f) => imgData.append("images[]", f));
        await api(`/admin/projects/${id}`, { method: "POST", body: imgData });
      }

      router.push("/admin/projects");
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      /*
       * Laravel sends only the first problem plus "(and N more errors)",
       * which leaves the other fields unnamed — and they are often on a
       * different step than the one showing the banner. List them all.
       */
      const messages = e.errors
        ? Array.from(new Set(Object.values(e.errors).flat()))
        : [];
      setError(
        messages.length > 1
          ? `Please fix ${messages.length} fields: ${messages.join(" ")}`
          : messages[0] || e.message || "Failed to create project",
      );
      if (e.errors) {
        setFieldErrors(e.errors);
        const firstErrorKey = Object.keys(e.errors)[0];
        if (firstErrorKey) {
          if (["name", "slug", "projectCategoryId", "developer", "locationId", "status", "projectType", "projectFormat", "paymentType", "priceFrom"].includes(firstErrorKey)) setStep(1);
          else if (["totalUnits", "description"].includes(firstErrorKey)) setStep(2);
          else if (firstErrorKey === "paymentTerms" || firstErrorKey.startsWith("units")) setStep(3);
          else if (firstErrorKey.startsWith("towers")) setStep(4);
          else if (firstErrorKey === "images") setStep(5);
          else if (["amenities", "highlights"].includes(firstErrorKey)) setStep(6);
          else setStep(7);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center text-[13px] text-gray-500">
        Loading project…
      </div>
    );
  }

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
                    <input autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lahore Smart City" className={adminInputClass} />
                  </Field>
                  <Field label="Slug" required error={fieldError("slug")}>
                    <input autoComplete="off" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="lahore-smart-city" className={adminInputClass} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Project Category" required error={fieldError("projectCategoryId")}>
                    <select autoComplete="off" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={adminSelectClass}>
                      <option value="">Select Category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Developer / Builder" required error={fieldError("developer")}>
                    <input autoComplete="off" value={developer} onChange={(e) => setDeveloper(e.target.value)} placeholder="e.g. DHA, Bahria Town" className={adminInputClass} />
                  </Field>
                  <Field label="Developer Profile" error={fieldError("developerId")}>
                    <select autoComplete="off" value={developerId} onChange={(e) => setDeveloperId(e.target.value)} className={adminSelectClass}>
                      <option value="">No linked profile</option>
                      {developers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Project Type" required error={fieldError("projectType")}>
                    <select autoComplete="off" value={projectType} onChange={(e) => setProjectType(e.target.value)} className={adminSelectClass}>
                      {PROJECT_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Project Format" required error={fieldError("projectFormat")}>
                    <select autoComplete="off" value={projectFormat} onChange={(e) => setProjectFormat(e.target.value)} className={adminSelectClass}>
                      {PROJECT_FORMATS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Payment Type" required error={fieldError("paymentType")}>
                    <select autoComplete="off" value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className={adminSelectClass}>
                      {PAYMENT_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Location" required error={fieldError("locationId")}>
                  <select autoComplete="off" value={locationId} onChange={(e) => setLocationId(e.target.value)} className={adminSelectClass}>
                    <option value="">Select Location</option>
                    {locations.map((l) => <option key={l.id} value={l.id}>{l.parent ? `${l.parent} › ` : ""}{l.name}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Price From (PKR)" error={fieldError("priceFrom")}>
                    <input autoComplete="off" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="e.g. Rs 25 Lac" className={adminInputClass} />
                  </Field>
                  <Field label="Project Status" required error={fieldError("status")}>
                    <select autoComplete="off" value={status} onChange={(e) => setStatus(e.target.value)} className={adminSelectClass}>
                      {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
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
                    <input autoComplete="off" type="number" value={totalUnits} onChange={(e) => setTotalUnits(e.target.value)} placeholder="e.g. 5200" className={adminInputClass} />
                  </Field>
                  <Field label="Total Area" error={fieldError("totalArea")}>
                    <input autoComplete="off" value={totalArea} onChange={(e) => setTotalArea(e.target.value)} placeholder="e.g. 20,000 Kanal" className={adminInputClass} />
                  </Field>
                </div>

                <fieldset className="rounded-lg border border-gray-200 p-4">
                  <legend className="px-1.5 text-[12px] font-semibold text-gray-700">Specifications</legend>
                  <p className="mb-3 text-[10.5px] text-gray-400">Towers, floors and timelines. Leave blank if not applicable.</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Field label="Towers / Buildings" error={fieldError("towersCount")}>
                      <input autoComplete="off" type="number" min={0} value={towersCount} onChange={(e) => setTowersCount(e.target.value)} placeholder="e.g. 3" className={adminInputClass} />
                    </Field>
                    <Field label="Total Floors" error={fieldError("totalFloors")}>
                      <input autoComplete="off" type="number" min={0} value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} placeholder="e.g. 28" className={adminInputClass} />
                    </Field>
                    <Field label="Basement Floors" error={fieldError("basementFloors")}>
                      <input autoComplete="off" type="number" min={0} value={basementFloors} onChange={(e) => setBasementFloors(e.target.value)} placeholder="e.g. 4" className={adminInputClass} />
                    </Field>
                    <Field label="Parking Spaces" error={fieldError("parkingSpaces")}>
                      <input autoComplete="off" type="number" min={0} value={parkingSpaces} onChange={(e) => setParkingSpaces(e.target.value)} placeholder="e.g. 1200" className={adminInputClass} />
                    </Field>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Expected Completion" error={fieldError("expectedCompletion")}>
                      <input autoComplete="off" value={expectedCompletion} onChange={(e) => setExpectedCompletion(e.target.value)} placeholder="e.g. Dec 2027" className={adminInputClass} />
                    </Field>
                    <Field label="Possession Timeline" error={fieldError("possessionTimeline")}>
                      <input autoComplete="off" value={possessionTimeline} onChange={(e) => setPossessionTimeline(e.target.value)} placeholder="e.g. 6 months after completion" className={adminInputClass} />
                    </Field>
                  </div>
                </fieldset>
                <Field label="Description" error={fieldError("description")}>
                  <textarea autoComplete="off" value={description} onChange={(e) => setDescription(e.target.value.slice(0, 5000))} placeholder="Describe the project in detail..." className={adminTextareaClass} maxLength={5000} />
                  <p className="mt-1 text-right text-[10px] text-gray-400">{description.length}/5000</p>
                </Field>
                <Field label="Plot Sizes">
                  {plotSizes.map((s, i) => (
                    <div key={i} className="mt-1 flex gap-2">
                      <input autoComplete="off" value={s} onChange={(e) => { const n = [...plotSizes]; n[i] = e.target.value; setPlotSizes(n); }} placeholder="e.g. 5 Marla" className={adminInputClass} />
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
              <h3 className="text-[15px] font-bold text-gray-900">Payment Plan</h3>
              <p className="mt-1 text-[12px] text-gray-500">
                Set the percentage split once, then add each unit type with just its area and rate.
              </p>
              <div className="mt-5">
                <ProjectUnitsStep
                  units={units}
                  onUnitsChange={setUnits}
                  terms={terms}
                  onTermChange={(k, v) => setTerms((cur) => ({ ...cur, [k]: v }))}
                  error={fieldError("paymentTerms")}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <ProjectTowersStep towers={towers} onChange={setTowers} />
          )}

          {step === 5 && (
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
                        <SafeImage src={URL.createObjectURL(file)} alt="" fill sizes="100px" className="object-cover" unoptimized />
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

          {step === 6 && (
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
                      <input autoComplete="off" value={h} onChange={(e) => { const n = [...highlights]; n[i] = e.target.value; setHighlights(n); }} placeholder="e.g. NOC Approved" className={adminInputClass} />
                      {highlights.length > 1 && (
                        <button type="button" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))} className="text-red-500 text-[11px] font-semibold">Remove</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setHighlights([...highlights, ""])} className="mt-2 text-[11px] font-semibold text-primary hover:underline">+ Add Highlight</button>
                </Field>

                <fieldset className="rounded-lg border border-gray-200 p-4">
                  <legend className="px-1.5 text-[12px] font-semibold text-gray-700">Floor Plans</legend>
                  <p className="mb-3 text-[10.5px] text-gray-400">Layouts offered in the project.</p>
                  {floorPlans.length === 0 && (
                    <p className="rounded-md bg-gray-50 px-3 py-3 text-center text-[11.5px] text-gray-400">No floor plans yet.</p>
                  )}
                  <div className="space-y-3">
                    {floorPlans.map((plan, i) => (
                      <div key={i} className="rounded-md border border-gray-100 bg-gray-50/40 p-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                          <Field label="Name">
                            <input autoComplete="off" value={plan.name} onChange={(e) => setFloorPlans(floorPlans.map((p, j) => j === i ? { ...p, name: e.target.value } : p))} placeholder="e.g. Typical Floor" className={adminInputClass} />
                          </Field>
                          <Field label="Tower">
                            <input autoComplete="off" value={plan.tower} onChange={(e) => setFloorPlans(floorPlans.map((p, j) => j === i ? { ...p, tower: e.target.value } : p))} placeholder="e.g. Tower A" className={adminInputClass} />
                          </Field>
                          <Field label="Floor Number">
                            <input autoComplete="off" value={plan.floorNumber} onChange={(e) => setFloorPlans(floorPlans.map((p, j) => j === i ? { ...p, floorNumber: e.target.value } : p))} placeholder="e.g. 5-20" className={adminInputClass} />
                          </Field>
                          <div className="flex items-end">
                            <button type="button" onClick={() => setFloorPlans(floorPlans.filter((_, j) => j !== i))} className="h-[38px] text-[11px] font-semibold text-red-500 hover:underline">Remove</button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Field label="Description">
                            <input autoComplete="off" value={plan.description} onChange={(e) => setFloorPlans(floorPlans.map((p, j) => j === i ? { ...p, description: e.target.value } : p))} placeholder="e.g. 2 and 3 bed layouts" className={adminInputClass} />
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setFloorPlans([...floorPlans, { name: "", floorNumber: "", tower: "", description: "" }])} className="mt-3 text-[11px] font-semibold text-primary hover:underline">+ Add floor plan</button>
                </fieldset>

                <fieldset className="rounded-lg border border-gray-200 p-4">
                  <legend className="px-1.5 text-[12px] font-semibold text-gray-700">FAQs</legend>
                  <p className="mb-3 text-[10.5px] text-gray-400">Questions buyers ask about this project.</p>
                  {faqs.length === 0 && (
                    <p className="rounded-md bg-gray-50 px-3 py-3 text-center text-[11.5px] text-gray-400">No FAQs yet.</p>
                  )}
                  <div className="space-y-3">
                    {faqs.map((faq, i) => (
                      <div key={i} className="rounded-md border border-gray-100 bg-gray-50/40 p-3">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1 space-y-2">
                            <input autoComplete="off" value={faq.question} onChange={(e) => setFaqs(faqs.map((f, j) => j === i ? { ...f, question: e.target.value } : f))} placeholder="Question" className={adminInputClass} />
                            <textarea autoComplete="off" value={faq.answer} onChange={(e) => setFaqs(faqs.map((f, j) => j === i ? { ...f, answer: e.target.value } : f))} placeholder="Answer" rows={2} className={adminTextareaClass} />
                          </div>
                          <button type="button" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="shrink-0 text-[11px] font-semibold text-red-500 hover:underline">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className="mt-3 text-[11px] font-semibold text-primary hover:underline">+ Add FAQ</button>
                </fieldset>
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">SEO & Settings</h3>
              <p className="mt-1 text-[12px] text-gray-500">Meta information and visibility.</p>
              <div className="mt-5 space-y-4">
                <Field label="Meta Title" error={fieldError("metaTitle")}>
                  <input autoComplete="off" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="e.g. Lahore Smart City — Project Overview" className={adminInputClass} maxLength={70} />
                </Field>
                <Field label="Meta Description" error={fieldError("metaDescription")}>
                  <textarea autoComplete="off" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Short SEO description..." className={adminTextareaClass} maxLength={160} />
                </Field>

                {/* How the project will look in search results. */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="mb-2 text-[11px] font-medium text-gray-400">Search Engine Preview</p>
                  <p className="truncate text-[16px] font-medium leading-snug text-[#1a0dab]">
                    {metaTitle || name || "Project title"}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-green-700">
                    {canonicalUrl || `sarzameen.com/projects/${slug || "project-slug"}`}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-gray-500">
                    {metaDescription || "Add a meta description to see it previewed here."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Focus Keyword" error={fieldError("focusKeyword")}>
                    <input autoComplete="off" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="e.g. apartments in dha lahore" className={adminInputClass} />
                  </Field>
                  <Field label="Canonical URL" error={fieldError("canonicalUrl")}>
                    <input autoComplete="off" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="https://sarzameen.com/projects/..." className={adminInputClass} />
                  </Field>
                </div>

                <details className="group rounded-lg border border-gray-200 p-3">
                  <summary className="cursor-pointer list-none text-[12px] font-semibold text-gray-700">
                    <span className="group-open:hidden">\u25b8 Social sharing (Open Graph)</span>
                    <span className="hidden group-open:inline">\u25be Social sharing (Open Graph)</span>
                  </summary>
                  <p className="mt-1.5 text-[10.5px] text-gray-400">
                    Used when the project is shared on WhatsApp, Facebook or LinkedIn. Falls back to the meta fields above.
                  </p>
                  <div className="mt-3 space-y-3">
                    <Field label="OG Title" error={fieldError("ogTitle")}>
                      <input autoComplete="off" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder={metaTitle || "Shared title"} className={adminInputClass} />
                    </Field>
                    <Field label="OG Description" error={fieldError("ogDescription")}>
                      <textarea autoComplete="off" value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder={metaDescription || "Shared description"} className={adminTextareaClass} />
                    </Field>
                    <Field label="OG Image URL" error={fieldError("ogImage")}>
                      <input autoComplete="off" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://... (1200x630 recommended)" className={adminInputClass} />
                    </Field>
                  </div>
                </details>
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
            {saving
              ? "Saving…"
              : isLastStep
                ? isEdit
                  ? "Save Changes"
                  : "Publish Project"
                : "Next Step"}
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
