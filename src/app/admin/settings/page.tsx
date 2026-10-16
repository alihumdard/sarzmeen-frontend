"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField, {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import {
  getSettings,
  saveSettings,
  type SettingsGroup,
} from "@/lib/api/settings";

type TabKey = "general" | "system" | "email" | "seo" | "appearance";

const tabs: { key: TabKey; label: string; description: string }[] = [
  { key: "general", label: "General", description: "Basic information about your platform." },
  { key: "seo", label: "SEO", description: "How your site appears in search engines and when shared." },
  { key: "appearance", label: "Appearance", description: "Branding, colours and social links." },
  { key: "email", label: "Email", description: "Sender identity and notification rules." },
  { key: "system", label: "System", description: "Platform behaviour and limits." },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [values, setValues] = useState<SettingsGroup>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async (group: TabKey) => {
    setLoading(true);
    setDirty(false);
    try {
      setValues(await getSettings(group));
    } catch {
      setToast({ kind: "error", text: "Could not load these settings." });
      setValues({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(activeTab);
  }, [activeTab, load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (key: string, value: string | number | boolean) => {
    setValues((cur) => ({ ...cur, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings(activeTab, values);
      setDirty(false);
      setToast({ kind: "success", text: "Settings saved." });
    } catch (err: unknown) {
      setToast({
        kind: "error",
        text: err instanceof Error ? err.message : "Could not save settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const tab = tabs.find((t) => t.key === activeTab)!;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Configure your platform without touching code."
        breadcrumbs={[{ label: "Settings" }, { label: tab.label }]}
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-[12px] font-semibold transition-colors ${
              activeTab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 border-b border-gray-100 pb-4">
          <h2 className="text-[14px] font-semibold text-gray-800">
            {tab.label} Settings
          </h2>
          <p className="mt-0.5 text-[11px] text-gray-500">{tab.description}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {activeTab === "general" && <GeneralTab values={values} set={set} />}
            {activeTab === "seo" && <SeoTab values={values} set={set} />}
            {activeTab === "appearance" && <AppearanceTab values={values} set={set} />}
            {activeTab === "email" && <EmailTab values={values} set={set} />}
            {activeTab === "system" && <SystemTab values={values} set={set} />}

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-5">
              {dirty && (
                <span className="mr-auto text-[11px] text-amber-600">
                  You have unsaved changes
                </span>
              )}
              <button
                type="button"
                onClick={() => load(activeTab)}
                disabled={!dirty || saving}
                className="h-9 rounded-md border border-gray-200 px-4 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!dirty || saving}
                className="h-9 rounded-md bg-primary px-5 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-[12px] font-semibold shadow-lg ${
            toast.kind === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

type TabProps = {
  values: SettingsGroup;
  set: (key: string, value: string | number | boolean) => void;
};

const str = (v: unknown) => (v == null ? "" : String(v));
const bool = (v: unknown) => v === true || v === "true" || v === 1;

function GeneralTab({ values, set }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <AdminFormField label="Site Name" name="siteName">
        <input id="siteName" value={str(values.siteName)} onChange={(e) => set("siteName", e.target.value)} className={adminInputClass} />
      </AdminFormField>
      <AdminFormField label="Tagline" name="tagline">
        <input id="tagline" value={str(values.tagline)} onChange={(e) => set("tagline", e.target.value)} className={adminInputClass} />
      </AdminFormField>
      <AdminFormField label="Support Email" name="supportEmail">
        <input id="supportEmail" type="email" value={str(values.supportEmail)} onChange={(e) => set("supportEmail", e.target.value)} className={adminInputClass} />
      </AdminFormField>
      <AdminFormField label="Contact Phone" name="phone">
        <input id="phone" value={str(values.phone)} onChange={(e) => set("phone", e.target.value)} className={adminInputClass} />
      </AdminFormField>
      <AdminFormField label="WhatsApp Number" name="whatsapp">
        <input id="whatsapp" value={str(values.whatsapp)} onChange={(e) => set("whatsapp", e.target.value)} className={adminInputClass} />
      </AdminFormField>
      <AdminFormField label="Timezone" name="timezone">
        <select id="timezone" value={str(values.timezone)} onChange={(e) => set("timezone", e.target.value)} className={adminSelectClass}>
          <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
          <option value="UTC">UTC</option>
        </select>
      </AdminFormField>
      <AdminFormField label="Office Address" name="address" className="sm:col-span-2">
        <input id="address" value={str(values.address)} onChange={(e) => set("address", e.target.value)} className={adminInputClass} />
      </AdminFormField>
      <AdminFormField label="Site Description" name="description" className="sm:col-span-2">
        <textarea id="description" rows={3} value={str(values.description)} onChange={(e) => set("description", e.target.value)} className={adminTextareaClass} />
      </AdminFormField>
    </div>
  );
}

function SeoTab({ values, set }: TabProps) {
  const title = str(values.metaTitle);
  const desc = str(values.metaDescription);

  return (
    <div className="space-y-5">
      {/* Google preview */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="mb-2 text-[11px] font-medium text-gray-400">Search Engine Preview</p>
        <p className="truncate text-[16px] font-medium leading-snug text-[#1a0dab]">
          {title || "Your site title"}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-green-700">
          {str(values.canonicalUrl) || "https://sarzameen.com"}
        </p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-gray-500">
          {desc || "Add a meta description to see it previewed here."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminFormField label="Default Meta Title" name="metaTitle" className="sm:col-span-2">
          <input id="metaTitle" value={title} onChange={(e) => set("metaTitle", e.target.value)} maxLength={70} className={adminInputClass} />
          <p className="mt-1 text-[10px] text-gray-400">{title.length}/70 characters</p>
        </AdminFormField>

        <AdminFormField label="Title Template" name="titleTemplate" className="sm:col-span-2">
          <input id="titleTemplate" value={str(values.titleTemplate)} onChange={(e) => set("titleTemplate", e.target.value)} className={adminInputClass} />
          <p className="mt-1 text-[10px] text-gray-400">
            Use %s for the page name, e.g. &quot;%s | Sarzameen&quot;
          </p>
        </AdminFormField>

        <AdminFormField label="Default Meta Description" name="metaDescription" className="sm:col-span-2">
          <textarea id="metaDescription" rows={3} value={desc} onChange={(e) => set("metaDescription", e.target.value)} maxLength={160} className={adminTextareaClass} />
          <p className="mt-1 text-[10px] text-gray-400">{desc.length}/160 characters</p>
        </AdminFormField>

        <AdminFormField label="Keywords" name="metaKeywords" className="sm:col-span-2">
          <input id="metaKeywords" value={str(values.metaKeywords)} onChange={(e) => set("metaKeywords", e.target.value)} className={adminInputClass} />
        </AdminFormField>

        <AdminFormField label="Canonical URL" name="canonicalUrl">
          <input id="canonicalUrl" value={str(values.canonicalUrl)} onChange={(e) => set("canonicalUrl", e.target.value)} className={adminInputClass} />
        </AdminFormField>

        <AdminFormField label="Social Share Image (OG)" name="ogImage">
          <input id="ogImage" value={str(values.ogImage)} onChange={(e) => set("ogImage", e.target.value)} placeholder="https://..." className={adminInputClass} />
        </AdminFormField>

        <AdminFormField label="Google Analytics ID" name="googleAnalyticsId">
          <input id="googleAnalyticsId" value={str(values.googleAnalyticsId)} onChange={(e) => set("googleAnalyticsId", e.target.value)} placeholder="G-XXXXXXXXXX" className={adminInputClass} />
        </AdminFormField>

        <AdminFormField label="Google Site Verification" name="googleSiteVerification">
          <input id="googleSiteVerification" value={str(values.googleSiteVerification)} onChange={(e) => set("googleSiteVerification", e.target.value)} className={adminInputClass} />
        </AdminFormField>

        <AdminFormField label="Facebook Pixel ID" name="facebookPixelId">
          <input id="facebookPixelId" value={str(values.facebookPixelId)} onChange={(e) => set("facebookPixelId", e.target.value)} className={adminInputClass} />
        </AdminFormField>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2.5">
        <input
          type="checkbox"
          checked={bool(values.robotsIndex)}
          onChange={(e) => set("robotsIndex", e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-[var(--color-primary)]"
        />
        <span>
          <span className="block text-[12px] font-semibold text-gray-700">
            Allow search engines to index this site
          </span>
          <span className="block text-[10px] text-gray-500">
            Turn off while the site is still in development.
          </span>
        </span>
      </label>
    </div>
  );
}

function AppearanceTab({ values, set }: TabProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminFormField label="Logo URL" name="logo">
          <input id="logo" value={str(values.logo)} onChange={(e) => set("logo", e.target.value)} placeholder="/logos/sarzmeen-icon.png" className={adminInputClass} />
        </AdminFormField>
        <AdminFormField label="Favicon URL" name="favicon">
          <input id="favicon" value={str(values.favicon)} onChange={(e) => set("favicon", e.target.value)} placeholder="/favicon.ico" className={adminInputClass} />
        </AdminFormField>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Brand Colours
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ColorField label="Primary" value={str(values.primaryColor)} onChange={(v) => set("primaryColor", v)} />
          <ColorField label="Primary Dark" value={str(values.primaryDark)} onChange={(v) => set("primaryDark", v)} />
          <ColorField label="Primary Light" value={str(values.primaryLight)} onChange={(v) => set("primaryLight", v)} />
        </div>
      </div>

      <AdminFormField label="Footer Text" name="footerText">
        <input id="footerText" value={str(values.footerText)} onChange={(e) => set("footerText", e.target.value)} className={adminInputClass} />
      </AdminFormField>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Social Links
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Facebook" name="facebookUrl">
            <input id="facebookUrl" value={str(values.facebookUrl)} onChange={(e) => set("facebookUrl", e.target.value)} className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Instagram" name="instagramUrl">
            <input id="instagramUrl" value={str(values.instagramUrl)} onChange={(e) => set("instagramUrl", e.target.value)} className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="LinkedIn" name="linkedinUrl">
            <input id="linkedinUrl" value={str(values.linkedinUrl)} onChange={(e) => set("linkedinUrl", e.target.value)} className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="YouTube" name="youtubeUrl">
            <input id="youtubeUrl" value={str(values.youtubeUrl)} onChange={(e) => set("youtubeUrl", e.target.value)} className={adminInputClass} />
          </AdminFormField>
        </div>
      </div>
    </div>
  );
}

function EmailTab({ values, set }: TabProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminFormField label="From Name" name="fromName">
          <input id="fromName" value={str(values.fromName)} onChange={(e) => set("fromName", e.target.value)} className={adminInputClass} />
        </AdminFormField>
        <AdminFormField label="From Address" name="fromAddress">
          <input id="fromAddress" type="email" value={str(values.fromAddress)} onChange={(e) => set("fromAddress", e.target.value)} className={adminInputClass} />
        </AdminFormField>
        <AdminFormField label="Reply-To Address" name="replyTo" className="sm:col-span-2">
          <input id="replyTo" type="email" value={str(values.replyTo)} onChange={(e) => set("replyTo", e.target.value)} className={adminInputClass} />
        </AdminFormField>
      </div>

      <Toggle
        label="Email admins on a new inquiry"
        hint="Sends the lead details to every administrator."
        checked={bool(values.notifyOnInquiry)}
        onChange={(v) => set("notifyOnInquiry", v)}
      />
      <Toggle
        label="Email admins on a new registration"
        checked={bool(values.notifyOnRegistration)}
        onChange={(v) => set("notifyOnRegistration", v)}
      />

      <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-[11px] leading-5 text-amber-700">
        SMTP credentials live in the server&apos;s .env file, not here — these
        settings only control the sender identity and which events send mail.
      </p>
    </div>
  );
}

function SystemTab({ values, set }: TabProps) {
  return (
    <div className="space-y-5">
      <Toggle
        label="Maintenance mode"
        hint="Shows a holding page to visitors. Admins keep full access."
        checked={bool(values.maintenanceMode)}
        onChange={(v) => set("maintenanceMode", v)}
      />
      <Toggle
        label="Allow public registration"
        checked={bool(values.allowRegistration)}
        onChange={(v) => set("allowRegistration", v)}
      />
      <Toggle
        label="Auto-approve new listings"
        hint="Skips moderation. Listings go live as soon as they are submitted."
        checked={bool(values.autoApproveListings)}
        onChange={(v) => set("autoApproveListings", v)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminFormField label="Listings Per Page" name="listingsPerPage">
          <input id="listingsPerPage" type="number" min={1} max={100} value={str(values.listingsPerPage)} onChange={(e) => set("listingsPerPage", Number(e.target.value) || 12)} className={adminInputClass} />
        </AdminFormField>
        <AdminFormField label="Max Images Per Listing" name="maxImagesPerListing">
          <input id="maxImagesPerListing" type="number" min={1} max={50} value={str(values.maxImagesPerListing)} onChange={(e) => set("maxImagesPerListing", Number(e.target.value) || 20)} className={adminInputClass} />
        </AdminFormField>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#1f7a4d"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-gray-200"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={adminInputClass}
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-gray-50 px-3 py-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 cursor-pointer accent-[var(--color-primary)]"
      />
      <span>
        <span className="block text-[12px] font-semibold text-gray-700">{label}</span>
        {hint && <span className="block text-[10px] text-gray-500">{hint}</span>}
      </span>
    </label>
  );
}
