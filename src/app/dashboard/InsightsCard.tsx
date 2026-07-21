import {
  Flame,
  TrendingDown,
  Trophy,
  Target,
  TrendingUp,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { buildInsights, type Insight } from "@/lib/ratings/insights";
import type { Match } from "@/lib/ratings";

const ICONS: Record<Insight["icon"], LucideIcon> = {
  flame: Flame,
  "trending-down": TrendingDown,
  trophy: Trophy,
  target: Target,
  "trending-up": TrendingUp,
  "bar-chart": BarChart3,
};

const ICON_COLORS: Record<Insight["icon"], string> = {
  flame: "#ff4d57",
  "trending-down": "#7c869b",
  trophy: "#F5FF66",
  target: "#22E4FF",
  "trending-up": "#22E4FF",
  "bar-chart": "#7c869b",
};

export default function InsightsCard({
  matches,
  ownRatings,
}: {
  matches: Match[];
  ownRatings: { apa8: number | null; apa9: number | null; fargo: number | null };
}) {
  const insights = buildInsights(matches, ownRatings);
  if (insights.length === 0) return null;

  return (
    <div className="card">
      <div className="section-title">Insights</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {insights.map((ins, i) => {
          const Icon = ICONS[ins.icon];
          return (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Icon
                size={18}
                color={ICON_COLORS[ins.icon]}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <span style={{ lineHeight: 1.4 }}>{ins.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}