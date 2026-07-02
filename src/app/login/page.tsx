import { login } from "@/lib/actions/auth";
import AuthShell from "../auth-shell";
import Footer from "@/app/Footer";

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
          <p
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(77, 107, 255, 0.12)",
              border: "1px solid rgba(77, 107, 255, 0.35)",
              color: "var(--ice)",
              fontSize: 14,
            }}
          >
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
  <Footer />;
}
