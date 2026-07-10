import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  apaPerformance,
  apaScoreSeries,
  apa9Performance,
  apa9ScoreSeries,
  fargoPerformance,
  fargoRatingSeries,
  matchStats,
  apa8Efficiency,
  apa9Efficiency,
  type Match,
  type MatchStats,
} from "@/lib/ratings";
import type { Player } from "@/lib/types";
import Sparkline from "./Sparkline";
import PoolBall from "./PoolBall";
import { hasProAccess, trialDaysLeft } from "@/lib/access";

// Shared record + streak + W/L bar cards (same for every system).
function RecordCards({
  stats,
  sampleSize,
}: {
  stats: MatchStats;
  sampleSize: number;
}) {
  return (
    <>
      <div className="card">
        <div className="label">Record · last {sampleSize}</div>
        <div className="stat-big">
          {stats.wins}–{stats.losses}
        </div>
        <div className="muted">{stats.winRate}% win rate</div>
        <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
          {stats.resultsSeq
            .slice(0, 10)
            .reverse()
            .map((won, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 22,
                  borderRadius: 3,
                  background: won ? "#22E4FF" : "rgba(255,77,87,0.4)",
                }}
              />
            ))}
        </div>
      </div>
      <div className="card">
        <div className="label">Current streak</div>
        <div
          className="stat-big"
          style={{ color: stats.streakType === "W" ? "#22E4FF" : "#ff4d57" }}
        >
          {stats.streakType}
          {stats.streakCount}
        </div>
        <div className="muted">
          {stats.streakType === "W" ? "on a roll" : "shake it off"}
        </div>
      </div>
    </>
  );
}

// Official-vs-performance card. Works for skill levels (APA) and ratings (Fargo).
function OfficialVsReal({
  performance,
  official,
  unit,
}: {
  performance: number;
  official: number | null;
  unit: string;
}) {
  if (official == null) {
    return (
      <div className="card">
        <div className="label">Official vs. real</div>
        <div className="stat-big" style={{ fontSize: 28 }}>
          —
        </div>
        <div className="muted">
          <a href="/settings">Set your official level</a> to compare
        </div>
      </div>
    );
  }
  const dir =
    performance > official ? "up" : performance < official ? "down" : "even";
  const color =
    dir === "up" ? "#3ddc84" : dir === "down" ? "#ff4d57" : "#7c869b";
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";
  return (
    <div className="card">
      <div className="label">Official vs. real</div>
      <div className="stat-big">
        {unit} {performance}{" "}
        <span style={{ fontSize: 20, color }}>{arrow}</span>
      </div>
      <div className="muted">
        official {unit} {official} · playing like {performance}
      </div>
    </div>
  );
}

// The single upgrade prompt shown to non-pro users who have matches.
function UpgradePrompt() {
  return (
    <div
      className="card"
      style={{ textAlign: "center", borderColor: "rgba(77,107,255,0.4)" }}
    >
      <div className="section-title" style={{ justifyContent: "center" }}>
        Unlock your full stats
      </div>
      <p className="muted" style={{ marginBottom: 12 }}>
        Win rate, streaks, efficiency, and official-vs-real comparisons are part
        of CueGenius Pro.
      </p>
      <a href="/pricing" className="btn btn-primary">
        Upgrade to Pro
      </a>
    </div>
  );
}

