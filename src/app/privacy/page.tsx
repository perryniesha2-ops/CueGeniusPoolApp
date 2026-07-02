export const metadata = {
  title: "Privacy Policy — CueGenius",
};

export default function PrivacyPage() {
  const updated = "July 1, 2026";
  return (
    <main className="app" style={{ maxWidth: 760 }}>
      <h1>Privacy Policy</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        Last updated: {updated}
      </p>

      <div className="card">
        <p style={{ lineHeight: 1.7 }}>
          This Privacy Policy explains how CueGenius (&quot;we,&quot;
          &quot;us,&quot; operated by SynthQA) collects, uses, and protects your
          information when you use the Service. By using CueGenius, you agree to
          the practices described here.
        </p>
      </div>

      <Section title="1. Information we collect">
        We collect information you provide directly:
        <ul style={{ margin: "8px 0 0", paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Account details: your name (display name) and email address.</li>
          <li>
            Match data: the pool matches, scores, opponents, and skill levels
            you enter.
          </li>
          <li>
            Payment information: when you subscribe, our payment processor
            Stripe collects and processes your payment details. We do not store
            your full card number.
          </li>
        </ul>
        We also automatically collect basic technical data such as log
        information and session cookies needed to keep you signed in.
      </Section>

      <Section title="2. How we use your information">
        We use your information to operate the Service: to authenticate you,
        store and display your match data, calculate performance estimates,
        process subscription payments, send transactional emails (such as
        sign-up confirmation and password resets), and respond to support
        requests.
      </Section>

      <Section title="3. Service providers">
        We rely on trusted third parties to run CueGenius:
        <ul style={{ margin: "8px 0 0", paddingLeft: 20, lineHeight: 1.7 }}>
          <li>
            <strong>Supabase</strong> — database and authentication (stores your
            account and match data).
          </li>
          <li>
            <strong>Stripe</strong> — payment processing for subscriptions.
          </li>
          <li>
            <strong>Resend</strong> — sending transactional emails.
          </li>
          <li>
            <strong>Vercel</strong> — hosting the application.
          </li>
        </ul>
        These providers process data on our behalf and have their own privacy
        practices.
      </Section>

      <Section title="4. Cookies">
        We use essential cookies to keep you logged in and to operate the
        Service. These are required for the app to function; we do not use them
        for third-party advertising.
      </Section>

      <Section title="5. Data sharing">
        We do not sell your personal information. We share data only with the
        service providers listed above as needed to run the Service, or when
        required by law.
      </Section>

      <Section title="6. Data retention">
        We keep your account and match data for as long as your account is
        active. If you delete your account or request deletion, we will remove
        your personal data, except where we are required to retain certain
        records (for example, payment records) by law.
      </Section>

      <Section title="7. Your rights">
        Depending on your location, you may have the right to access, correct,
        or delete your personal data, or to object to certain processing. To
        make a request, contact us at{" "}
        <a href="mailto:cuegenius@synthqa.app">cuegenius@synthqa.app</a>. We
        will respond within a reasonable time.
      </Section>

      <Section title="8. Security">
        We take reasonable measures to protect your data, including encryption
        in transit and access controls. No system is perfectly secure, but we
        work to safeguard your information and rely on reputable providers.
      </Section>

      <Section title="9. Children">
        CueGenius is not directed to children under 13, and we do not knowingly
        collect personal information from them. If you believe a child has
        provided us data, contact us and we will delete it.
      </Section>

      <Section title="10. Changes to this policy">
        We may update this Privacy Policy from time to time. We will update the
        &quot;Last updated&quot; date above, and where appropriate, notify you
        of material changes.
      </Section>

      <Section title="11. Contact">
        Questions about your privacy? Reach us at{" "}
        <a href="mailto:cuegenius@synthqa.app">cuegenius@synthqa.app</a> or
        through our <a href="/contact">contact page</a>.
      </Section>

      <p className="muted" style={{ fontSize: 13, marginTop: 20 }}>
        © {new Date().getFullYear()} SynthQA. CueGenius is a product of SynthQA.
      </p>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>{title}</h2>
      <div style={{ lineHeight: 1.7, color: "var(--cream)" }}>{children}</div>
    </div>
  );
}
