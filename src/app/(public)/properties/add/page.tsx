import type { Metadata } from "next";
import AddPropertyForm from "@/components/property/AddPropertyForm";
import PageBanner from "@/components/layout/PageBanner";
import { ShieldCheckIcon, SupportIcon, UsersIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "List Your Property",
  description:
    "List your property for sale on Sarzameen.com — reach thousands of verified buyers across Lahore.",
};

const benefits = [
  {
    Icon: UsersIcon,
    title: "Wide Reach",
    description: "Thousands of active buyers browse Sarzameen.com every day",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Verified Listings",
    description: "Every submission is reviewed before it goes live",
  },
  {
    Icon: SupportIcon,
    title: "Agent Support",
    description: "Our team helps you close the sale faster",
  },
];

export default function AddPropertyPage() {
  return (
    <main>
      <PageBanner
        title="List Your Property"
        description="Reach thousands of verified buyers across Lahore. Fill in the details below and our team will review your listing within 24 hours."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Add Property" },
        ]}
        image="/images/interior-1.jpg"
      />

      <section className="bg-surface py-8 sm:py-10">
        <div className="container-page grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <AddPropertyForm />

          <aside className="space-y-4">
            <div className="rounded-lg border border-border bg-white p-5 shadow-[0_12px_34px_rgba(15,35,28,0.08)] sm:p-6">
              <h3 className="text-[15px] font-bold text-heading">
                Why List With Us?
              </h3>

              <ul className="mt-4 flex flex-col gap-4">
                {benefits.map(({ Icon, title, description }) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-heading">
                        {title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-primary p-5 text-white sm:p-6">
              <h3 className="text-[15px] font-bold">Need Help Listing?</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/85">
                Our team can list your property for you over a quick call.
              </p>
              <a
                href="tel:+923001234567"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary-light"
              >
                Call +92 300 1234567
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
