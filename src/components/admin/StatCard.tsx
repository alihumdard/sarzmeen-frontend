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
    <article
      className={[
        "rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
        "transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            iconClassName,
          ].join(" ")}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-[22px] font-bold leading-none tracking-tight text-gray-900 sm:text-[24px]">
            {value}
          </p>

          {trend && (
            <div className="mt-2 flex flex-wrap items-center gap-1 text-[9px]">
              <span
                className={[
                  "font-semibold",
                  isPositive ? "text-green-600" : "text-red-500",
                ].join(" ")}
              >
                {isPositive ? "↑" : "↓"} {trend}
              </span>

              {trendText && (
                <span className="text-gray-400">{trendText}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}