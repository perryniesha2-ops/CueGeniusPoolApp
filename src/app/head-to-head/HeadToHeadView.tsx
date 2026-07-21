"use client";

import { useState } from "react";
import {
  headToHeadRecords,
  ratedSplits,
} from "@/lib/ratings/headToHead";
import type { Match } from "@/lib/ratings";

type OwnRatings = { apa8: number | null; apa9: number | null; fargo: number | null };

const SYSTEMS = [
  { key: "all", label: "All systems" },
  { key: "apa8", label: "8-Ball" },
  { key: "apa9", label: "9-Ball" },
  { key: "fargo", label: "Fargo" },
];

export default function HeadToHeadView({
  matches,
  ownRatings,
}: {
  matches: Match[];
  ownRatings: OwnRatings;
}) {
  const [system, setSystem] = useState("all");

  const filtered =
    system === "all" ? matches : matches.filter((m) => m.system === system);

  const records = headToHeadRecords(filtered);

  // Own rating for the rated-split: only meaningful when a single system
  // is selected (each system has its own rating scale).
  const ownRating =
    system === "apa8"
      ? ownRatings.apa8
      : system === "apa9"
      ? ownRatings.apa9
      : system === "fargo"
      ? ownRatings.fargo
      : null;
  const splits = ratedSplits(filtered, ownRating);

  const types = new Set(matches.map((m) => m.system));
  const showFilter = types.size > 1;

  return (
    <>
      {showFilter && (
        <select
          className="field"
          value={system}
          onChange={(e) => setSystem(e.target.value)}
          style={{ maxWidth: 220, marginBottom: 16 }}
        >
          {SYSTEMS.filter((s) => s.key === "all" || types.has(s.key)).map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      )}

      {/* Rated splits — only when a single system is selected (needs own rating) */}
      {splits.length > 0 && (
        <div className="card">
          <div className="section-title">By opponent rating</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {splits.map((s) => (
              <div key={s.label} className="row">
                <span>{s.label}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="muted">{s.winRate}%</span>
                  <span
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: 20,
                      color:
                        s.wins > s.losses
                          ? "#22E4FF"
                          : s.wins < s.losses
                          ? "#ff4d57"
                          : "var(--muted)",
                    }}
                  >
                    {s.wins}–{s.losses}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {system === "all" && (
        <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
          Pick a single system to see your record vs. higher- and lower-rated
          players.
        </p>
      )}

      {/* Per-opponent records */}
      {records.length === 0 ? (
        <div className="card">
          <p className="muted">
            No records for this filter. Log matches with opponent names to build
            your head-to-head history.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="section-title">By opponent</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {records.map((r) => (
              <div key={r.opponent} className="row">
                <span style={{ fontWeight: 600 }}>{r.opponent}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span className="muted" style={{ fontSize: 13 }}>
                    {r.total} {r.total === 1 ? "match" : "matches"}
                  </span>
                  <span className="muted">{r.winRate}%</span>
                  <span
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: 22,
                      minWidth: 60,
                      textAlign: "right",
                      color:
                        r.wins > r.losses
                          ? "#22E4FF"
                          : r.wins < r.losses
                          ? "#ff4d57"
                          : "var(--muted)",
                    }}
                  >
                    {r.wins}–{r.losses}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}