export const dynamic = "force-dynamic";

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
    .select("display_name, subscription_status, created_at")
    .eq("id", claims.claims.sub)
    .single<{
      display_name: string | null;
      subscription_status: string | null;
      created_at: string;
    }>();
  if (!profile) redirect("/login");

  const firstName = (profile.display_name ?? "").trim().split(" ")[0];
  const pro = hasProAccess(profile);
  const daysLeft = trialDaysLeft(profile);
  const isSubscribed = profile.subscription_status === "active";

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("created_at")
    .returns<Player[]>();
  const playerList = players ?? [];
  const selectedId = selectedParam ?? playerList[0]?.id;
  const player = playerList.find((p) => p.id === selectedId);

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
  const nine = all.filter((m) => m.system === "apa9").slice(0, 10);
  const fargo = all.filter((m) => m.system === "fargo").slice(0, 10);

  const apaResult = apaPerformance(apa);
  const apa9Result = apa9Performance(nine, player?.apa9_sl ?? 4);
  const fargoResult = fargoPerformance(fargo);

  const apaSeries = apaScoreSeries([...apa].reverse());
  const apa9Series = apa9ScoreSeries([...nine].reverse());
  const fargoSeries = fargoRatingSeries([...fargo].reverse());

  const apa8Stats = matchStats(apa);
  const apa9Stats = matchStats(nine);
  const fargoStats = matchStats(fargo);
  const apa8Eff = apa8Efficiency(apa);
  const apa9Eff = apa9Efficiency(nine);

  const needsSetup =
    !player?.apa8_sl && !player?.apa9_sl && !player?.fargo_rating;

  const hasAnyResult = !!(apaResult || apa9Result || fargoResult);

  return (
    <main className="app">
      <h1 style={{ marginBottom: 4 }}>
        {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
      </h1>
      <p className="muted" style={{ marginBottom: 18 }}>
        Here&apos;s how you&apos;re playing.
      </p>

      {/* ---- Trial / subscription status banner ---- */}
      {isSubscribed ? null : !pro ? (
        <div className="card" style={{ borderColor: "rgba(77,107,255,0.4)" }}>
          <span className="muted">Your free trial has ended. </span>
          <a href="/pricing">Upgrade to keep full access →</a>
        </div>
      ) : (
        <div className="card" style={{ borderColor: "rgba(77,107,255,0.4)" }}>
          <span className="muted">
            {daysLeft} day{daysLeft === 1 ? "" : "s"} left in your free trial.{" "}
          </span>
          <a href="/pricing">Upgrade →</a>
        </div>
      )}

      <div
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        <a href="/matches" className="btn btn-accent">
          + Log a match
        </a>
        <a href="/team" className="btn btn-accent">
          Teams &amp; players
        </a>
      </div>

      {needsSetup && (
        <div className="card" style={{ borderColor: "rgba(77,107,255,0.4)" }}>
          <div className="section-title">Finish your profile</div>
          <p className="muted" style={{ marginBottom: 10 }}>
            Add your official skill levels so we can show how your real play
            compares to how you&apos;re actually performing.
          </p>
          <a href="/settings" className="btn btn-primary">
            Add my details
          </a>
        </div>
      )}

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

      {!hasAnyResult && (
        <div className="card">
          <p className="muted">
            No matches yet. <a href="/matches">Log your first</a> to see your
            performance.
          </p>
        </div>
      )}

      {/* One upgrade prompt for non-pro users who actually have matches. */}
      {!pro && hasAnyResult && <UpgradePrompt />}

      {/* ---- APA 8-BALL ---- */}
      {apaResult && (
        <>
          <h2>APA 8-Ball</h2>
          <div className="card">
            <div className="section-title">Performance skill level</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                margin: "8px 0 14px",
              }}
            >
              <PoolBall kind="8" num={apaResult.skillLevel} />
              <div>
                <div className="stat-big">SL {apaResult.skillLevel}</div>
                <div className="muted">
                  avg score {apaResult.avgScore} · last {apaResult.sampleSize}
                </div>
              </div>
            </div>
            <Sparkline values={apaSeries} invert />
          </div>
          {pro && apa8Stats && (
            <div className="match-grid" style={{ marginBottom: 18 }}>
              <RecordCards stats={apa8Stats} sampleSize={apa.length} />
              <OfficialVsReal
                performance={apaResult.skillLevel}
                official={player?.apa8_sl ?? null}
                unit="SL"
              />
              {apa8Eff && (
                <div className="card">
                  <div className="label">Innings per win</div>
                  <div className="stat-big">{apa8Eff.inningsPerWin}</div>
                  <div className="muted">
                    {apa8Eff.safetiesPerMatch} safeties/match · lower is sharper
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ---- APA 9-BALL ---- */}
      {apa9Result && (
        <>
          <h2>APA 9-Ball</h2>
          <div className="card">
            <div className="section-title">Performance skill level</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                margin: "8px 0 14px",
              }}
            >
              <PoolBall kind="9" num={apa9Result.skillLevel} />
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
          {pro && apa9Stats && (
            <div className="match-grid" style={{ marginBottom: 18 }}>
              <RecordCards stats={apa9Stats} sampleSize={nine.length} />
              <OfficialVsReal
                performance={apa9Result.skillLevel}
                official={player?.apa9_sl ?? null}
                unit="SL"
              />
              {apa9Eff && (
                <div className="card">
                  <div className="label">Points per inning</div>
                  <div className="stat-big">{apa9Eff.avgPPI}</div>
                  <div className="muted">
                    best {apa9Eff.bestPPI} · higher is sharper
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ---- FARGORATE ---- */}
      {fargoResult && (
        <>
          <h2>FargoRate</h2>
          <div className="card">
            <div className="section-title">Performance rating</div>
            <div className="stat-big">{fargoResult.rating}</div>
            <div className="muted">
              {fargoResult.games} games vs avg {fargoResult.avgOpponent}
              {fargoResult.capped ? " · estimate" : ""}
            </div>
            <div style={{ marginTop: 12 }}>
              <Sparkline values={fargoSeries} />
            </div>
          </div>
          {pro && fargoStats && (
            <div className="match-grid" style={{ marginBottom: 18 }}>
              <RecordCards stats={fargoStats} sampleSize={fargo.length} />
              <OfficialVsReal
                performance={fargoResult.rating}
                official={player?.fargo_rating ?? null}
                unit=""
              />
              {fargoStats.avgOpponent != null && (
                <div className="card">
                  <div className="label">Avg opponent</div>
                  <div className="stat-big">{fargoStats.avgOpponent}</div>
                  <div className="muted">average rating faced</div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
