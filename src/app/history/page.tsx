import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MatchRow from "../matches/MatchRow";
import type { Match } from "@/lib/ratings";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");

  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("played_at", { ascending: false })
    .returns<Match[]>();

  return (
    <main className="app">
      <h1 style={{ marginBottom: 16 }}>Match history</h1>
      {!matches?.length && (
        <p className="muted">
          No matches yet. <a href="/matches">Log your first →</a>
        </p>
      )}
      <div className="match-grid">
        {matches?.map((m) => (
          <MatchRow key={m.id} m={m} />
        ))}
      </div>
    </main>
  );
}
