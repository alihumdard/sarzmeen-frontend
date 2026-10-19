type AreaLineChartProps = {
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
};

export default function AreaLineChart({
  data,
  labels,
  height = 220,
  color = "#1f7a4d",
}: AreaLineChartProps) {
  const width = 700;
  const paddingTop = 12;
  const paddingBottom = 24;
  const chartHeight = height - paddingTop - paddingBottom;

  if (!data.length) {
    return (
      <div className="flex h-[220px] w-full items-center justify-center text-[13px] text-gray-400">
        No data available
      </div>
    );
  }

  // One point cannot describe a trend, and the area path collapses to a
  // sliver. Say so rather than drawing an empty box.
  if (data.length === 1) {
    return (
      <div className="flex h-[220px] w-full flex-col items-center justify-center gap-1 text-gray-400">
        <span className="text-[22px] font-bold text-gray-700">
          {data[0].toLocaleString()}
        </span>
        <span className="text-[12px]">{labels[0]}</span>
        <span className="mt-1 text-[11px]">
          More days of data are needed to show a trend.
        </span>
      </div>
    );
  }

  /*
   * Baseline at zero rather than the lowest value. Scaling from the minimum
   * puts a flat series — every day the same, which a new site has — along the
   * very bottom edge, where the line is invisible against the axis.
   */
  const max = Math.max(...data, 0);
  const min = 0;
  const range = max - min || 1;

  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((value, index) => {
    const x = data.length > 1 ? index * stepX : width / 2;
    const y =
      paddingTop + chartHeight - ((value - min) / range) * chartHeight;
    return { x, y, value };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${width} ${paddingTop + chartHeight} L 0 ${
    paddingTop + chartHeight
  } Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[220px] w-full"
        /*
          `none` stretched the drawing to fill the box, which smeared the
          labels and squashed the point circles into ovals. Letting it scale
          evenly keeps the text legible.
        */
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#areaFill)" />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3.5"
            fill="#fff"
            stroke={color}
            strokeWidth="2"
          />
        ))}

        {/*
          A month of daily labels cannot fit across this width — drawn in
          full they overlapped into an unreadable smear. Show roughly six,
          evenly spaced, always including the last so the series ends on a
          dated point.
        */}
        {labels.map((label, index) => {
          const step = Math.max(1, Math.ceil(labels.length / 6));
          const isLast = index === labels.length - 1;
          if (!isLast && index % step !== 0) return null;
          // Drop a label that would collide with the last one.
          if (!isLast && labels.length - 1 - index < step / 2) return null;

          return (
            <text
              key={label}
              x={labels.length > 1 ? index * (width / (labels.length - 1)) : width / 2}
              y={height - 6}
              fontSize="11"
              fill="#9ca3af"
              textAnchor={index === 0 ? "start" : isLast ? "end" : "middle"}
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
