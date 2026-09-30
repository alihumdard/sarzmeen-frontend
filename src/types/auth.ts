export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  city: string | null;
  role: "admin" | "agency" | "agent" | "user";
  status: "pending" | "approved" | "rejected" | "suspended";
  emailVerified: boolean;
  joinedAt: string;
};
