// components/landing/StatTicker.tsx
// Server component — pure markup. Animation lives in Tailwind keyframes.

const STATS = [
  "PERF SL 5.2 ▲0.4",
  "WIN RATE 62%",
  "PPI 7.42 ▲0.3",
  "WIN STREAK 7",
  "MATCHES LOGGED 184",
  "LAST 10 · 6-4",
  "APA8 PERF SL 5",
  "APA9 PPI 7.42",
  "FARGO 512 ▲6",
];

export default function StatTicker() {
  const items = [...STATS, ...STATS]; // duplicate for seamless -50% loop
  return (
    <div
      className="fixed inset-x-0 top-0 z-[45] overflow-hidden whitespace-nowrap border-b-2 border-cue-void bg-cue-magenta py-1.5 font-mono text-[0.72rem] font-bold text-cue-void"
      aria-hidden="true"
    >
      <div className="inline-block animate-ticker motion-reduce:animate-none">
        {items.map((s, i) => (
          <span key={i} className="mx-8 tracking-[0.12em]">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
