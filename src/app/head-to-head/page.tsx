import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasProAccess } from "@/lib/access";
import { getOrCreateMyPlayer } from "@/lib/player";
import HeadToHeadView from "./HeadToHeadView";
import type { Match } from "@/lib/ratings";
import type { Player } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HeadToHeadPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, created_at")
    .eq("id", claims.claims.sub)
    .single<{ subscription_status: string | null; created_at: string }>();
  const pro = profile ? hasProAccess(profile) : false;

  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("played_at", { ascending: false })
    .returns<Match[]>();

  // Player's own ratings for the rated-split comparison.
  const playerId = await getOrCreateMyPlayer();
  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single<Player>();

  const ownRatings = {
    apa8: player?.apa8_sl ?? null,
    apa9: player?.apa9_sl ?? null,
    fargo: player?.fargo_rating ?? null,
  };

  return (
    <main className="app" style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 8 }}>
        <a href="/dashboard" className="muted" style={{ fontSize: 14 }}>
          ← Back to dashboard
        </a>
      </div>
      <h1 style={{ marginBottom: 16 }}>Head to head</h1>

      {!pro ? (
        <div className="card" style={{ textAlign: "center", borderColor: "rgba(77,107,255,0.4)" }}>
          <div className="section-title" style={{ justifyContent: "center" }}>Pro feature</div>
          <p className="muted" style={{ marginBottom: 12 }}>
            See your record against every opponent with CueGenius Pro.
          </p>
          <a href="/pricing" className="btn btn-primary">Upgrade to Pro</a>
        </div>
      ) : (
        <HeadToHeadView matches={matches ?? []} ownRatings={ownRatings} />
      )}
    </main>
  );
}