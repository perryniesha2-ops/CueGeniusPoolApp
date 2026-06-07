import { login, signup } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  return (
    <main className="app" style={{ maxWidth: 380 }}>
      <div
        className="logo"
        style={{ textAlign: "center", fontSize: 56, marginTop: 40 }}
      >
        RAILBIRD<span>.</span>
      </div>
      <p className="label" style={{ textAlign: "center", marginBottom: 24 }}>
        League Performance Tracker
      </p>

      <div className="card">
        {error && <p className="error">{error}</p>}
        {message && (
          <p className="muted" style={{ marginBottom: 8 }}>
            {message}
          </p>
        )}
        <form>
          <input
            name="name"
            placeholder="Display name (for sign up)"
            className="field"
          />
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
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              formAction={login}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Log in
            </button>
            <button formAction={signup} className="btn" style={{ flex: 1 }}>
              Sign up
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
