import type { MatchInput, ApaResult } from "./types";

const PPI_BANDS: { sl: number; min: number }[] = [
  { sl: 9, min: 2.8 },
  { sl: 8, min: 2.4 },
  { sl: 7, min: 2.02 },
  { sl: 6, min: 1.68 },
  { sl: 5, min: 1.38 },
  { sl: 4, min: 1.12 },
  { sl: 3, min: 0.88 },
  { sl: 2, min: 0.66 },
  { sl: 1, min: 0 },
];

const MAX_PPI = 3.5;


/**
 * Optional defensive-shot adjustment.
 *
 * If defensive shots are not supplied,
 * falls back to raw innings.
 */
export function apa9PPI(m: MatchInput): number {
  const innings = Math.max(1, m.innings ?? 0);
  const defensiveShots = m.defensive_shots ?? m.defensiveShots ?? 0;
  const adjustedInnings = Math.max(1, innings - defensiveShots * 0.5);
  const ppi = (m.points_earned ?? 0) / adjustedInnings;
  return Math.min(ppi, MAX_PPI); // cap flukey short matches
}

export function ppiToSkillLevel(ppi: number): number {
  for (const band of PPI_BANDS) {
    if (ppi >= band.min) return band.sl;
  }
  return 1;
}

/**
 * Returns a fractional SL.
 *
 * Example:
 * 3.7 PPI may become 6.75 instead of
 * instantly jumping from 6 to 7.
 */
export function ppiToFractionalSL(ppi: number): number {
  for (let i = 0; i < PPI_BANDS.length - 1; i++) {
    const upper = PPI_BANDS[i];
    const lower = PPI_BANDS[i + 1];
    if (ppi >= lower.min && ppi < upper.min) {
      const pct = (ppi - lower.min) / (upper.min - lower.min);
      return lower.sl + pct;
    }
  }
  return ppi >= PPI_BANDS[0].min ? 9 : 1;
}

export function apa9Performance(
  matches: MatchInput[],
  currentSL: number,
): ApaResult | null {
  const nine = matches.filter((m) => m.system === "apa9");

  if (nine.length === 0) {
    return null;
  }

  const ppis = nine.map(apa9PPI).sort((a, b) => b - a);

  /**
   * Ceiling sample:
   * Top 10 performances.
   */
  const topTen = ppis.slice(0, 10);

  /**
   * Weighted ceiling average.
   *
   * Best match gets largest weight.
   */
  const weightedPPI = topTen.reduce((sum, ppi, idx) => {
    const weight = topTen.length - idx;
    return sum + ppi * weight;
  }, 0);

  const totalWeight = topTen.reduce(
    (sum, _, idx) => sum + (topTen.length - idx),
    0,
  );

  const avgPPI = weightedPPI / totalWeight;

  const computedSL = ppiToFractionalSL(avgPPI);

  /**
   * Confidence grows with sample size.
   *
   * 0 matches => 0%
   * 10+ matches => 70%
   */
  const confidence = Math.min(nine.length / 10, 1) * 0.7;

  const blended = currentSL * (1 - confidence) + computedSL * confidence;

  return {
    skillLevel: Math.round(blended),
    avgScore: Number(avgPPI.toFixed(2)),
    sampleSize: nine.length,
  };
}

export function apa9ScoreSeries(matches: MatchInput[]): number[] {
  return matches.filter((m) => m.system === "apa9").map(apa9PPI);
}
