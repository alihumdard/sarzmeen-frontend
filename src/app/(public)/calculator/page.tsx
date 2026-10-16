import type { Metadata } from "next";
import PageBanner from "@/components/layout/PageBanner";
import PaymentCalculator from "@/components/tools/PaymentCalculator";

export const metadata: Metadata = {
  title: "Payment Plan Calculator",
  description:
    "Work out booking, instalments and possession payments for any property in Pakistan. Enter the area and rate, or a total price, and see the full schedule.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function num(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Arriving from a listing pre-fills the figures, so the buyer starts there.
  const sp = await searchParams;

  return (
    <main className="bg-surface">
      <PageBanner
        title="Payment Plan Calculator"
        description="Enter a property's size and rate, choose how you want to pay, and see the full instalment schedule instantly."
        crumbs={[{ label: "Home", href: "/" }, { label: "Calculator" }]}
        image="/images/contact-banner.jpg"
      />

      <section className="py-8 sm:py-10">
        <div className="container-page">
          <PaymentCalculator
            initialArea={num(sp.area)}
            initialRate={num(sp.rate)}
            initialPrice={num(sp.price)}
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Tip title="Area × Rate">
              Most Pakistani listings quote a rate per square foot. Multiply it
              by the covered area to get the total price.
            </Tip>
            <Tip title="Booking & Confirmation">
              Usually paid within weeks of each other at the start. Together
              they are commonly 10–30% of the price.
            </Tip>
            <Tip title="Possession">
              The final payment, due when the unit is handed over. The rest is
              spread across instalments in between.
            </Tip>
          </div>
        </div>
      </section>
    </main>
  );
}

function Tip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <h3 className="text-[13px] font-bold text-heading">{title}</h3>
      <p className="mt-1.5 text-[12px] leading-5 text-muted">{children}</p>
    </div>
  );
}
