"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
import { api } from "@/lib/api/client";
import {
  fetchPropertySchema,
  groupsFor,
  showsCore,
  type PropertySchema,
} from "@/lib/api/propertySchema";
import SpecFieldGroup from "@/components/admin/SpecFieldGroup";
import type { SpecValue } from "@/components/admin/SpecFieldGroup";
import PaymentPlanStep from "@/components/admin/PaymentPlanStep";
import CustomFeatureList from "@/components/admin/CustomFeatureList";
import LocationPicker from "@/components/admin/LocationPicker";
import PaymentPlanCalculator from "@/components/admin/PaymentPlanCalculator";
import {
  adminInputClass,
  adminSelectClass,
} from "@/components/admin/AdminFormField";

type PropertyData = {
  id: number;
  title: string;
  headline: string | null;
  description: string | null;
  purpose: string;
  price: number;
  negotiable: boolean;
  areaValue: number;
  areaUnit: string;
  beds: number | null;
  baths: number | null;
  livingRooms: number | null;
  kitchens: number | null;
  carParking: number | null;
  floors: number | null;
  furnishing: string | null;
  propertyCondition: string | null;
  status: string;
  categoryId: string | null;
  propertyTypeId: string | null;
  propertyType: string | null;
  typeSlug: string | null;
  category: string | null;
  locationId: string | null;
  location: string | null;
  fullLocation: string | null;
  specs: Record<string, unknown>;
  features: string[];
  images: Array<{ id: number; url: string; isCover: boolean }>;
  metaTitle: string | null;
  metaDescription: string | null;
};

