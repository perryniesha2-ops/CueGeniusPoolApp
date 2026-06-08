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
import { apa9Performance, apa9ScoreSeries } from "@/lib/ratings";
import PoolBall from "./PoolBall";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", claims.claims.sub)
    .single<{ display_name: string | null }>();

  const firstName = (profile?.display_name ?? "").trim().split(" ")[0];

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
  const nine = all.filter((m) => m.system === "apa9").slice(0, 10);
  const player9SL = playerList.find((p) => p.id === selectedId)?.apa9_sl ?? 4;

  const apa9Result = apa9Performance(nine, player9SL);
  const apa9Series = apa9ScoreSeries([...nine].reverse(), player9SL);

  return (
    <main className="app">
      <h1 style={{ marginBottom: 4 }}>
        {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
      </h1>
      <p className="muted" style={{ marginBottom: 18 }}>
        Here&apos;s how you&apos;re playing.
      </p>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}
      >
        <a href="/matches" className="btn btn-accent">
          Log a match
        </a>

        <a href="/team" className="btn btn-accent">
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
            <PoolBall kind="8" num={8} />
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
      {apa9Result && (
        <div className="card">
          <div className="section-title">
            APA 9-Ball · performance skill level
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              margin: "14px 0",
            }}
          >
            <PoolBall kind="9" num={9} />
            <div>
              <div className="stat-big">SL {apa9Result.skillLevel}</div>
              <div className="muted">
                avg {apa9Result.avgScore} pts/inning · last{" "}
                {apa9Result.sampleSize}
              </div>
            </div>
          </div>
          <Sparkline values={apa9Series} />
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
