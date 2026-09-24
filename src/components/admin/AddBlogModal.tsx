"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";

type AddBlogModalProps = {
  open: boolean;
  onClose: () => void;
};

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Title, category, content",
  },
  {
    id: 2,
    title: "Media & Featured Image",
    description: "Upload images, gallery",
  },
  {
    id: 3,
    title: "SEO & Meta",
    description: "Meta title, description, keywords",
  },
  {
    id: 4,
    title: "Publishing",
    description: "Status, date, author",
  },
];

const toolbarButtons = [
  { key: "bold", label: "B", className: "font-bold" },
  { key: "italic", label: "I", className: "italic" },
  { key: "underline", label: "U", className: "underline" },
];

export default function AddBlogModal({ open, onClose }: AddBlogModalProps) {
  const [step, setStep] = useState(1);
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

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

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((current) => [...current, value]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((current) => current.filter((t) => t !== tag));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={handleClose}
        className="absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-blog-title"
        className="relative flex h-[min(720px,92vh)] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <DocIcon />
            </span>

            <div>
              <h2 id="add-blog-title" className="text-[18px] font-bold text-gray-900">
                Add New Blog
              </h2>
              <p className="mt-0.5 text-[12px] text-gray-500">
                Create a new blog post to share news, insights or updates.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[240px_1fr]">
          {/* Steps sidebar */}
          <div className="flex min-h-0 flex-col justify-between overflow-y-auto border-b border-gray-100 bg-gray-50/60 p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:border-b-0 md:border-r">
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
                  src="/images/blog-1.jpg"
                  alt=""
                  fill
                  sizes="80px"
                  className="rounded-md object-cover"
                />
              </div>
              <p className="text-[11px] font-semibold text-gray-800">
                Share Your Insights
              </p>
              <p className="mt-1 text-[10.5px] leading-4 text-gray-400">
                Write engaging content to keep your audience informed.
              </p>
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-0 overflow-y-auto p-6">
            {step === 1 && (
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">
                  Basic Information
                </h3>
                <p className="mt-1 text-[12px] text-gray-500">
                  Enter the main details for your blog post.
                </p>

                <div className="mt-5 space-y-4">
                  <Field label="Blog Title" required>
                    <input
                      placeholder="e.g. Top 10 Real Estate Investment Tips in Pakistan"
                      className={adminInputClass}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Category" required>
                      <select defaultValue="" className={adminSelectClass}>
                        <option value="" disabled>
                          Select Category
                        </option>
                        <option>Market Trends</option>
                        <option>Investment</option>
                        <option>Buying Guide</option>
                        <option>Guides</option>
                      </select>
                    </Field>

                    <Field label="Tags" hint="Press Enter to add multiple tags">
                      <input
                        value={tagInput}
                        onChange={(event) => setTagInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="e.g. real estate, investment, lahore"
                        className={adminInputClass}
                      />

                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary"
                            >
                              {tag}
                              <button
                                type="button"
                                aria-label={`Remove tag ${tag}`}
                                onClick={() => removeTag(tag)}
                                className="text-primary/60 hover:text-primary"
                              >
                                <SmallCloseIcon />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </Field>
                  </div>

                  <Field label="Content" required>
                    <div className="overflow-hidden rounded-md border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50/60 px-2 py-1.5">
                        <select
                          defaultValue="Paragraph"
                          className="h-7 rounded border border-gray-200 bg-white px-2 text-[10.5px] text-gray-600 outline-none"
                        >
                          <option>Paragraph</option>
                          <option>Heading 1</option>
                          <option>Heading 2</option>
                        </select>

                        <div className="mx-1 h-4 w-px bg-gray-200" />

                        {toolbarButtons.map((button) => (
                          <ToolbarButton key={button.key} className={button.className}>
                            {button.label}
                          </ToolbarButton>
                        ))}

                        <div className="mx-1 h-4 w-px bg-gray-200" />

                        <ToolbarButton icon={<AlignLeftIcon />} />
                        <ToolbarButton icon={<AlignCenterIcon />} />
                        <ToolbarButton icon={<BulletListIcon />} />
                        <ToolbarButton icon={<NumberedListIcon />} />

                        <div className="mx-1 h-4 w-px bg-gray-200" />

                        <ToolbarButton icon={<LinkIcon />} />
                        <ToolbarButton icon={<ImageIcon />} />
                        <ToolbarButton icon={<QuoteIcon />} />
                        <ToolbarButton icon={<CodeIcon />} />
                        <ToolbarButton icon={<ExpandIcon />} />
                      </div>

                      <textarea
                        value={content}
                        onChange={(event) =>
                          setContent(event.target.value.slice(0, 5000))
                        }
                        placeholder="Write your blog content here..."
                        maxLength={5000}
                        className="min-h-[150px] w-full resize-y border-0 px-3 py-2.5 text-[12px] leading-5 text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </div>

                    <p className="mt-1 text-right text-[10px] text-gray-400">
                      {content.length}/5000
                    </p>
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Featured Image" required>
                      <div className="flex h-[124px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center transition-colors hover:border-primary/40">
                        <UploadIcon />
                        <p className="mt-2 text-[11.5px] font-medium text-gray-600">
                          <span className="text-primary">Click to upload</span> or
                          drag and drop
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          JPG, PNG, WebP (Max 5MB)
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Recommended size: 1200 × 630 px
                        </p>
                      </div>
                    </Field>

                    <Field label="Excerpt">
                      <textarea
                        value={excerpt}
                        onChange={(event) =>
                          setExcerpt(event.target.value.slice(0, 300))
                        }
                        placeholder="A short summary of your blog post..."
                        maxLength={300}
                        className={[adminTextareaClass, "min-h-[124px]"].join(" ")}
                      />
                      <p className="mt-1 text-right text-[10px] text-gray-400">
                        {excerpt.length}/300
                      </p>
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <StepPlaceholder
                title="Media & Featured Image"
                description="Upload extra images to build a gallery for this post."
              >
                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center">
                  <div>
                    <UploadIcon large />
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

            {step === 3 && (
              <StepPlaceholder
                title="SEO & Meta"
                description="Optimize how this post appears in search results."
              >
                <Field label="Meta Title">
                  <input
                    placeholder="e.g. Top 10 Real Estate Investment Tips in Pakistan | Sarzameen"
                    className={adminInputClass}
                  />
                </Field>

                <Field label="Meta Description">
                  <textarea
                    placeholder="Short SEO description shown in search results..."
                    className={adminTextareaClass}
                  />
                </Field>

                <Field label="Meta Keywords" hint="Comma separated">
                  <input
                    placeholder="e.g. real estate, investment, Pakistan"
                    className={adminInputClass}
                  />
                </Field>
              </StepPlaceholder>
            )}

            {step === 4 && (
              <StepPlaceholder
                title="Publishing"
                description="Set the status, publish date and author for this post."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Status" required>
                    <select defaultValue="Draft" className={adminSelectClass}>
                      <option>Draft</option>
                      <option>Published</option>
                      <option>Pending Review</option>
                    </select>
                  </Field>

                  <Field label="Publish Date">
                    <input type="date" className={adminInputClass} />
                  </Field>
                </div>

                <Field label="Author">
                  <select defaultValue="Admin" className={adminSelectClass}>
                    <option>Admin</option>
                    <option>Usman Tariq</option>
                    <option>Ayesha Malik</option>
                    <option>Fahad Hassan</option>
                  </select>
                </Field>
              </StepPlaceholder>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          <div className="flex items-center gap-2.5">
            {isLastStep ? (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <SendIcon />
                  Publish Blog
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Next Step
                <ArrowRightIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[10.5px] text-gray-400">{hint}</p>}
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

function ToolbarButton({
  children,
  icon,
  className = "",
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={[
        "flex h-7 w-7 items-center justify-center rounded text-[11px] text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800",
        className,
      ].join(" ")}
    >
      {icon ?? children}
    </button>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function SmallCloseIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14v18H5z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
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

function SendIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
    </svg>
  );
}

function UploadIcon({ large }: { large?: boolean }) {
  return (
    <svg className={["mx-auto text-gray-300", large ? "h-8 w-8" : "h-6 w-6"].join(" ")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4" />
      <path d="m7 8 5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function AlignLeftIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h10M4 18h13" />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M7 12h10M6 18h12" />
    </svg>
  );
}

function BulletListIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

function NumberedListIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 6h1v2M4 12h1.5M4.5 12 4 13h1.5M4 17h1.5c.5 0 .5.5.5.5s0 .5-.5.5H4" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 0 0 5.7 0l2-2a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M15 12a4 4 0 0 0-5.7 0l-2 2a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 5.5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
