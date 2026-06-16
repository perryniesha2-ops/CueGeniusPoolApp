import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/dashboard");

  return (
    <main className="landing">
      <header className="landing-bar">
        <div className="logo" style={{ fontSize: 30 }}>
          CUEGENIUS<span>.</span>
        </div>
        <div className="landing-bar-actions">
          <a href="/login" className="btn">
            Log in
          </a>
          <a href="/signup" className="btn btn-primary">
            Sign up
          </a>
        </div>
      </header>

      <div className="ghost g8" />
      <div className="ghost g9" />

      <div className="landing-hero">
        <div className="logo" style={{ fontSize: 76 }}>
          CUEGENIUS<span>.</span>
        </div>
        <div className="landing-tagline">
          Know how you&apos;re really playing.
        </div>
        <p className="landing-sub">
          Track your APA and FargoRate matches and see the skill level
          you&apos;re performing at over your last 10 games.
        </p>
      </div>
    </main>
  );
}
