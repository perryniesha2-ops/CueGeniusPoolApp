"use client";

import { useState } from "react";
import { createMatch } from "@/lib/actions/matches";
import type { Player } from "@/lib/types";

export default function MatchForm({ players }: { players: Player[] }) {
  const [system, setSystem] = useState("apa8");

  return (
    <form action={createMatch}>
      {players.length > 1 && (
        <select
          name="player_id"
          defaultValue={players[0]?.id ?? ""}
          className="field"
        >
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

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
        placeholder="Opponent name"
        className="field"
      />
      <input
        name="opponent_rating"
        type="number"
        className="field"
        placeholder={
          system === "apa8" ? "Opponent skill level" : "Opponent Fargo rating"
        }
      />

      {system === "apa8" && (
        <>
          <input
            name="innings"
            type="number"
            placeholder="Your innings"
            className="field"
          />
          <input
            name="safeties"
            type="number"
            placeholder="Your safeties"
            className="field"
          />
          <input
            name="games_won"
            type="number"
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
            placeholder="Points you earned"
            className="field"
          />
          <input
            name="innings"
            type="number"
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
            placeholder="Games you won"
            className="field"
          />
          <input
            name="fargo_lost"
            type="number"
            placeholder="Games opponent won"
            className="field"
          />
        </>
      )}

      <select name="result" defaultValue="won" className="field">
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>

      <button
        type="submit"
        className="btn btn-accent"
        style={{ display: "block", margin: "12px auto 0" }}
      >
        Add match
      </button>
    </form>
  );
}
