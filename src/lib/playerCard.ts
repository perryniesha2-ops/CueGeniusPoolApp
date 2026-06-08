import { apaPerformance } from "@/lib/ratings/apa8";
import { apa9Performance } from "@/lib/ratings/apa9";
import { fargoPerformance } from "@/lib/ratings/fargo";
import type { Match } from "@/lib/ratings";
import type { Player } from "@/lib/types";

export function playerCard(player: Player, allMatches: Match[]) {
  const mine = allMatches.filter((m) => m.player_id === player.id).slice(0, 10);

  if (player.default_system === "fargo") {
    const r = fargoPerformance(mine);
    return {
      system: "FargoRate",
      metricLabel: "Rating",
      value: r ? `${r.rating}` : "—",
      pct: r ? Math.min(100, (r.rating / 800) * 100) : 0,
      detail: r ? `${r.games} games` : "no matches yet",
      glow: "#5b3bff",
      accent: "#6e5bff",
    };
  }
  if (player.default_system === "apa9") {
    const r = apa9Performance(mine, player.apa9_sl ?? 4);
    return {
      system: "APA 9-Ball",
      metricLabel: "Skill level",
      value: r ? `SL ${r.skillLevel}` : "—",
      pct: r ? (r.skillLevel / 9) * 100 : 0,
      detail: r ? `last ${r.sampleSize}` : "no matches yet",
      glow: "#00b4d8",
      accent: "#22a8c4",
    };
  }
  const r = apaPerformance(mine);
  return {
    system: "APA 8-Ball",
    metricLabel: "Skill level",
    value: r ? `SL ${r.skillLevel}` : "—",
    pct: r ? (r.skillLevel / 7) * 100 : 0,
    detail: r ? `last ${r.sampleSize}` : "no matches yet",
    glow: "#2323ff",
    accent: "#4d6bff",
  };
}
