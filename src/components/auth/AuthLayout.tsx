import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

/** Interior photo behind the auth banner. */
const BANNER_IMAGE = "/images/interior-1.jpg";

type AuthLayoutProps = {
  /** Small green line above the heading, e.g. "Welcome Back!". */
  eyebrow: string;
  title: string;
  description: string;
  /** Which single form this page renders. */
  variant: "login" | "register";
};

/**
 * Shared shell for the login and register pages: photo banner, then a single
 * centered auth card that overlaps it.
 *
 * Each route renders only its own form; switching between them is a real
 * navigation via the links inside each form.
 */
export default function AuthLayout({
  eyebrow,
  title,
  description,
  variant,
}: AuthLayoutProps) {
  return (
    <main>
      {/* Banner. The extra bottom padding leaves room for the card to
          overlap it by the negative margin applied below. */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={BANNER_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,rgba(9,32,25,0.96)_0%,rgba(9,32,25,0.88)_35%,rgba(9,32,25,0.5)_70%,rgba(9,32,25,0.3)_100%)]" />

        {/* The bottom padding is the strip the card overlaps into. */}
        <div className="container-page pb-28 pt-14 sm:pb-32 sm:pt-16">
          <p className="text-[14px] font-bold text-[#3DBB6E]">{eyebrow}</p>

          <h1 className="mt-2.5 text-[28px] font-bold text-white sm:text-[32px]">
            {title}
          </h1>

          <p className="mt-3 max-w-[380px] text-[13px] leading-relaxed text-white/80">
            {description}
          </p>
        </div>
      </section>

      {/* Auth card. `relative z-10` is required: the banner above creates its
          own stacking context with `isolate`, so without it the card's white
          background paints underneath the banner photo where the two overlap
          and only the text shows through. */}
      <section className="relative z-10 bg-surface pb-14">
        <div className="container-page">
          <div className="mx-auto -mt-20 max-w-[480px] rounded-lg border border-border bg-white p-6 shadow-[0_18px_48px_rgba(15,35,28,0.12)] sm:-mt-24 sm:p-9">
            {variant === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </section>
    </main>
  );
}
