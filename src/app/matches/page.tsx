import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MatchForm from "./MatchForm";
import MatchRow from "./MatchRow";
import type { Match } from "@/lib/ratings";
import type { Player } from "@/lib/types";

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");

  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("played_at", { ascending: false })
    .returns<Match[]>();

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("created_at")
    .returns<Player[]>();

  return (
    <main className="app">
      <h1 style={{ marginBottom: 16 }}>Matches</h1>
      {error && (
        <p className="error" style={{ marginBottom: 16 }}>
          {error}
        </p>
      )}

      <div className="card">
        <div className="section-title">Log a match</div>
        <MatchForm players={players ?? []} />
      </div>

      <div className="section-title" style={{ marginTop: 28 }}>
        Match history
      </div>
      {!matches?.length && (
        <p className="muted">No matches yet. Log your first above.</p>
      )}
      <div className="match-grid">
        {matches?.map((m) => (
          <MatchRow key={m.id} m={m} />
        ))}
      </div>
    </main>
  );
}
