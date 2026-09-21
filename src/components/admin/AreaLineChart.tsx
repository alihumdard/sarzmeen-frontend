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

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const stepX = width / (data.length - 1);

  const points = data.map((value, index) => {
    const x = index * stepX;
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
        className="h-[220px] w-full min-w-[560px]"
        preserveAspectRatio="none"
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

        {labels.map((label, index) => (
          <text
            key={label}
            x={index * stepX}
            y={height - 6}
            fontSize="10"
            fill="#9ca3af"
            textAnchor={
              index === 0 ? "start" : index === labels.length - 1 ? "end" : "middle"
            }
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
