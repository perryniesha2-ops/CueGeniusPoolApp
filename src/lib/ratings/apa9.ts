import type { MatchInput, ApaResult } from "./types";

// Average points-per-inning thresholds for each 9-ball skill level.
// Reverse-engineered approximation — calibrate against known players.
const PPI_BANDS: { sl: number; min: number }[] = [
  { sl: 9, min: 4.6 },
  { sl: 8, min: 4.2 },
  { sl: 7, min: 3.8 },
  { sl: 6, min: 3.4 },
  { sl: 5, min: 3.0 },
  { sl: 4, min: 2.6 },
  { sl: 3, min: 2.2 },
  { sl: 2, min: 1.7 },
  { sl: 1, min: 0 },
];

// One match's points per inning.
export function apa9PPI(m: MatchInput): number {
  const innings = Math.max(1, m.innings ?? 0);
  const points = m.points_earned ?? 0;
  return points / innings;
}

// Map an average PPI onto a raw skill level (1–9).
export function ppiToSkillLevel(ppi: number): number {
  for (const band of PPI_BANDS) {
    if (ppi >= band.min) return band.sl;
  }
  return 1;
}

// Estimate performance SL, anchored to the player's current SL so a small,
// noisy sample can't overreact. Averages the player's BEST games (top 7 of
// the window) to mirror the APA's "rate your ceiling" philosophy.
export function apa9Performance(
  matches: MatchInput[],
  currentSL: number,
): ApaResult | null {
  const nine = matches.filter((m) => m.system === "apa9");
  if (nine.length === 0) return null;

  // Best games first, take the top 7 (or fewer if the window is small).
  const ppis = nine.map(apa9PPI).sort((a, b) => b - a);
  const best = ppis.slice(0, 7);
  const avgPPI = best.reduce((a, b) => a + b, 0) / best.length;

  const computedSL = ppiToSkillLevel(avgPPI);

  // Confidence grows with sample size, capped so we never fully drop the anchor.
  const w = Math.min(nine.length / 10, 1) * 0.7;
  const blended = currentSL * (1 - w) + computedSL * w;

  return {
    skillLevel: Math.round(blended),
    avgScore: Math.round(avgPPI * 100) / 100, // now reads as PPI
    sampleSize: nine.length,
  };
}

// The PPI series for the trend line (chronological order in, as given).
export function apa9ScoreSeries(matches: MatchInput[]): number[] {
  return matches.filter((m) => m.system === "apa9").map(apa9PPI);
}
