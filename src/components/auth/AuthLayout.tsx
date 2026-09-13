import Image from "next/image";
import AuthBenefits from "@/components/auth/AuthBenefits";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import StayUpdatedStrip from "@/components/layout/StayUpdatedStrip";

/** Interior photo behind the auth banner. */
const BANNER_IMAGE = "/images/interior-1.jpg";

type AuthLayoutProps = {
  /** Small green line above the heading, e.g. "Welcome Back!". */
  eyebrow: string;
  title: string;
  description: string;
};

/**
 * Shared shell for the login and register pages: photo banner, the two-up
 * auth card that overlaps it, then the benefits row.
 *
 * Both forms are always rendered so a visitor can switch without a page
 * load; only the banner copy differs between the two routes.
 */
export default function AuthLayout({
  eyebrow,
  title,
  description,
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
          <div className="mx-auto -mt-20 max-w-[1060px] rounded-lg border border-border bg-white p-6 shadow-[0_18px_48px_rgba(15,35,28,0.12)] sm:-mt-24 sm:p-9 lg:px-12 lg:py-10">
            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Vertical rule with the OR chip, desktop only. */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block"
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-[11px] font-semibold text-muted lg:flex"
              >
                OR
              </span>

              <LoginForm />
              <RegisterForm />
            </div>
          </div>
        </div>
      </section>

      <AuthBenefits />

      <StayUpdatedStrip theme="dark" />
    </main>
  );
}
