import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createTeam,
  createPlayer,
  deletePlayer,
  deleteTeam,
} from "@/lib/actions/roster";
import type { Team, Player } from "@/lib/types";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");

  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .order("created_at")
    .returns<Team[]>();
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("created_at")
    .returns<Player[]>();

  const teamList = teams ?? [];
  const playerList = players ?? [];
  const playersFor = (teamId: string | null) =>
    playerList.filter((p) => p.team_id === teamId);

  const renderRoster = (list: Player[]) =>
    list.length === 0 ? (
      <p className="muted" style={{ margin: "6px 0" }}>
        No players.
      </p>
    ) : (
      <div>
        {list.map((p) => (
          <div key={p.id} className="row">
            <span>
              {p.name} · {p.default_system === "apa8" ? "APA" : "Fargo"}
            </span>
            <form action={deletePlayer}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="btn btn-danger btn-sm">
                ✕
              </button>
            </form>
          </div>
        ))}
      </div>
    );

  return (
    <main className="app">
      <div className="topbar">
        <div className="logo">
          RAILBIRD<span>.</span>
        </div>
        <a className="nav-link" href="/dashboard">
          ← Dashboard
        </a>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="section-title">Add a team</div>
        <form action={createTeam}>
          <input
            name="name"
            placeholder="Team name"
            required
            className="field"
          />
          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: 8 }}
          >
            Add team
          </button>
        </form>
      </div>

      <div className="card">
        <div className="section-title">Add a player</div>
        <form action={createPlayer}>
          <input
            name="name"
            placeholder="Player name"
            required
            className="field"
          />
          <select name="team_id" defaultValue="" className="field">
            <option value="">No team</option>
            {teamList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select name="default_system" defaultValue="apa8" className="field">
            <option value="apa8">APA 8-Ball</option>
            <option value="fargo">FargoRate</option>
          </select>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: 8 }}
          >
            Add player
          </button>
        </form>
      </div>

      <div className="card">
        <div className="section-title">Your lineup</div>

        {teamList.length === 0 && playersFor(null).length === 0 && (
          <p className="muted">No teams or players yet. Add some above.</p>
        )}

        {teamList.map((t) => (
          <div key={t.id} style={{ marginBottom: 18 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong style={{ fontSize: 16 }}>{t.name}</strong>
              <form action={deleteTeam}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="btn btn-danger btn-sm">
                  Delete team
                </button>
              </form>
            </div>
            {renderRoster(playersFor(t.id))}
          </div>
        ))}

        {playersFor(null).length > 0 && (
          <div>
            <strong style={{ fontSize: 16 }}>Unassigned</strong>
            {renderRoster(playersFor(null))}
          </div>
        )}
      </div>
    </main>
  );
}
