type StatusBadgeProps = {
  status: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
};

const statusVariants: Record<
  string,
  "success" | "warning" | "danger" | "info" | "neutral"
> = {
  active: "success",
  published: "success",
  approved: "success",
  available: "success",
  completed: "success",
  enabled: "success",

  pending: "warning",
  draft: "warning",
  processing: "warning",
  inactive: "neutral",

  rejected: "danger",
  cancelled: "danger",
  expired: "danger",
  failed: "danger",

  featured: "info",
  new: "info",
};

const variantClasses = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/10",
  danger: "bg-red-50 text-red-700 ring-red-600/10",
  info: "bg-blue-50 text-blue-700 ring-blue-600/10",
  neutral: "bg-gray-100 text-gray-600 ring-gray-500/10",
};

const dotClasses = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-gray-400",
};

export default function StatusBadge({
  status,
  variant,
  size = "sm",
  dot = true,
  className = "",
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const resolvedVariant =
    variant ?? statusVariants[normalizedStatus] ?? "neutral";

  return (
    <span
      className={[
        "inline-flex w-fit items-center gap-1.5 rounded-full font-medium ring-1 ring-inset",
        size === "md"
          ? "px-2.5 py-1 text-[11px]"
          : "px-2 py-0.5 text-[10px]",
        variantClasses[resolvedVariant],
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          className={[
            "rounded-full",
            size === "md" ? "h-1.5 w-1.5" : "h-1.5 w-1.5",
            dotClasses[resolvedVariant],
          ].join(" ")}
        />
      )}

      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}