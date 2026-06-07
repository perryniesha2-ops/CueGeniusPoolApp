import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveSettings } from "@/lib/actions/settings";
import { getOrCreateMyPlayer } from "@/lib/player";
import type { Player } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");

  const playerId = await getOrCreateMyPlayer();
  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single<Player>();

  return (
    <main className="app">
      <h1 style={{ marginBottom: 16 }}>Settings</h1>

      <div className="card" style={{ maxWidth: 520 }}>
        <div className="section-title">Your details</div>
        <form action={saveSettings}>
          <label className="label">Display name</label>
          <input
            name="display_name"
            defaultValue={player?.name ?? ""}
            className="field"
          />

          <label className="label" style={{ marginTop: 12, display: "block" }}>
            Official ratings
          </label>
          <p className="muted" style={{ margin: "2px 0 8px" }}>
            Your league-assigned levels. Leave blank if you don&apos;t have one.
          </p>

          <input
            name="apa8_sl"
            type="number"
            min="1"
            max="7"
            defaultValue={player?.apa8_sl ?? ""}
            placeholder="APA 8-Ball skill level (1–7)"
            className="field"
          />
          <input
            name="apa9_sl"
            type="number"
            min="1"
            max="9"
            defaultValue={player?.apa9_sl ?? ""}
            placeholder="APA 9-Ball skill level (1–9)"
            className="field"
          />
          <input
            name="fargo_rating"
            type="number"
            defaultValue={player?.fargo_rating ?? ""}
            placeholder="FargoRate rating"
            className="field"
          />

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: 12 }}
          >
            Save settings
          </button>
        </form>
      </div>
    </main>
  );
}
