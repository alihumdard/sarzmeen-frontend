import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendDirection?: "up" | "down";
  trendText?: string;
  iconClassName?: string;
  className?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendDirection = "up",
  trendText = "from last month",
  iconClassName = "bg-primary/10 text-primary",
  className = "",
}: StatCardProps) {
  const isPositive = trendDirection === "up";

  return (
    /*
      The icon sat beside the figure, which left a wide, shallow card that
      could only fit one per row on a phone. Stacking them lets two sit side
      by side and gives the number room to carry the card.
    */
    <article
      className={[
        "group relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-4",
        "shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]",
        className,
      ].join(" ")}
    >
      {/* A faint wash of the icon's colour, so the cards are not flat white. */}
      <div
        className={[
          "pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-[0.07] transition-opacity group-hover:opacity-[0.12]",
          iconClassName.replace(/text-\S+/g, ""),
        ].join(" ")}
        aria-hidden="true"
      />

      <div
        className={[
          "flex h-9 w-9 items-center justify-center rounded-lg",
          iconClassName,
        ].join(" ")}
      >
        {icon}
      </div>

      <p className="mt-3 text-[10.5px] font-medium uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-[24px] font-bold leading-none tracking-tight text-gray-900 sm:text-[26px]">
        {value}
      </p>

      {trend && (
        <div className="mt-2 flex flex-wrap items-center gap-1 text-[9.5px]">
          <span
            className={[
              "font-semibold",
              isPositive ? "text-green-600" : "text-red-500",
            ].join(" ")}
          >
            {isPositive ? "↑" : "↓"} {trend}
          </span>

          {trendText && <span className="text-gray-400">{trendText}</span>}
        </div>
      )}
    </article>
  );
}