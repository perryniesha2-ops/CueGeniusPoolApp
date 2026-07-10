// components/landing/Sections.tsx
// Loadout grid, readout, final CTA, footer. One file to keep the landing tidy.
import Link from 'next/link';
import Reveal from './Reveal';

interface Module {
  id: string;
  title: string;
  body: string;
  fill: number; // 0–1, bar width
}

const MODULES: Module[] = [
  {
    id: 'MOD_01',
    title: 'PPI Engine',
    body: "Points-per-inning scoring for 9-ball, confidence-weighted so a hot night doesn't fake a rating jump. Your number, earned.",
    fill: 0.92,
  },
  {
    id: 'MOD_02',
    title: 'Inning Logger',
    body: 'One-thumb logging at the table. Tap between turns; the sim rebuilds your whole match afterward.',
    fill: 0.74,
  },
  {
    id: 'MOD_03',
    title: 'Trend Radar',
    body: 'Twelve-week curves on accuracy, breaks, and safeties. Plateaus get flagged before they get comfortable.',
    fill: 0.83,
  },
  {
    id: 'MOD_04',
    title: 'League Grid',
    body: "Team standings, head-to-heads, and who actually shows up on Thursdays. Bragging rights, with receipts.",
    fill: 0.66,
  },
  {
    id: 'MOD_05',
    title: 'Match Replay',
    body: 'Scroll any past match inning by inning. Find the turn where it slipped — and the pattern behind it.',
    fill: 0.88,
  },
  {
    id: 'MOD_06',
    title: 'Export Port',
    body: 'Your data ejects clean: CSV, spreadsheet-ready, yours forever. No lock-in, no ransom.',
    fill: 0.79,
  },
];

function SecLabel({ children }: { children: string }) {
  return (
    <div className="mb-4 font-mono text-[0.72rem] font-bold uppercase tracking-[0.25em] text-cue-volt">
      <span className="text-cue-magenta">█ </span>
      {children}
    </div>
  );
}

export function LoadoutGrid() {
  return (
    <section id="loadout" className="mx-auto max-w-[1240px] px-4 py-20 md:px-8 md:py-24">
      <Reveal>
        <SecLabel>System modules</SecLabel>
        <h2 className="mb-12 font-display text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[0.95]">
          Your{' '}
          <em className="not-italic text-transparent [-webkit-text-stroke:1.5px_#FF2E88]">
            loadout
          </em>
        </h2>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <Reveal key={m.id}>
            <div className="group relative h-full border-2 border-cue-bone/15 bg-cue-void2 p-7 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:border-cue-cyan hover:shadow-[6px_6px_0_rgba(34,228,255,0.35)]">
              <span className="absolute right-4 top-3.5 font-mono text-[0.62rem] text-cue-bone/35">
                {m.id}
              </span>
              <h3 className="mb-3 font-display text-2xl uppercase tracking-[0.03em] text-cue-bone">
                {m.title}
              </h3>
              <p className="text-sm leading-relaxed text-cue-bone/70">{m.body}</p>
              <div className="mt-5 h-2 overflow-hidden bg-cue-bone/10">
                <div
                  className="h-full origin-left bg-gradient-to-r from-cue-magenta to-cue-cyan transition-transform duration-[1200ms] ease-out"
                  style={{ transform: `scaleX(${m.fill})` }}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const READOUT = [
  { value: '7.42', label: 'Points / inning', color: 'text-cue-cyan' },
  { value: '31%', label: 'Break & run', color: 'text-cue-magenta' },
  { value: '184', label: 'Racks logged', color: 'text-cue-volt' },
  { value: '12W', label: 'Current streak', color: 'text-cue-cyan' },
];

export function Readout() {
  return (
    <section id="readout" className="mx-auto max-w-[1240px] px-4 py-20 md:px-8 md:py-24">
      <Reveal>
        <SecLabel>Live readout</SecLabel>
        <h2 className="mb-12 font-display text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[0.95]">
          Numbers that{' '}
          <em className="not-italic text-transparent [-webkit-text-stroke:1.5px_#FF2E88]">
            hit back
          </em>
        </h2>
      </Reveal>
      <Reveal>
        <div className="grid grid-cols-2 gap-8 border-2 border-cue-magenta bg-cue-void2 px-8 py-12 text-center md:grid-cols-4">
          {READOUT.map((s) => (
            <div key={s.label}>
              <div className={`font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-none ${s.color}`}>
                {s.value}
              </div>
              <div className="mt-3 font-mono text-[0.66rem] font-bold uppercase tracking-[0.2em] text-cue-bone/60">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function FinalCta() {
  return (
    <section id="start" className="mx-auto max-w-[1240px] px-4 pb-32 pt-20 text-center md:px-8">
      <Reveal>
        <div className="mb-4 font-mono text-[0.72rem] font-bold uppercase tracking-[0.25em] text-cue-volt">
          <span className="text-cue-magenta">█ </span>Free for 10 days
        </div>
        <h2 className="font-display text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[0.95]">
          Insert coin.
          <br />
          <em className="not-italic text-transparent [-webkit-text-stroke:1.5px_#FF2E88]">
            Press start.
          </em>
        </h2>
        <Link
          href="/signup"
          className="mt-10 inline-block bg-cue-volt px-10 py-4 font-display text-[1.05rem] uppercase tracking-[0.08em] text-cue-void shadow-[6px_6px_0_#FF2E88] transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_#FF2E88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cue-cyan"
        >
          Play free →
        </Link>
      </Reveal>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex flex-wrap justify-between gap-4 border-t-2 border-cue-bone/15 p-8 font-mono text-[0.66rem] uppercase tracking-[0.15em] text-cue-bone/45">
      <span>CUEGENIUS // BREAKPOINT BUILD</span>
      <span>NO QUARTERS REQUIRED</span>
    </footer>
  );
}
