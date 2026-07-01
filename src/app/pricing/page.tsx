import { createCheckoutSession } from "@/lib/actions/checkout";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="app" style={{ maxWidth: 760 }}>
      <h1 style={{ textAlign: "center" }}>CueGenius Pro</h1>
      <p className="muted" style={{ textAlign: "center", marginBottom: 24 }}>
        Unlock the full picture of how you&apos;re playing.
      </p>
      {error && (
        <p className="error" style={{ marginBottom: 16 }}>
          {error}
        </p>
      )}

      <div className="match-grid">
        {/* Monthly */}
        <div className="card">
          <div className="section-title">Monthly</div>
          <div className="stat-big">
            $.99<span style={{ fontSize: 18 }}>/mo</span>
          </div>
          <p className="muted" style={{ margin: "8px 0 16px" }}>
            Billed monthly. Cancel anytime.
          </p>
          <form action={createCheckoutSession}>
            <input type="hidden" name="plan" value="monthly" />
            <button type="submit" className="btn btn-primary btn-block">
              Choose monthly
            </button>
          </form>
        </div>

        {/* Yearly */}
        <div className="card" style={{ borderColor: "rgba(77,107,255,0.5)" }}>
          <div className="section-title">Yearly</div>
          <div className="stat-big">
            $9.99<span style={{ fontSize: 18 }}>/yr</span>
          </div>
          <p className="muted" style={{ margin: "8px 0 16px" }}>
            Two months free vs. monthly.
          </p>
          <form action={createCheckoutSession}>
            <input type="hidden" name="plan" value="yearly" />
            <button type="submit" className="btn btn-primary btn-block">
              Choose yearly
            </button>
          </form>
        </div>
      </div>

      <p
        className="muted"
        style={{ textAlign: "center", fontSize: 13, marginTop: 16 }}
      >
        Secure payment via Stripe. Manage or cancel anytime from your settings.
      </p>
    </main>
  );
}
