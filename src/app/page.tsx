import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/dashboard"); // already logged in → straight to app

  return (
    <main className="landing">
      <div className="landing-hero">
        <div className="logo" style={{ fontSize: 72 }}>
          RAILBIRD<span>.</span>
        </div>
        <p className="landing-tagline">Know exactly how you&apos;re playing.</p>
        <p className="landing-sub">
          Track your APA and FargoRate matches, and see the skill level
          you&apos;re really performing at over your last 10 games.
        </p>
        <div className="landing-cta">
          <a
            href="/login"
            className="btn btn-primary"
            style={{ fontSize: 16, padding: "12px 28px" }}
          >
            Get started
          </a>
        </div>
      </div>

      <div className="landing-features">
        <div className="card">
          <div className="section-title">Real performance</div>
          <p className="muted">
            Not just your official number — the level you&apos;re actually
            playing at, calculated from every match you log.
          </p>
        </div>
        <div className="card">
          <div className="section-title">Every format</div>
          <p className="muted">
            APA 8-ball, 9-ball, and FargoRate, each scored the right way and
            tracked on its own rolling 10-match window.
          </p>
        </div>
        <div className="card">
          <div className="section-title">Your whole team</div>
          <p className="muted">
            Build a roster, track every player, and see at a glance who&apos;s
            heating up before league night.
          </p>
        </div>
      </div>
    </main>
  );
}
