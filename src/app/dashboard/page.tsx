import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import {
  apaPerformance,
  apaScoreSeries,
  fargoPerformance,
  fargoRatingSeries,
  type Match,
} from "@/lib/ratings";
import type { Player } from "@/lib/types";
import Sparkline from "./Sparkline";

const ballColor = (sl: number) =>
  ({
    7: "radial-gradient(circle at 35% 30%, #5a2d8a, #2c0f47)",
    6: "radial-gradient(circle at 35% 30%, #3aa05a, #0f4023)",
    5: "radial-gradient(circle at 35% 30%, #e0962e, #7a4a0e)",
    4: "radial-gradient(circle at 35% 30%, #d4453a, #5e120d)",
    3: "radial-gradient(circle at 35% 30%, #3273c4, #0e2f5e)",
    2: "radial-gradient(circle at 35% 30%, #222, #000)",
  })[sl] ?? "#333";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ player?: string }>;
}) {
  const { player: selectedParam } = await searchParams;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("created_at")
    .returns<Player[]>();
  const playerList = players ?? [];
  const selectedId = selectedParam ?? playerList[0]?.id;

  let all: Match[] = [];
  if (selectedId) {
    const { data: matches } = await supabase
      .from("matches")
      .select("*")
      .eq("player_id", selectedId)
      .order("played_at", { ascending: false })
      .returns<Match[]>();
    all = matches ?? [];
  }

  const apa = all.filter((m) => m.system === "apa8").slice(0, 10);
  const fargo = all.filter((m) => m.system === "fargo").slice(0, 10);
  const apaResult = apaPerformance(apa);
  const fargoResult = fargoPerformance(fargo);
  const apaSeries = apaScoreSeries([...apa].reverse());
  const fargoSeries = fargoRatingSeries([...fargo].reverse());

  return (
    <main className="app">
      <div className="topbar">
        <div className="logo">
          RAILBIRD<span>.</span>
        </div>
        <form action={logout}>
          <button className="btn btn-sm">Log out</button>
        </form>
      </div>

      <div style={{ margin: "14px 0 18px" }}>
        <a className="nav-link" href="/matches">
          + Log a match
        </a>
        <a className="nav-link" href="/team">
          Teams &amp; players
        </a>
      </div>

      {playerList.length > 1 && (
        <div style={{ marginBottom: 18 }}>
          {playerList.map((p) => (
            <a
              key={p.id}
              href={`/dashboard?player=${p.id}`}
              className={`player-tab${p.id === selectedId ? " active" : ""}`}
            >
              {p.name}
            </a>
          ))}
        </div>
      )}

      {!apaResult && !fargoResult && (
        <div className="card">
          <p className="muted">
            No matches yet. <a href="/matches">Log your first</a> to see your
            performance.
          </p>
        </div>
      )}

      {apaResult && (
        <div className="card">
          <div className="label">APA 8-Ball · performance skill level</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              margin: "14px 0",
            }}
          >
            <div
              className="ball"
              style={{ background: ballColor(apaResult.skillLevel) }}
            >
              <div className="ball-num">{apaResult.skillLevel}</div>
            </div>
            <div>
              <div className="stat-big">SL {apaResult.skillLevel}</div>
              <div className="muted">
                avg score {apaResult.avgScore} · last {apaResult.sampleSize}
              </div>
            </div>
          </div>
          <Sparkline values={apaSeries} invert />
        </div>
      )}

      {fargoResult && (
        <div className="card">
          <div className="label">FargoRate · performance rating</div>
          <div className="stat-big">{fargoResult.rating}</div>
          <div className="muted">
            {fargoResult.games} games vs avg {fargoResult.avgOpponent}
            {fargoResult.capped ? " · estimate" : ""}
          </div>
          <div style={{ marginTop: 12 }}>
            <Sparkline values={fargoSeries} />
          </div>
        </div>
      )}
    </main>
  );
}
