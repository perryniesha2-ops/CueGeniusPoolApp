import type { MatchInput, ApaResult } from "./types";

// APA 9-ball points needed to win, by skill level.
export const NINE_BALL_TARGET: Record<number, number> = {
  1: 14,
  2: 19,
  3: 25,
  4: 31,
  5: 38,
  6: 46,
  7: 55,
  8: 65,
  9: 75,
};

// Points per inning, scaled by how many points this player needed.
// Returns a "fraction of target earned per inning."
export function apa9MatchScore(m: MatchInput, playerSL: number): number {
  const innings = Math.max(1, m.innings ?? 0);
  const points = m.points_earned ?? 0;
  const target = NINE_BALL_TARGET[playerSL] ?? NINE_BALL_TARGET[4];
  return points / innings / target;
}

// Map that scaled rate onto a performance skill level (1–9).
// These bands are a starting calibration — tune once you have real data.
export function apa9SkillLevel(scaledScore: number): number {
  if (scaledScore >= 0.28) return 9;
  if (scaledScore >= 0.24) return 8;
  if (scaledScore >= 0.2) return 7;
  if (scaledScore >= 0.16) return 6;
  if (scaledScore >= 0.13) return 5;
  if (scaledScore >= 0.1) return 4;
  if (scaledScore >= 0.07) return 3;
  if (scaledScore >= 0.04) return 2;
  return 1;
}

export function apa9Performance(
  matches: MatchInput[],
  playerSL: number,
): ApaResult | null {
  const nine = matches.filter((m) => m.system === "apa9");
  if (nine.length === 0) return null;
  const scores = nine.map((m) => apa9MatchScore(m, playerSL));
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return {
    skillLevel: apa9SkillLevel(avg),
    avgScore: Math.round(avg * 1000) / 1000,
    sampleSize: nine.length,
  };
}

export function apa9ScoreSeries(
  matches: MatchInput[],
  playerSL: number,
): number[] {
  return matches
    .filter((m) => m.system === "apa9")
    .map((m) => apa9MatchScore(m, playerSL));
}
