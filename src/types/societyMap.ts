import type { BlogPost } from "@/types/blog";

/** A city that has at least one published map. */
export type MapCity = {
  id: string;
  name: string;
  slug: string;
  mapCount: number;
};

export type SocietyMap = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** The map itself, at the size it was uploaded, for zooming into. */
  image: string;
  /** What the download button hands over: the PDF, or the image. */
  download: string;
  hasDocument: boolean;
  society?: { id: string; name: string; slug: string } | null;
  city?: { id: string; name: string; slug: string } | null;
  featured: boolean;
  views: number;
  downloads: number;
  publishedAt: string | null;
  /** Only the single-map page carries the write-up. */
  description?: string;
  blogs?: BlogPost[];
  metaTitle: string | null;
  metaDescription: string | null;
};

export type SocietyMapInput = {
  title: string;
  locationId: number;
  summary?: string;
  description?: string;
  status: "draft" | "published" | "archived";
  featured?: boolean;
  sortOrder?: number;
  blogIds?: number[];
  metaTitle?: string;
  metaDescription?: string;
};

/** The most-read maps of one city. */
export type PopularMapGroup = {
  city: { id: string; name: string; slug: string };
  total: number;
  maps: { id: string; slug: string; title: string; views: number }[];
};

/** What a society owner sends in, before an administrator reviews it. */
export type SocietyMapSubmissionInput = {
  societyName: string;
  cityName?: string;
  /** Their claim about the NOC; null means they did not say. */
  nocApproved?: boolean | null;
  nocAuthority?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  contactRole?: string;
  /** Optional photo of the sender, for the reviewer. */
  photoFile?: File | null;
  notes?: string;
  imageFile: File;
  documentFile?: File | null;
};

export type SocietyMapSubmission = {
  id: string;
  reference: string;
  societyName: string;
  cityName: string | null;
  nocApproved: boolean | null;
  nocAuthority: string | null;
  contact: {
    name: string;
    phone: string;
    email: string | null;
    role: string | null;
    photo: string | null;
  };
  notes: string;
  image: string;
  document: string | null;
  status: "pending" | "published" | "rejected";
  statusLabel: string;
  reviewNote: string | null;
  /** False when no email was given, so somebody must ring instead. */
  canEmail?: boolean;
  mapSlug: string | null;
  submittedAt: string | null;
};
