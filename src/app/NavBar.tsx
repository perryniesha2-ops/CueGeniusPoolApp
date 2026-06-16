import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { headers } from "next/headers";

const HIDDEN_ON = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/beta",
  "/",
];

export default async function NavBar() {
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (HIDDEN_ON.includes(pathname)) return null;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;

  // Logged out → no menu (keeps it off the login screen).
  if (!data?.claims) return null;

  return (
    <nav className="navbar">
      <a href="/dashboard" className="logo" style={{ fontSize: 28 }}>
        CUEGENIUS<span>.</span>
      </a>
      <div className="nav-right">
        <a className="nav-link" href="/dashboard">
          Dashboard
        </a>
        <a className="nav-link" href="/matches">
          Matches
        </a>
        <a className="nav-link" href="/team">
          Teams
        </a>

        <a className="nav-link" href="/settings">
          Settings
        </a>

        <form action={logout} style={{ display: "inline" }}>
          <button className="btn btn-sm">Log out</button>
        </form>
      </div>
    </nav>
  );
}
