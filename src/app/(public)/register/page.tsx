import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your free Sarzameen.com account to save properties, get alerts and manage your inquiries.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      variant="register"
      eyebrow="Get Started!"
      title="Create Your Account"
      description="Save properties, get instant alerts and manage all your inquiries in one place."
    />
  );
}
