import type { MatchInput, ApaResult } from "./types";

// One match's score: (innings minus safeties) per game won.
export function apaMatchScore(m: MatchInput): number {
  const gamesWon = Math.max(1, m.games_won ?? 0);
  const innings = m.innings ?? 0;
  const safeties = m.safeties ?? 0;
  return Math.max(0.1, (innings - safeties) / gamesWon);
}

// Map an average score onto an APA 8-ball skill level (2–7).
export function apaSkillLevel(avgScore: number): number {
  if (avgScore <= 2.0) return 7;
  if (avgScore <= 3.0) return 6;
  if (avgScore <= 4.0) return 5;
  if (avgScore <= 5.0) return 4;
  if (avgScore <= 7.0) return 3;
  return 2;
}

// Performance over a set of matches (caller passes the most recent 10).
export function apaPerformance(matches: MatchInput[]): ApaResult | null {
  const apa = matches.filter((m) => m.system === "apa8");
  if (apa.length === 0) return null;
  const scores = apa.map(apaMatchScore);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return {
    skillLevel: apaSkillLevel(avg),
    avgScore: Math.round(avg * 100) / 100,
    sampleSize: apa.length,
  };
}

// The per-match scores, in the order given (pass chronological for a trend).
export function apaScoreSeries(matches: MatchInput[]): number[] {
  return matches.filter((m) => m.system === "apa8").map(apaMatchScore);
}
