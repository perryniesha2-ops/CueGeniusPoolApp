import { updatePassword } from "@/lib/actions/auth";
import AuthShell from "../auth-shell";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthShell>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-title">New password</div>
        {error && <p className="error">{error}</p>}
        <form>
          <input
            name="password"
            type="password"
            placeholder="New password (8+ characters)"
            required
            minLength={8}
            className="field"
          />
          <button
            formAction={updatePassword}
            className="btn btn-primary btn-block"
            style={{ marginTop: 8 }}
          >
            Update password
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
