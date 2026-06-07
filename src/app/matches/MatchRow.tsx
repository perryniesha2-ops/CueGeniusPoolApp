"use client";

import { useState } from "react";
import { updateMatch, deleteMatch } from "@/lib/actions/matches";
import { matchCard } from "@/lib/matchCard";
import type { Match } from "@/lib/ratings";

export default function MatchRow({ m }: { m: Match }) {
  const [editing, setEditing] = useState(false);
  const [system, setSystem] = useState(m.system);

  if (!editing) {
    const c = matchCard(m);
    const date = new Date(m.played_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return (
      <div
        className="mcard"
        style={{
          ["--glow" as string]: c.glow,
          ["--accent" as string]: c.accent,
        }}
      >
        <div className="mc-top">
          <span>{date}</span>
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "none",
              border: 0,
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Edit
          </button>
        </div>
        <div className="mc-title">vs {m.opponent_name ?? "Opponent"}</div>
        <div className="mc-sub">{c.system}</div>
        <div className="mc-barlabel">
          <span>{c.metricLabel}</span>
          <span>{c.value}</span>
        </div>
        <div className="mc-track">
          <div className="mc-fill" style={{ width: `${c.pct}%` }} />
        </div>
        <div className="mc-foot">
          <div className={`wl ${m.won ? "W" : "L"}`}>{m.won ? "W" : "L"}</div>
          <span className="chip">{c.detail}</span>
          <form action={deleteMatch}>
            <input type="hidden" name="id" value={m.id} />
            <button type="submit" className="btn btn-danger btn-sm">
              Delete
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <form
      action={async (formData) => {
        await updateMatch(formData);
        setEditing(false);
      }}
      className="mcard"
    >
      <input type="hidden" name="id" value={m.id} />

      <select
        name="system"
        value={system}
        onChange={(e) => setSystem(e.target.value)}
        className="field"
      >
        <option value="apa8">APA 8-Ball</option>
        <option value="apa9">APA 9-Ball</option>
        <option value="fargo">FargoRate</option>
      </select>

      <input
        name="opponent_name"
        defaultValue={m.opponent_name ?? ""}
        placeholder="Opponent name"
        className="field"
      />
      <input
        name="opponent_rating"
        type="number"
        defaultValue={m.opponent_rating ?? ""}
        className="field"
        placeholder={
          system === "fargo" ? "Opponent Fargo rating" : "Opponent skill level"
        }
      />

      {system === "apa8" && (
        <>
          <input
            name="innings"
            type="number"
            defaultValue={m.innings ?? ""}
            placeholder="Your innings"
            className="field"
          />
          <input
            name="safeties"
            type="number"
            defaultValue={m.safeties ?? ""}
            placeholder="Your safeties"
            className="field"
          />
          <input
            name="games_won"
            type="number"
            defaultValue={m.games_won ?? ""}
            placeholder="Games you won"
            className="field"
          />
        </>
      )}
      {system === "apa9" && (
        <>
          <input
            name="points_earned"
            type="number"
            defaultValue={m.points_earned ?? ""}
            placeholder="Points you earned"
            className="field"
          />
          <input
            name="innings"
            type="number"
            defaultValue={m.innings ?? ""}
            placeholder="Your innings"
            className="field"
          />
        </>
      )}
      {system === "fargo" && (
        <>
          <input
            name="fargo_won"
            type="number"
            defaultValue={m.fargo_won ?? ""}
            placeholder="Games you won"
            className="field"
          />
          <input
            name="fargo_lost"
            type="number"
            defaultValue={m.fargo_lost ?? ""}
            placeholder="Games opponent won"
            className="field"
          />
        </>
      )}

      <select
        name="result"
        defaultValue={m.won ? "won" : "lost"}
        className="field"
      >
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          Save
        </button>
        <button type="button" onClick={() => setEditing(false)} className="btn">
          Cancel
        </button>
      </div>
    </form>
  );
}
