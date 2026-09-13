import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to your Sarzameen.com account to access saved properties, inquiries and property alerts.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Welcome Back!"
      title="Login to Your Account"
      description="Access your saved properties, inquiries, alerts and much more."
    />
  );
}
