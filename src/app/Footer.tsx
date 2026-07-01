import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/dashboard">
            <img
              src="/logo.svg"
              alt="CueGenius"
              style={{ height: 25, width: "auto", display: "block" }}
            />
          </Link>{" "}
        </div>
        <div className="footer-links">
          <a href="/about">About Us</a>{" "}
          <span style={{ color: "var(--muted)", margin: "0 12px" }}>·</span>
          <a href="/contact">Contact us</a>
          <span style={{ color: "var(--muted)", margin: "0 12px" }}>·</span>
          <a href="/terms">Terms</a>
          <span style={{ color: "var(--muted)", margin: "0 12px" }}>·</span>
          <a href="/privacy">Privacy</a>
        </div>
        <div className="footer-copy">
          © {year} CueGenius. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
