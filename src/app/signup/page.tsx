import { signup } from "@/lib/actions/auth";
import AuthShell from "../auth-shell";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthShell>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-title">Create account</div>
        {error && <p className="error">{error}</p>}
        <form>
          <input
            name="name"
            placeholder="Display name"
            required
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
            placeholder="Password (8+ characters)"
            required
            minLength={8}
            className="field"
          />
          <button
            formAction={signup}
            className="btn btn-primary btn-block"
            style={{ marginTop: 8 }}
          >
            Sign up
          </button>
        </form>
        <div style={{ marginTop: 14, fontSize: 14 }}>
          Already have an account? <a href="/login">Log in</a>
        </div>
      </div>
    </AuthShell>
  );
}
