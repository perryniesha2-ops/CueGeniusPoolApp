// components/landing/MarqueeBand.tsx
// Server component. Alternating filled/hollow words on a tilted band.

const WORDS = ['Break', 'Run', 'Repeat'];

export default function MarqueeBand() {
  const items = Array.from({ length: 12 }, (_, i) => WORDS[i % 3]);
  return (
    <div
      className="scale-[1.02] -rotate-[1.2deg] overflow-hidden whitespace-nowrap border-y-[3px] border-cue-void bg-cue-cyan py-2 font-display text-[clamp(1.4rem,3.4vw,2.6rem)] uppercase text-cue-void"
      aria-hidden="true"
    >
      <div className="inline-block animate-ticker-slow motion-reduce:animate-none">
        {[...items, ...items].map((w, i) => (
          <span
            key={i}
            className={
              i % 2 === 1
                ? 'mx-6 text-transparent [-webkit-text-stroke:1.5px_#0E0616]'
                : 'mx-6'
            }
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
