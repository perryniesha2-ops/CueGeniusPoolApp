import type { MatchInput, FargoResult } from "./types";

// Chance the player (rating R) wins a single game vs an opponent (rating O).
// FargoRate is logarithmic: a 100-point gap predicts a 2-to-1 game ratio.
export function gameWinProbability(
  playerRating: number,
  opponentRating: number,
): number {
  return 1 / (1 + Math.pow(2, (opponentRating - playerRating) / 100));
}

export function fargoPerformance(matches: MatchInput[]): FargoResult | null {
  const opponents: number[] = [];
  let totalGames = 0;
  let gamesWon = 0;

  for (const m of matches) {
    if (m.system !== "fargo") continue;
    const won = m.fargo_won ?? 0;
    const lost = m.fargo_lost ?? 0;
    const opp = m.opponent_rating;
    if (won + lost > 0 && opp != null) {
      totalGames += won + lost;
      gamesWon += won;
      for (let i = 0; i < won + lost; i++) opponents.push(opp);
    }
  }

  if (totalGames === 0) return null;
  const avgOpp = opponents.reduce((a, b) => a + b, 0) / opponents.length;

  // A perfect or winless record has no exact solution, so we estimate.
  if (gamesWon === 0)
    return {
      rating: Math.round(avgOpp - 200),
      games: totalGames,
      avgOpponent: Math.round(avgOpp),
      capped: true,
    };
  if (gamesWon === totalGames)
    return {
      rating: Math.round(avgOpp + 200),
      games: totalGames,
      avgOpponent: Math.round(avgOpp),
      capped: true,
    };

  // Find the rating whose expected wins match the player's actual wins.
  let lo = 0;
  let hi = 900;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const expectedWins = opponents.reduce(
      (sum, o) => sum + gameWinProbability(mid, o),
      0,
    );
    if (expectedWins < gamesWon) lo = mid;
    else hi = mid;
  }

  return {
    rating: Math.round((lo + hi) / 2),
    games: totalGames,
    avgOpponent: Math.round(avgOpp),
    capped: false,
  };
}

// The performance rating recomputed after each match — the rating's path over time.
export function fargoRatingSeries(matches: MatchInput[]): number[] {
  const fargo = matches.filter((m) => m.system === "fargo");
  const out: number[] = [];
  for (let i = 1; i <= fargo.length; i++) {
    const r = fargoPerformance(fargo.slice(0, i));
    if (r) out.push(r.rating);
  }
  return out;
}
