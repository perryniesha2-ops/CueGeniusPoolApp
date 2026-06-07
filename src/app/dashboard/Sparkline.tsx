// Pure display component — draws a small trend line from a list of numbers.
export default function Sparkline({
  values,
  invert = false,
}: {
  values: number[];
  invert?: boolean;
}) {
  if (values.length < 2) {
    return (
      <p style={{ color: "#888", fontSize: 13 }}>
        Log at least 2 to see a trend.
      </p>
    );
  }

  const W = 300,
    H = 50,
    pad = 4;
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }

  const x = (i: number) => pad + (i / (values.length - 1)) * (W - 2 * pad);
  const y = (v: number) => {
    let t = (v - min) / (max - min);
    if (invert) t = 1 - t;
    return pad + (1 - t) * (H - 2 * pad);
  };

  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${pad},${H} ${points} ${W - pad},${H}`;
  const last = values.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 50 }}>
      <polygon points={area} fill="rgba(31,111,139,0.12)" />
      <polyline
        points={points}
        fill="none"
        stroke="#1f6f8b"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={x(last)} cy={y(values[last])} r={3.5} fill="#1f6f8b" />
    </svg>
  );
}
