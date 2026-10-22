import { priceInWords } from "@/lib/utils/format";

type PriceInWordsProps = {
  /** Raw field value, which may be empty or not yet a number. */
  value: string | number | null | undefined;
  className?: string;
};

/**
 * Spells out a price under the field it belongs to, as it is typed.
 *
 * A mistyped digit is hard to catch in a long number: 250000 and 2500000
 * look alike at a glance but are ten times apart. Reading back "2 Lakh 50
 * Thousand" against "25 Lakh" makes the slip obvious before saving.
 */
export default function PriceInWords({ value, className }: PriceInWordsProps) {
  const amount =
    typeof value === "number"
      ? value
      : Number(String(value ?? "").replace(/,/g, ""));

  const words = priceInWords(amount);
  if (!words) return null;

  return (
    <p
      className={
        className ?? "mt-1 text-[11px] font-medium text-primary"
      }
    >
      {words}
    </p>
  );
}