type Location = { id: string; name: string; slug: string; type: string; parent: string | null };

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

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<PropertyData | null>(null);
  const [schema, setSchema] = useState<PropertySchema | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [areaValue, setAreaValue] = useState("");
  const [areaUnit, setAreaUnit] = useState("marla");
  const [locationId, setLocationId] = useState("");
  const [coreNumbers, setCoreNumbers] = useState<Record<string, string>>({});
  const [specs, setSpecs] = useState<Record<string, SpecValue>>({});
  const [features, setFeatures] = useState<string[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // New images to upload
  const [newImages, setNewImages] = useState<File[]>([]);

  const setSpec = (key: string, value: SpecValue) =>
    setSpecs((cur) => ({ ...cur, [key]: value }));

  const applySpecs = (patch: Record<string, string>) =>
    setSpecs((cur) => ({ ...cur, ...patch }));

  const loadProperty = useCallback(async () => {
    try {
      const res = await api<{ data: PropertyData }>(`/my/properties/${propertyId}`);
      const p = res.data;
      setProperty(p);
      setTitle(p.title);
      setDescription(p.description || "");
      setPurpose(p.purpose);
      setPrice(String(p.price));
      setNegotiable(p.negotiable);
      setAreaValue(String(p.areaValue));
      setAreaUnit(p.areaUnit);
      setLocationId(p.locationId || "");
      setSpecs((p.specs || {}) as Record<string, SpecValue>);
      setFeatures(p.features ?? []);
      setMetaTitle(p.metaTitle || "");
      setMetaDescription(p.metaDescription || "");

      const nums: Record<string, string> = {};
      for (const { key } of CORE_NUMBERS) {
        const val = p[key as keyof PropertyData];
        nums[key] = val != null ? String(val) : "";
      }
      setCoreNumbers(nums);
    } catch {
      setError("Failed to load property");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    loadProperty();
    fetchPropertySchema().then(setSchema);
    api<{ data: Location[] }>("/locations").then((r) => setLocations(r.data)).catch(() => {});
  }, [loadProperty]);

  const typeSlug = property?.typeSlug || "";
  const visibleGroups = schema && typeSlug ? groupsFor(schema, typeSlug, purpose) : [];
  const visibleCoreNumbers = schema && typeSlug
    ? CORE_NUMBERS.filter((f) => showsCore(schema, typeSlug, f.key))
    : [];

  const handleSave = async (submitForReview = false) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const body: Record<string, unknown> = {
        title,
        description,
        purpose,
        price: Number(price),
        negotiable,
        areaValue: Number(areaValue),
        areaUnit,
        locationId: locationId || undefined,
        specs,
        features,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
      };

      for (const { key } of visibleCoreNumbers) {
        body[key] = coreNumbers[key] ? Number(coreNumbers[key]) : null;
      }

      if (submitForReview) {
        body.status = "pending";
      }

      await api(`/my/properties/${propertyId}`, {
        method: "PUT",
        body,
      });

      // Upload new images if any
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => formData.append("images[]", file));
        await api(`/my/properties/${propertyId}/images`, {
          method: "POST",
          body: formData,
        });
        setNewImages([]);
      }

      setSuccess(submitForReview ? "Property submitted for review!" : "Property saved!");
      loadProperty();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const deleteImage = async (imageId: number) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api(`/my/properties/${propertyId}/images/${imageId}`, { method: "DELETE" });
      loadProperty();
    } catch {
      setError("Failed to delete image");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="py-20 text-center text-gray-500">
        Property not found.
        <Link href="/admin/properties" className="ml-2 text-primary underline">Back to list</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit: ${property.title}`}
        description={`Status: ${property.status} · Type: ${property.propertyType || "—"} · Category: ${property.category || "—"}`}
        breadcrumbs={[
          { label: "Properties", href: "/admin/properties" },
          { label: "Edit" },
        ]}
        action={
          <div className="flex items-center gap-2">
            {(property.status === "draft" || property.status === "rejected") && (
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-green-600 px-4 text-[11px] font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                Submit for Review
              </button>
            )}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        }
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Title</label>
                <input className={adminInputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Purpose</label>
                  <select className={adminSelectClass} value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                    {PURPOSES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Price (PKR)</label>
                  <input type="number" className={adminInputClass} value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Area</label>
                  <input type="number" className={adminInputClass} value={areaValue} onChange={(e) => setAreaValue(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Unit</label>
                  <select className={adminSelectClass} value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
                    <option value="marla">Marla</option>
                    <option value="kanal">Kanal</option>
                    <option value="sqft">Sq Ft</option>
                    <option value="sqyd">Sq Yd</option>
                    <option value="sqm">Sq M</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Location</label>
                <LocationPicker
                  locations={locations}
                  value={locationId}
                  onChange={setLocationId}
                  className={adminInputClass}
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} />
                Price is negotiable
              </label>
            </div>
          </section>

          {/* Core numbers */}
          {visibleCoreNumbers.length > 0 && (
            <section className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-800">Room Details</h3>
              <div className="grid grid-cols-3 gap-4">
                {visibleCoreNumbers.map(({ key, label }) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                    <input
                      type="number"
                      className={adminInputClass}
                      value={coreNumbers[key] || ""}
                      onChange={(e) => setCoreNumbers((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Type-specific fields */}
          {visibleGroups.length > 0 && (
            <section className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-800">Type-Specific Details</h3>
              {visibleGroups.map(({ name, group }) => (
                <SpecFieldGroup key={name} group={group} values={specs} onChange={setSpec} />
              ))}

              <fieldset className="rounded-lg border border-gray-200 p-4">
                <legend className="px-1.5 text-[12px] font-semibold text-gray-700">
                  Other Features
                </legend>
                <p className="mb-3 text-[11px] text-gray-500">
                  Anything the lists above do not cover. These appear under
                  Features &amp; Amenities on the listing.
                </p>
                <CustomFeatureList values={features} onChange={setFeatures} />
              </fieldset>
            </section>
          )}

          {/* Payment plan for installment */}
          {purpose === "installment" && (
            <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
              <PaymentPlanCalculator specs={specs} onChange={setSpec} onApply={applySpecs} />
              <PaymentPlanStep specs={specs} onChange={setSpec} totalPrice={Number(price) || 0} />
            </section>
          )}

          {/* Description */}
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">Description</h3>
            <RichTextEditor value={description} onChange={setDescription} maxLength={20000} />
          </section>

          {/* SEO */}
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Meta Title</label>
                <input className={adminInputClass} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={70} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Meta Description</label>
                <input className={adminInputClass} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} maxLength={160} />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status card */}
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Status</h3>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
              property.status === "published" ? "bg-green-100 text-green-700"
              : property.status === "pending" ? "bg-amber-100 text-amber-700"
              : property.status === "rejected" ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
            }`}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </span>
            <p className="mt-2 text-xs text-gray-500">
              {property.status === "draft" && "This property is a draft. Submit it for review to get it published."}
              {property.status === "pending" && "Awaiting admin approval."}
              {property.status === "published" && "This property is live on the site."}
              {property.status === "rejected" && "This property was rejected. Edit and resubmit."}
            </p>
          </section>

          {/* Images */}
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Images ({property.images.length})</h3>
            <div className="grid grid-cols-2 gap-2">
              {property.images.map((img) => (
                <div key={img.id} className="group relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                  <SafeImage src={img.url} alt="" fill sizes="120px" className="object-cover" />
                  {img.isCover && (
                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-white">
                      Cover
                    </span>
                  )}
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute right-1 top-1 hidden rounded bg-red-600 p-1 text-white group-hover:block"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Add more images</label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setNewImages(Array.from(e.target.files || []))}
                className="w-full text-xs text-gray-500 file:mr-2 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary"
              />
              {newImages.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {newImages.map((file, i) => (
                    <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                      <SafeImage src={URL.createObjectURL(file)} alt="" fill sizes="80px" className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewImages((prev) => prev.filter((_, j) => j !== i))}
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
          </section>

          {/* Quick info */}
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Property Info</h3>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-gray-500">ID</dt>
                <dd className="font-medium">{property.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Category</dt>
                <dd className="font-medium">{property.category || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd className="font-medium">{property.propertyType || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Location</dt>
                <dd className="font-medium text-right max-w-[150px]">{property.location || "—"}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
