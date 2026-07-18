export default function AboutPage() {
  return (
    <main className="app" style={{ maxWidth: 760 }}>
      <h1>About CueGenius</h1>
      <p
        className="muted"
        style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}
      >
        CueGenius is an independent performance-tracking tool for pool players.
        Log your matches and see the skill level you&apos;ve been playing at
        over your recent games, across APA 8-ball, APA 9-ball, and FargoRate
        formats.
      </p>

      <div className="card">
        <div className="section-title">How the numbers work</div>
        <p style={{ lineHeight: 1.7, color: "var(--cream)" }}>
          The skill levels and ratings CueGenius shows are{" "}
          <strong>performance estimates</strong> — they reflect how you&apos;ve
          been playing recently, calculated from the match data you enter. They
          are <strong>not</strong> official ratings. The official APA and
          FargoRate formulas are proprietary and are not used or reproduced
          here; our calculations are our own independent approximations and may
          differ from your sanctioned rating.
        </p>
      </div>

      <div className="card" style={{ borderColor: "rgba(255,77,87,0.35)" }}>
        <div className="section-title" style={{ color: "var(--red)" }}>
          Important disclaimer
        </div>
        <p style={{ lineHeight: 1.7, color: "var(--cream)" }}>
          CueGenius is{" "}
          <strong>
            not affiliated with, endorsed by, or connected to the American
            Poolplayers Association (APA), FargoRate, or any official pool or
            billiards organization
          </strong>
          . &quot;APA&quot; and &quot;FargoRate&quot; are the property of their
          respective owners and are referenced here only to describe the scoring
          formats CueGenius helps you track.
        </p>
        <p style={{ lineHeight: 1.7, color: "var(--cream)", marginTop: 12 }}>
          The estimates provided by CueGenius are for personal informational and
          entertainment purposes only. They{" "}
          <strong>
            may not be used to dispute, challenge, or appeal any official skill
            level, rating, or ranking
          </strong>{" "}
          assigned by the APA, FargoRate, a League Operator, or any sanctioning
          body. Official ratings are determined solely by those organizations.
        </p>
      </div>

      <div className="card">
        <div className="section-title">Contact</div>
        <p style={{ lineHeight: 1.7, color: "var(--cream)" }}>
          Questions, feedback, or issues? Reach us at{" "}
          <a href="mailto:cuegenius@synthqatech.com">cuegenius@synthqatech.com</a>.
        </p>
      </div>

      <p className="muted" style={{ fontSize: 13, marginTop: 20 }}>
        © {new Date().getFullYear()} CueGenius. All rights reserved.
      </p>
    </main>
  );
}
