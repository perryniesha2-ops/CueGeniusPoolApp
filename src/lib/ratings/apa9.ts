import type { MatchInput, ApaResult } from "./types";

// One match's score: points earned per inning. Higher = stronger.
export function apa9MatchScore(m: MatchInput): number {
  const innings = Math.max(1, m.innings ?? 0);
  const points = m.points_earned ?? 0;
  return points / innings;
}

// Map average points-per-inning onto a 9-ball skill level (1–9).
// Higher points-per-inning is better, so the bands run the opposite
// direction from 8-ball.
export function apa9SkillLevel(avgScore: number): number {
  if (avgScore >= 14) return 9;
  if (avgScore >= 12) return 8;
  if (avgScore >= 10) return 7;
  if (avgScore >= 8) return 6;
  if (avgScore >= 6) return 5;
  if (avgScore >= 4) return 4;
  if (avgScore >= 3) return 3;
  if (avgScore >= 2) return 2;
  return 1;
}

export function apa9Performance(matches: MatchInput[]): ApaResult | null {
  const nine = matches.filter((m) => m.system === "apa9");
  if (nine.length === 0) return null;
  const scores = nine.map(apa9MatchScore);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return {
    skillLevel: apa9SkillLevel(avg),
    avgScore: Math.round(avg * 100) / 100,
    sampleSize: nine.length,
  };
}

export function apa9ScoreSeries(matches: MatchInput[]): number[] {
  return matches.filter((m) => m.system === "apa9").map(apa9MatchScore);
}
