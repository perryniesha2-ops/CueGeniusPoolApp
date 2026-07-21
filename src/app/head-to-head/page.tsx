import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasProAccess } from "@/lib/access";
import { headToHeadRecords } from "@/lib/ratings/headToHead";
import type { Match } from "@/lib/ratings";

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

  const records = headToHeadRecords(matches ?? []);

  return (
    <main className="app">
      <div style={{ marginBottom: 8 }}>
        <a href="/dashboard" className="muted" style={{ fontSize: 14 }}>
          ← Back to dashboard
        </a>
      </div>
      <h1 style={{ marginBottom: 16 }}>Head to head</h1>

      {!pro ? (
        <div className="card" style={{ textAlign: "center", borderColor: "rgba(77,107,255,0.4)" }}>
          <div className="section-title" style={{ justifyContent: "center" }}>
            Pro feature
          </div>
          <p className="muted" style={{ marginBottom: 12 }}>
            See your record against every opponent with CueGenius Pro.
          </p>
          <a href="/pricing" className="btn btn-primary">Upgrade to Pro</a>
        </div>
      ) : records.length === 0 ? (
        <div className="card">
          <p className="muted">
            No head-to-head records yet. Log matches with opponent names to see
            your record against each player.
          </p>
        </div>
      ) : (
        <div className="card">
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
    </main>
  );
}