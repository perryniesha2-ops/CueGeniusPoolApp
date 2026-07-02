import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveSettings } from "@/lib/actions/settings";
import { getOrCreateMyPlayer } from "@/lib/player";
import type { Player } from "@/lib/types";
import { openBillingPortal } from "@/lib/actions/portal";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "display_name, subscription_status, subscription_cancel_at_period_end, subscription_current_period_end, created_at",
    )
    .eq("id", claims.claims.sub)
    .single<{
      display_name: string | null;
      subscription_status: string | null;
      subscription_cancel_at_period_end: boolean | null;
      subscription_current_period_end: string | null;
      created_at: string;
    }>();
  if (!profile) redirect("/login");

  const playerId = await getOrCreateMyPlayer();
  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single<Player>();

  const isSubscribed = profile.subscription_status === "active";
  const canceling = profile.subscription_cancel_at_period_end ?? false;
  const periodEnd = profile.subscription_current_period_end
    ? new Date(profile.subscription_current_period_end).toLocaleDateString(
        undefined,
        { year: "numeric", month: "long", day: "numeric" },
      )
    : null;

  return (
    <main className="app">
      <h1 style={{ marginBottom: 16 }}>Settings</h1>

      {/* ---- Your details ---- */}
      <div className="card" style={{ maxWidth: 520 }}>
        <div className="section-title">Your details</div>
        <form action={saveSettings}>
          <label className="label">Display name</label>
          <input
            name="display_name"
            defaultValue={player?.name ?? ""}
            className="field"
          />

          <label className="label" style={{ marginTop: 12, display: "block" }}>
            Official ratings
          </label>
          <p className="muted" style={{ margin: "2px 0 8px" }}>
            Your league-assigned levels. Leave blank if you don&apos;t have one.
          </p>

          <input
            name="apa8_sl"
            type="number"
            min="1"
            max="7"
            defaultValue={player?.apa8_sl ?? ""}
            placeholder="APA 8-Ball skill level (1–7)"
            className="field"
          />
          <input
            name="apa9_sl"
            type="number"
            min="1"
            max="9"
            defaultValue={player?.apa9_sl ?? ""}
            placeholder="APA 9-Ball skill level (1–9)"
            className="field"
          />
          <input
            name="fargo_rating"
            type="number"
            defaultValue={player?.fargo_rating ?? ""}
            placeholder="FargoRate rating"
            className="field"
          />

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: 12 }}
          >
            Save settings
          </button>
        </form>
      </div>

      {/* ---- Subscription ---- */}
      <div className="card" style={{ maxWidth: 520 }}>
        <div className="section-title">Subscription</div>
        {isSubscribed ? (
          <>
            {canceling ? (
              <p className="muted" style={{ marginBottom: 12 }}>
                Your CueGenius Pro subscription is set to cancel and will end on{" "}
                <strong style={{ color: "var(--cream)" }}>{periodEnd}</strong>.
                You&apos;ll keep full access until then.
              </p>
            ) : (
              <p className="muted" style={{ marginBottom: 12 }}>
                You&apos;re on CueGenius Pro
                {periodEnd ? `, renewing ${periodEnd}` : ""}. Manage or cancel
                anytime.
              </p>
            )}
            <form action={openBillingPortal}>
              <button type="submit" className="btn btn-primary">
                {canceling ? "Reactivate or manage" : "Manage subscription"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="muted" style={{ marginBottom: 12 }}>
              Upgrade to CueGenius Pro for full access to stats and match
              logging.
            </p>
            <a href="/pricing" className="btn btn-primary">
              Upgrade
            </a>
          </>
        )}
      </div>
    </main>
  );
}
