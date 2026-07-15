"use client";

import { useState } from "react";
import MatchRow from "./MatchRow";
import type { Match } from "@/lib/ratings";

const FILTERS = [
  { key: "all", label: "All matches" },
  { key: "apa8", label: "8-Ball" },
  { key: "apa9", label: "9-Ball" },
  { key: "fargo", label: "Fargo" },
];

export default function MatchHistory({ matches }: { matches: Match[] }) {
  const [filter, setFilter] = useState("all");

  // Only show the filter if the user actually has more than one match type.
  const types = new Set(matches.map((m) => m.system));
  const showFilter = types.size > 1;

  const shown =
    filter === "all" ? matches : matches.filter((m) => m.system === filter);

  return (
    <>
      {showFilter && (
        <select
          className="field"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: 220, marginBottom: 16 }}
        >
          {FILTERS.filter(
            (f) => f.key === "all" || types.has(f.key),
          ).map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      )}

      {shown.length === 0 ? (
        <p className="muted">No matches for this filter.</p>
      ) : (
        <div className="match-grid">
          {shown.map((m) => (
            <MatchRow key={m.id} m={m} />
          ))}
        </div>
      )}
    </>
  );
}