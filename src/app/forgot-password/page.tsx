import { requestPasswordReset } from "@/lib/actions/auth";
import AuthShell from "../auth-shell";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  return (
    <AuthShell>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-title">Reset password</div>
        {message ? (
          <p className="muted">{message}</p>
        ) : (
          <form>
            <p className="muted" style={{ marginBottom: 10 }}>
              Enter your email and we&apos;ll send a reset link.
            </p>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="field"
            />
            <button
              formAction={requestPasswordReset}
              className="btn btn-primary btn-block"
              style={{ marginTop: 8 }}
            >
              Send reset link
            </button>
          </form>
        )}
        <div style={{ marginTop: 14, fontSize: 14 }}>
          <a href="/login">← Back to log in</a>
        </div>
      </div>
    </AuthShell>
  );
}
