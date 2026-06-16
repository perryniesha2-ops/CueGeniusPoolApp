import type { MatchInput } from "./types";

export interface MatchStats {
  wins: number;
  losses: number;
  winRate: number; // 0–100
  streakType: "W" | "L" | null;
  streakCount: number;
  resultsSeq: boolean[]; // recent → older, for the W/L bar strip
  avgOpponent: number | null;
  beatAbove: { wins: number; total: number }; // record vs higher-rated
}

export function matchStats(matches: MatchInput[]): MatchStats | null {
  if (matches.length === 0) return null;

  const wins = matches.filter((m) => m.won).length;
  const losses = matches.length - wins;
  const winRate = Math.round((wins / matches.length) * 100);

  // Streak: walk from most recent until the result flips.
  const ordered = [...matches].sort(
    (a, b) =>
      new Date(b.played_at ?? 0).getTime() -
      new Date(a.played_at ?? 0).getTime(),
  );
  const streakType = ordered[0].won ? "W" : "L";
  let streakCount = 0;
  for (const m of ordered) {
    if (m.won === (streakType === "W")) streakCount++;
    else break;
  }

  // Opponent context (uses opponent_rating where present).
  const rated = matches.filter((m) => m.opponent_rating != null);
  const avgOpponent = rated.length
    ? Math.round(
        rated.reduce((s, m) => s + (m.opponent_rating ?? 0), 0) / rated.length,
      )
    : null;

  return {
    wins,
    losses,
    winRate,
    streakType,
    streakCount,
    resultsSeq: ordered.map((m) => m.won),
    avgOpponent,
    beatAbove: { wins: 0, total: 0 }, // filled per-system below if you want it
  };
}

// 8-ball efficiency: average (innings − safeties) per win, and total safeties.
export function apa8Efficiency(matches: MatchInput[]) {
  const won = matches.filter((m) => m.won && (m.games_won ?? 0) > 0);
  if (won.length === 0) return null;
  const inningsPerWin =
    won.reduce((s, m) => {
      const eff =
        ((m.innings ?? 0) - (m.safeties ?? 0) - (m.opp_safeties ?? 0)) /
        (m.games_won ?? 1);
      return s + eff;
    }, 0) / won.length;
  const totalSafeties = matches.reduce((s, m) => s + (m.safeties ?? 0), 0);
  return {
    inningsPerWin: Math.round(inningsPerWin * 10) / 10,
    totalSafeties,
    safetiesPerMatch: Math.round((totalSafeties / matches.length) * 10) / 10,
  };
}

// 9-ball efficiency: best and average points-per-inning.
export function apa9Efficiency(matches: MatchInput[]) {
  if (matches.length === 0) return null;
  const ppis = matches.map(
    (m) => (m.points_earned ?? 0) / Math.max(1, m.innings ?? 0),
  );
  const avg = ppis.reduce((a, b) => a + b, 0) / ppis.length;
  return {
    avgPPI: Math.round(avg * 10) / 10,
    bestPPI: Math.round(Math.max(...ppis) * 10) / 10,
  };
}
