import type { Match } from "./types";

export type HeadToHead = {
  opponent: string;
  wins: number;
  losses: number;
  total: number;
  winRate: number;
  lastResult: "W" | "L" | null;
};

export function headToHeadRecords(matches: Match[]): HeadToHead[] {
  const byOpponent = new Map<string, Match[]>();
  for (const m of matches) {
    const name = (m.opponent_name ?? "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (!byOpponent.has(key)) byOpponent.set(key, []);
    byOpponent.get(key)!.push(m);
  }

  const records: HeadToHead[] = [];
  for (const group of byOpponent.values()) {
    const opponent = (group[0].opponent_name ?? "").trim();
    const sorted = [...group].sort(
      (a, b) =>
        new Date(b.played_at ?? 0).getTime() -
        new Date(a.played_at ?? 0).getTime(),
    );
    const wins = sorted.filter((m) => m.won).length;
    const losses = sorted.length - wins;
    records.push({
      opponent,
      wins,
      losses,
      total: sorted.length,
      winRate: Math.round((wins / sorted.length) * 100),
      lastResult: sorted[0].won ? "W" : "L",
    });
  }
  return records.sort((a, b) => b.total - a.total);
}

export type RatedSplit = {
  label: string;
  wins: number;
  losses: number;
  total: number;
  winRate: number;
};

/**
 * Record vs. opponents rated higher / same / lower than the player's own
 * rating for that system. Needs both the match's opponent_rating and the
 * player's own rating in that system.
 *
 * `ownRating` should be the player's rating for the system being viewed
 * (their APA SL or Fargo rating). Matches without an opponent_rating are skipped.
 */
export function ratedSplits(
  matches: Match[],
  ownRating: number | null,
): RatedSplit[] {
  if (ownRating == null) return [];

  const buckets = {
    higher: { wins: 0, losses: 0 },
    same: { wins: 0, losses: 0 },
    lower: { wins: 0, losses: 0 },
  };

  for (const m of matches) {
    const opp = m.opponent_rating;
    if (opp == null) continue;
    const bucket =
      opp > ownRating ? "higher" : opp < ownRating ? "lower" : "same";
    if (m.won) buckets[bucket].wins++;
    else buckets[bucket].losses++;
  }

  const make = (label: string, b: { wins: number; losses: number }): RatedSplit => {
    const total = b.wins + b.losses;
    return {
      label,
      wins: b.wins,
      losses: b.losses,
      total,
      winRate: total > 0 ? Math.round((b.wins / total) * 100) : 0,
    };
  };

  return [
    make("vs. higher-rated", buckets.higher),
    make("vs. same rating", buckets.same),
    make("vs. lower-rated", buckets.lower),
  ].filter((s) => s.total > 0); // only show buckets with matches
}