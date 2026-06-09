import { login } from "@/lib/actions/auth";
import AuthShell from "../auth-shell";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  return (
    <AuthShell>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-title">Log in</div>
        {error && <p className="error">{error}</p>}
        {message && (
          <p className="muted" style={{ marginBottom: 8 }}>
            {message}
          </p>
        )}
        <form>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="field"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="field"
          />
          <button
            formAction={login}
            className="btn btn-primary btn-block"
            style={{ marginTop: 8 }}
          >
            Log in
          </button>
        </form>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 14,
            fontSize: 14,
          }}
        >
          <a href="/forgot-password">Forgot password?</a>
          <a href="/signup">Create account</a>
        </div>
      </div>
    </AuthShell>
  );
}
