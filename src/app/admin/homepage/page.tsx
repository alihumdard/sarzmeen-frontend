"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {

  defaultHero,
  defaultWhyChoose,
  defaultSections,
  defaultTicker,
  type HomepageSettings,
  type WhyChooseFeature,
  type TickerSettings,
  type TickerItem,
} from "@/lib/homepageSettings";
import { getTicker, saveTicker } from "@/lib/api/ticker";
import { getHomepageSettings, saveHomepageSettings } from "@/lib/api/homepage";

const iconOptions = [
  { value: "listings", label: "Listings" },
  { value: "verified", label: "Verified" },
  { value: "search", label: "Search" },
  { value: "support", label: "Support" },
];

const typeBadgeClasses: Record<string, string> = {
  Banner: "bg-gray-100 text-gray-600",
  Properties: "bg-blue-50 text-blue-600",
  Projects: "bg-violet-50 text-violet-600",
  Content: "bg-gray-100 text-gray-600",
  Blogs: "bg-amber-50 text-amber-600",
  Testimonials: "bg-emerald-50 text-emerald-600",
  CTA: "bg-red-50 text-red-500",
};

export default function HomepageCmsPage() {
  const [settings, setSettings] = useState<HomepageSettings>({
    hero: defaultHero,
    whyChoose: defaultWhyChoose,
    sections: defaultSections,
  });
  const [activeTab, setActiveTab] = useState<"sections" | "hero" | "whyChoose" | "ticker">("sections");
  const [ticker, setTicker] = useState<TickerSettings>(defaultTicker);
  const [tickerLoading, setTickerLoading] = useState(true);
  const [tickerSaving, setTickerSaving] = useState(false);
  const [tickerMsg, setTickerMsg] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    getHomepageSettings()
      .then(setSettings)
      .catch(() => setSaveError("Could not load homepage settings."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getTicker()
      .then(setTicker)
      .catch(() => setTickerMsg({ kind: "error", text: "Could not load the ticker." }))
      .finally(() => setTickerLoading(false));
  }, []);

  useEffect(() => {
    if (!tickerMsg) return;
    const t = setTimeout(() => setTickerMsg(null), 3000);
    return () => clearTimeout(t);
  }, [tickerMsg]);

  const update = (partial: Partial<HomepageSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    setDirty(true);
    setSaved(false);
  };

  const updateTicker = (partial: Partial<TickerSettings>) => {
    setTicker((prev) => ({ ...prev, ...partial }));
  };

  const updateTickerItem = (id: string, partial: Partial<TickerItem>) => {
    setTicker((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, ...partial } : i)),
    }));
  };

  const addTickerItem = () => {
    setTicker((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `t-${Date.now()}-${prev.items.length}`, label: "", href: "" },
      ],
    }));
  };

  const removeTickerItem = (id: string) => {
    setTicker((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const moveTickerItem = (index: number, delta: number) => {
    setTicker((prev) => {
      const next = [...prev.items];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, items: next };
    });
  };

  const handleSaveTicker = async () => {
    setTickerSaving(true);
    try {
      await saveTicker(ticker);
      setTickerMsg({ kind: "success", text: "Ticker saved and live on the site." });
    } catch (err: unknown) {
      setTickerMsg({
        kind: "error",
        text: err instanceof Error ? err.message : "Could not save the ticker.",
      });
    } finally {
      setTickerSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await saveHomepageSettings(settings);
      setLastSaved(
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      );
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save the homepage.",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (id: string) => {
    update({
      sections: settings.sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s,
      ),
    });
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const list = [...settings.sections];
    const fromIndex = list.findIndex((s) => s.id === dragId);
    const toIndex = list.findIndex((s) => s.id === targetId);
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    update({ sections: list });
    setDragId(null);
  };

  const updateHero = (field: string, value: string) => {
    update({ hero: { ...settings.hero, [field]: value } });
  };

  const updateWhyChoose = (field: string, value: string) => {
    update({ whyChoose: { ...settings.whyChoose, [field]: value } });
  };

  const updateFeature = (id: string, field: string, value: string) => {
    update({
      whyChoose: {
        ...settings.whyChoose,
        features: settings.whyChoose.features.map((f) =>
          f.id === id ? { ...f, [field]: value } : f,
        ),
      },
    });
  };

  const addFeature = () => {
    const newFeature: WhyChooseFeature = {
      id: Date.now().toString(),
      title: "New Feature",
      description: "Feature description",
      icon: "listings",
    };
    update({
      whyChoose: {
        ...settings.whyChoose,
        features: [...settings.whyChoose.features, newFeature],
      },
    });
  };

  const removeFeature = (id: string) => {
    update({
      whyChoose: {
        ...settings.whyChoose,
        features: settings.whyChoose.features.filter((f) => f.id !== id),
      },
    });
  };

  const publishedCount = settings.sections.filter((s) => s.visible).length;
  const draftCount = settings.sections.length - publishedCount;

  const tabs = [
    { id: "sections" as const, label: "Sections" },
    { id: "hero" as const, label: "Hero Banner" },
    { id: "whyChoose" as const, label: "Why Choose Us" },
    { id: "ticker" as const, label: "News Ticker" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage CMS"
        description="Manage your homepage content, sections and visibility."
        breadcrumbs={[
          { label: "Content Management" },
          { label: "Homepage CMS" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLinkIcon />
              View Live Site
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || saving || loading}
              className={[
                "inline-flex h-9 items-center gap-2 rounded-md px-4 text-[11px] font-semibold text-white shadow-sm transition-all",
                dirty && !saving ? "bg-primary hover:opacity-90" : saved ? "bg-emerald-600" : "bg-gray-300 cursor-not-allowed",
              ].join(" ")}
            >
              <SaveIcon />
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        }
      />

      {saveError && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-700">
          {saveError}
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="Total Sections" value={settings.sections.length} hint="Manage homepage sections" icon={<LayersIcon />} iconClassName="bg-primary/10 text-primary" />
        <SummaryCard label="Published" value={publishedCount} hint="Visible on homepage" icon={<EyeIcon />} iconClassName="bg-emerald-50 text-emerald-600" />
        <SummaryCard label="Draft" value={draftCount} hint="Not visible yet" icon={<ClockIcon />} iconClassName="bg-amber-50 text-amber-600" />
        <SummaryCard label="Last Updated" value={lastSaved ?? "Never"} hint="by Admin" icon={<EditNoteIcon />} iconClassName="bg-violet-50 text-violet-600" />
      </section>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "rounded-md px-4 py-2 text-[12px] font-semibold transition-all",
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sections Tab */}
      {activeTab === "sections" && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-[14px] font-semibold text-gray-800">Homepage Sections</h2>
            <p className="mt-0.5 text-[11px] text-gray-400">Drag to reorder. Toggle to show/hide on homepage.</p>
          </div>

          <div className="divide-y divide-gray-100">
            {settings.sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => setDragId(section.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(section.id)}
                className={[
                  "flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50/70",
                  dragId === section.id ? "opacity-50" : "",
                ].join(" ")}
              >
                <span className="cursor-grab text-gray-400 active:cursor-grabbing">
                  <DragHandleIcon />
                </span>
                <span className="w-6 text-[12px] text-gray-400">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-gray-800">{section.name}</p>
                  <p className="truncate text-[10px] text-gray-400">{section.description}</p>
                </div>
                <span className={["inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium", typeBadgeClasses[section.type] || "bg-gray-100 text-gray-600"].join(" ")}>
                  {section.type}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={section.visible}
                  onClick={() => toggleSection(section.id)}
                  className={["relative h-5 w-9 shrink-0 rounded-full transition-colors", section.visible ? "bg-primary" : "bg-gray-200"].join(" ")}
                >
                  <span className={["absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", section.visible ? "translate-x-[18px]" : "translate-x-0.5"].join(" ")} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Banner Tab */}
      {activeTab === "hero" && (
        <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold text-gray-800">Hero Banner Settings</h2>

            <Field label="Tagline (top badge)" value={settings.hero.tagline} onChange={(v) => updateHero("tagline", v)} />
            <Field label="Heading (use \\n for line break)" value={settings.hero.heading} onChange={(v) => updateHero("heading", v)} multiline />
            <Field label="Highlight Word (colored green)" value={settings.hero.headingHighlight} onChange={(v) => updateHero("headingHighlight", v)} />
            <Field label="Description" value={settings.hero.description} onChange={(v) => updateHero("description", v)} multiline />

            <div className="border-t border-gray-100 pt-4">
              <h3 className="mb-3 text-[12px] font-semibold text-gray-600">Trust Badge</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title" value={settings.hero.trustBadgeTitle} onChange={(v) => updateHero("trustBadgeTitle", v)} />
                <Field label="Subtitle" value={settings.hero.trustBadgeSubtitle} onChange={(v) => updateHero("trustBadgeSubtitle", v)} />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <Field label="Background Image Path" value={settings.hero.backgroundImage} onChange={(v) => updateHero("backgroundImage", v)} />
              <p className="mt-1 text-[10px] text-gray-400">Path relative to /public folder, e.g. /images/hero-home.png</p>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="text-[13px] font-semibold text-gray-800">Preview</h2>
            </div>
            <div className="relative h-[280px] overflow-hidden rounded-b-lg bg-[#031c20]">
              <Image src={settings.hero.backgroundImage} alt="" fill sizes="480px" className="object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col justify-center gap-2 px-5">
                <span className="w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white">
                  {settings.hero.tagline}
                </span>
                <h3 className="max-w-[260px] text-[16px] font-bold leading-tight text-white">
                  {settings.hero.heading.split("\n").map((line, i) => (
                    <span key={i}>{i > 0 && <br />}{line}</span>
                  ))}{" "}
                  <span className="text-[#3DBB6E]">{settings.hero.headingHighlight}</span>
                </h3>
                <p className="max-w-[240px] text-[8px] leading-3.5 text-white/70">
                  {settings.hero.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Tab */}
      {activeTab === "whyChoose" && (
        <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold text-gray-800">Why Choose Sarzameen</h2>

            <Field label="Section Heading" value={settings.whyChoose.heading} onChange={(v) => updateWhyChoose("heading", v)} />
            <Field label="Subtitle" value={settings.whyChoose.subtitle} onChange={(v) => updateWhyChoose("subtitle", v)} />
            <Field label="Image Path" value={settings.whyChoose.image} onChange={(v) => updateWhyChoose("image", v)} />

            <div className="border-t border-gray-100 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-gray-600">Features</h3>
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:opacity-90"
                >
                  <PlusIcon /> Add Feature
                </button>
              </div>

              <div className="space-y-3">
                {settings.whyChoose.features.map((feature) => (
                  <div key={feature.id} className="rounded-lg border border-gray-100 bg-gray-50/50 p-3.5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Title" value={feature.title} onChange={(v) => updateFeature(feature.id, "title", v)} />
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">Icon</label>
                        <select
                          value={feature.icon}
                          onChange={(e) => updateFeature(feature.id, "icon", e.target.value)}
                          className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                        >
                          {iconOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Field label="Description" value={feature.description} onChange={(v) => updateFeature(feature.id, "description", v)} />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeFeature(feature.id)}
                        className="text-[10px] font-semibold text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="text-[13px] font-semibold text-gray-800">Preview</h2>
            </div>
            <div className="p-5">
              <h3 className="text-[15px] font-bold text-gray-800">{settings.whyChoose.heading}</h3>
              <p className="mt-1 text-[10px] text-gray-500">{settings.whyChoose.subtitle}</p>
              <div className="mt-4 space-y-3">
                {settings.whyChoose.features.map((f) => (
                  <div key={f.id} className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                      {f.icon.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-700">{f.title}</p>
                      <p className="text-[9px] text-gray-500">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative mt-4 h-[120px] overflow-hidden rounded-md">
                <Image src={settings.whyChoose.image} alt="Preview" fill sizes="300px" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ticker" && (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-bold text-gray-900">News Ticker</h2>
              <p className="mt-0.5 text-[11px] text-gray-500">
                The scrolling headline strip under the site header. Saved to the
                database, so changes go live for every visitor.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveTicker}
              disabled={tickerSaving || tickerLoading}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              <SaveIcon />
              {tickerSaving ? "Saving..." : "Save Ticker"}
            </button>
          </div>

          {tickerMsg && (
            <p
              className={`mt-3 rounded-md px-3 py-2 text-[12px] font-medium ${
                tickerMsg.kind === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {tickerMsg.text}
            </p>
          )}

          {tickerLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-7 w-7 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Label
                  </label>
                  <input
                    value={ticker.label}
                    onChange={(e) => updateTicker({ label: e.target.value })}
                    placeholder="Latest News"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-[12px] outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Scroll Speed (seconds)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={200}
                    value={ticker.speed}
                    onChange={(e) =>
                      updateTicker({ speed: Number(e.target.value) || 45 })
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-[12px] outline-none focus:border-primary"
                  />
                  <p className="mt-1 text-[10px] text-gray-400">
                    Higher is slower. Default 45.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Visibility
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-50 px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={ticker.enabled}
                      onChange={(e) => updateTicker({ enabled: e.target.checked })}
                      className="h-3.5 w-3.5 cursor-pointer accent-[var(--color-primary)]"
                    />
                    <span className="text-[12px] font-medium text-gray-700">
                      Show the ticker
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <h3 className="text-[12px] font-bold text-gray-800">
                  Headlines ({ticker.items.length})
                </h3>
                <button
                  type="button"
                  onClick={addTickerItem}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 px-3 text-[11px] font-semibold text-gray-700 hover:border-primary hover:text-primary"
                >
                  <PlusIcon /> Add Headline
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {ticker.items.length === 0 && (
                  <p className="rounded-md border border-dashed border-gray-200 py-8 text-center text-[11px] text-gray-400">
                    No headlines yet. The ticker stays hidden until you add one.
                  </p>
                )}

                {ticker.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid gap-2 rounded-lg border border-gray-200 p-3 sm:grid-cols-[1fr_260px_auto]"
                  >
                    <div>
                      <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                        Headline text
                      </label>
                      <input
                        value={item.label}
                        onChange={(e) =>
                          updateTickerItem(item.id, { label: e.target.value })
                        }
                        placeholder="e.g. Bahria Town Karachi | Booking Open"
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-[12px] outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                        Link (optional)
                      </label>
                      <input
                        value={item.href}
                        onChange={(e) =>
                          updateTickerItem(item.id, { href: e.target.value })
                        }
                        placeholder="/properties?type=plot"
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-[12px] outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex items-end gap-1.5">
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={index === 0}
                        onClick={() => moveTickerItem(index, -1)}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-primary disabled:opacity-30"
                      >
                        &uarr;
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={index === ticker.items.length - 1}
                        onClick={() => moveTickerItem(index, 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-primary disabled:opacity-30"
                      >
                        &darr;
                      </button>
                      <button
                        type="button"
                        aria-label="Remove headline"
                        onClick={() => removeTickerItem(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {ticker.enabled && ticker.items.some((i) => i.label.trim()) && (
                <div className="mt-6">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Preview
                  </p>
                  <div className="flex items-center overflow-hidden rounded-md bg-primary text-white">
                    <span className="flex h-10 shrink-0 items-center bg-heading px-4 text-[12px] font-bold uppercase tracking-wide">
                      {ticker.label || "Latest News"}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex w-max items-center">
                        {ticker.items
                          .filter((i) => i.label.trim())
                          .map((i) => (
                            <span key={i.id} className="flex shrink-0 items-center">
                              <span className="mx-4 h-1.5 w-1.5 rounded-full bg-white/50" />
                              <span className="whitespace-nowrap text-[12.5px] font-medium">
                                {i.label}
                              </span>
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* Reusable form field */
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value, hint, icon, iconClassName }: { label: string; value: string | number; hint?: string; icon: React.ReactNode; iconClassName?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <span className={["flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", iconClassName ?? "bg-primary/10 text-primary"].join(" ")}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[11px] text-gray-500">{label}</p>
        <p className="mt-0.5 truncate text-[17px] font-bold leading-none text-gray-900">{String(value)}</p>
        {hint && <p className="mt-1.5 text-[9px] text-gray-400">{hint}</p>}
      </div>
    </div>
  );
}

/* Inline SVG icons */
function PlusIcon() { return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>; }
function LayersIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>; }
function EyeIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>; }
function ClockIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>; }
function EditNoteIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" /><path d="m14.5 6.5 3 3" /></svg>; }
function ExternalLinkIcon() { return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6" /><path d="M10 14 20 4" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></svg>; }
function SaveIcon() { return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h11l3 3v13H5z" /><path d="M8 4v5h7V4M8 20v-6h8v6" /></svg>; }
function DragHandleIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.4" /><circle cx="15" cy="6" r="1.4" /><circle cx="9" cy="12" r="1.4" /><circle cx="15" cy="12" r="1.4" /><circle cx="9" cy="18" r="1.4" /><circle cx="15" cy="18" r="1.4" /></svg>; }
