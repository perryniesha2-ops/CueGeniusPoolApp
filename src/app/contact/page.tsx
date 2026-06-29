import { sendContactMessage } from "@/lib/actions/contact";
import Link from "next/link";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  return (
    <main className="app" style={{ maxWidth: 560 }}>
      <h1>Contact us</h1>
      <p className="muted" style={{ marginBottom: 20 }}>
        Questions, feedback, or a problem? Send us a message and we&apos;ll get
        back to you.
      </p>

      {sent ? (
        <div className="card">
          <div className="section-title">Message sent</div>
          <p style={{ lineHeight: 1.6 }}>
            Thanks for reaching out — we&apos;ve received your message and will
            reply to your email soon.
          </p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 12 }}>
            Back home
          </Link>
        </div>
      ) : (
        <div className="card">
          {error && (
            <p className="error" style={{ marginBottom: 12 }}>
              {error}
            </p>
          )}
          <form action={sendContactMessage}>
            <input
              name="name"
              placeholder="Your name"
              required
              className="field"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              required
              className="field"
            />
            <textarea
              name="message"
              placeholder="How can we help?"
              required
              rows={5}
              className="field"
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ marginTop: 8 }}
            >
              Send message
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
