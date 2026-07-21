import type { Match } from "./types";
import { apaPerformance } from "./apa8";
import { apa9Performance } from "./apa9";
import { fargoPerformance } from "./fargo";

export type Insight = {
  icon: "flame" | "trending-down" | "trophy" | "target" | "trending-up" | "bar-chart";
  text: string;
};



/**
 * Generate a small set of plain-language insights from a player's matches.
 * Each insight is GUARDED: it only appears when there's enough data to make
 * it true and meaningful. Returns [] when nothing worth saying.
 */
export function buildInsights(
  matches: Match[],
  ownRatings: { apa8: number | null; apa9: number | null; fargo: number | null },
): Insight[] {
  const insights: Insight[] = [];

  // Sort chronologically (oldest first) for trend math.
  const chrono = [...matches].sort(
    (a, b) =>
      new Date(a.played_at ?? 0).getTime() -
      new Date(b.played_at ?? 0).getTime(),
  );

  // --- Recent form: last 5 win rate vs prior 5+ ---
const wins = chrono.map((m) => (m.won ? 1 : 0) as number);
  if (wins.length >= 8) {
    const recent = wins.slice(-5);
    const prior = wins.slice(0, -5);
    const recentRate = recent.reduce((a, b) => a + b, 0) / recent.length;
    const priorRate = prior.reduce((a, b) => a + b, 0) / prior.length;
    const recentWins = recent.reduce((a, b) => a + b, 0);
    if (recentRate - priorRate >= 0.25) {
      insights.push({
        icon: "flame",
        text: `You've won ${recentWins} of your last 5 — you're heating up.`,
      });
    } else if (priorRate - recentRate >= 0.25) {
      insights.push({
        icon: "trending-down",
        text: `You've won ${recentWins} of your last 5 — a bit below your usual form.`,
      });
    }
  }

  // --- Overall recent win rate (if no form-change insight fired) ---
  if (insights.length === 0 && wins.length >= 5) {
    const last10 = wins.slice(-10);
    const w = last10.reduce((a, b) => a + b, 0);
    if (w / last10.length >= 0.6) {
      insights.push({
        icon: "trophy",
        text: `You've won ${w} of your last ${last10.length} matches.`,
      });
    }
  }

  // --- Format comparison: which system you perform highest in ---
  const perf: { label: string; level: number | null }[] = [
    { label: "8-ball", level: apaPerformance(matches)?.skillLevel ?? null },
    {
      label: "9-ball",
      level: apa9Performance(matches, ownRatings.apa9 ?? 4)?.skillLevel ?? null,
    },
  ];
  const rated = perf.filter((p) => p.level != null) as {
    label: string;
    level: number;
  }[];
  if (rated.length === 2 && rated[0].level !== rated[1].level) {
    const best = rated[0].level > rated[1].level ? rated[0] : rated[1];
    const other = rated[0].level > rated[1].level ? rated[1] : rated[0];
    insights.push({
      icon: "target",
      text: `You perform higher in ${best.label} (SL ${best.level}) than ${other.label} (SL ${other.level}).`,
    });
  }

  // --- Performance trajectory (9-ball PPI trend over recent matches) ---
  const nine = chrono.filter((m) => m.system === "apa9");
  if (nine.length >= 6) {
    const half = Math.floor(nine.length / 2);
    const older = nine.slice(0, half);
    const newer = nine.slice(half);
    const ppi = (ms: Match[]) =>
      ms.reduce(
        (s, m) => s + (m.points_earned ?? 0) / Math.max(1, m.innings ?? 1),
        0,
      ) / ms.length;
    const delta = ppi(newer) - ppi(older);
    if (Math.abs(delta) >= 0.3) {
      insights.push({
        icon: delta > 0 ? "trending-up" : "trending-down",
        text:
          delta > 0
            ? `Your 9-ball scoring is trending up recently (+${delta.toFixed(1)} PPI).`
            : `Your 9-ball scoring has dipped recently (${delta.toFixed(1)} PPI).`,
      });
    }
  }

  // Cap at 3 so the card stays compact.
  return insights.slice(0, 3);
}