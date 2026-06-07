import { apaMatchScore } from "@/lib/ratings/apa8";
import { apa9MatchScore } from "@/lib/ratings/apa9";
import { apaSkillLevel } from "@/lib/ratings/apa8";
import { apa9SkillLevel } from "@/lib/ratings/apa9";
import type { Match } from "@/lib/ratings";

export function matchCard(m: Match) {
  if (m.system === "apa9") {
    const score = apa9MatchScore(m);
    const sl = apa9SkillLevel(score);
    return {
      system: "APA 9-Ball",
      metricLabel: "Performance",
      value: `SL ${sl}`,
      pct: Math.min(100, (sl / 9) * 100),
      glow: "#c08a2e",
      accent: "#e0962e",
      detail: `${m.points_earned ?? 0} pts · ${m.innings ?? 0} inn`,
    };
  }
  if (m.system === "fargo") {
    const won = m.fargo_won ?? 0;
    const lost = m.fargo_lost ?? 0;
    return {
      system: "FargoRate",
      metricLabel: "Games",
      value: `${won}–${lost}`,
      pct: won + lost > 0 ? (won / (won + lost)) * 100 : 0,
      glow: "#2e6bc0",
      accent: "#3273c4",
      detail: `vs ${m.opponent_rating ?? "?"}`,
    };
  }
  // default: APA 8-ball
  const score = apaMatchScore(m);
  const sl = apaSkillLevel(score);
  return {
    system: "APA 8-Ball",
    metricLabel: "Performance",
    value: `SL ${sl}`,
    pct: Math.min(100, (sl / 7) * 100),
    glow: "#1f8b6f",
    accent: "#3aa05a",
    detail: `${m.innings ?? 0} inn · ${m.safeties ?? 0} saf`,
  };
}
