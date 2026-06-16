import { checkBetaPassword } from "@/lib/actions/beta";
import AuthShell from "../auth-shell";

export default async function BetaGate({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthShell>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-title">Private beta</div>
        <p className="muted" style={{ marginBottom: 10 }}>
          CUEGENIUS. is in private beta. Enter the access password to continue.
        </p>
        {error && <p className="error">{error}</p>}
        <form action={checkBetaPassword}>
          <input
            name="password"
            type="password"
            placeholder="Beta access password"
            required
            className="field"
          />
          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: 8 }}
          >
            Enter
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
