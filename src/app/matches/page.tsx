import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MatchForm from "./MatchForm";
import MatchRow from "./MatchRow";
import type { Match } from "@/lib/ratings";
import type { Player } from "@/lib/types";

export default async function MatchesPage() {
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
      <div className="topbar">
        <div className="logo">
          RAILBIRD<span>.</span>
        </div>
        <a className="nav-link" href="/dashboard">
          ← Dashboard
        </a>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="section-title">Log a match</div>
        <MatchForm players={players ?? []} />
      </div>
    </main>
  );
}
