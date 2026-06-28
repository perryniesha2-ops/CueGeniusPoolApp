import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GhostBalls from "@/app/GhostBalls";
import CalculatorDemo from "./CalculatorDemo";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/dashboard");

  return (
    <main className="landing">
      <header className="landing-bar">
        <img
          src="/cuegenius-logo.svg"
          alt="CueGenius"
          style={{ height: 90, width: "auto", display: "block" }}
        />
        <div className="landing-bar-actions">
          <a href="/login" className="btn">
            Log in
          </a>
          <a href="/signup" className="btn btn-primary">
            Sign up
          </a>
        </div>
      </header>

      <GhostBalls />

      <div className="landing-hero">
        <div className="landing-tagline">
          Know how you&apos;re really playing.
        </div>
        <CalculatorDemo />
        <p className="landing-sub">
          Track your matches and see the skill level you&apos;re performing at
          over your last 10 games.
        </p>
      </div>
    </main>
  );
}
