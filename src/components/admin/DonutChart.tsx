type DonutSegment = {
  label: string;
  value: number;
  count: number;
  color: string;
};

type DonutChartProps = {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
};

export default function DonutChart({
  segments,
  size = 132,
  thickness = 22,
}: DonutChartProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  const arcs = segments.reduce<
    { dash: number; offset: number }[]
  >((acc, segment) => {
    const fraction = total > 0 ? segment.value / total : 0;
    const dash = fraction * circumference;
    const previous = acc.length > 0 ? acc[acc.length - 1] : null;
    const offset = previous ? previous.offset + previous.dash : 0;
    return [...acc, { dash, offset }];
  }, []);

  return (
    <div className="flex items-center gap-6">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 shrink-0"
      >
        {segments.map((segment, index) => {
          const { dash, offset } = arcs[index];

          return (
            <circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          );
        })}
      </svg>

      <ul className="flex-1 space-y-2.5">
        {segments.map((segment) => (
          <li
            key={segment.label}
            className="flex items-center justify-between gap-3 text-[11px]"
          >
            <span className="flex items-center gap-2 text-gray-600">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label}
            </span>

            <span className="whitespace-nowrap text-gray-400">
              {segment.value}% ({segment.count})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
