export const metadata = {
  title: "Terms of Service — CueGenius",
};

export default function TermsPage() {
  const updated = "July 1, 2026";
  return (
    <main className="app" style={{ maxWidth: 760 }}>
      <h1>Terms of Service</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Last updated: {updated}</p>

      <div className="card">
        <p style={{ lineHeight: 1.7 }}>
          These Terms of Service (&quot;Terms&quot;) govern your use of CueGenius
          (&quot;the Service&quot;), operated by SynthQA (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;). By creating an account or using the
          Service, you agree to these Terms. If you do not agree, please do not
          use the Service.
        </p>
      </div>

      <Section title="1. What CueGenius is">
        CueGenius is an independent performance-tracking tool for pool players.
        You log your matches, and the Service calculates estimates of the skill
        level you have been performing at across APA 8-ball, APA 9-ball, and
        FargoRate formats. These are performance estimates for personal and
        informational use only.
      </Section>

      <Section title="2. Not affiliated with APA or FargoRate">
        CueGenius is not affiliated with, endorsed by, or connected to the
        American Poolplayers Association (APA), FargoRate, or any official pool
        or billiards organization. The estimates provided may not be used to
        dispute, challenge, or appeal any official skill level, rating, or
        ranking assigned by any sanctioning body or League Operator. Official
        ratings are determined solely by those organizations. The calculations
        in CueGenius are our own independent approximations and may differ from
        your official rating.
      </Section>

      <Section title="3. Accounts">
        You are responsible for maintaining the security of your account and for
        all activity under it. You must provide accurate information and are
        responsible for keeping it up to date. You must be old enough to form a
        binding contract in your jurisdiction to use the Service.
      </Section>

      <Section title="4. Free trial">
        New accounts receive a free trial period of ten (10) days from the date
        of account creation, during which you have full access to the Service.
        When the trial ends, certain features—including logging new matches and
        viewing detailed statistics—require a paid subscription. You may view
        your existing data during and after the trial.
      </Section>

      <Section title="5. Subscriptions and billing">
        CueGenius Pro is offered as a recurring subscription billed monthly or
        yearly, as selected at checkout. By subscribing, you authorize us,
        through our payment processor Stripe, to charge your payment method on a
        recurring basis until you cancel. Subscriptions renew automatically at
        the end of each billing period at the then-current price. Prices are
        shown at checkout and may change with notice for future billing periods.
      </Section>

      <Section title="6. Cancellation and refunds">
        You may cancel your subscription at any time; cancellation takes effect
        at the end of the current billing period, and you retain access until
        then. We do not generally provide refunds for partial billing periods
        except where required by law. Payments are processed by Stripe; we do not
        store your full card details.
      </Section>

      <Section title="7. Acceptable use">
        You agree not to misuse the Service, including attempting to access it by
        unauthorized means, disrupting its operation, reselling access, or using
        it to violate any law. We may suspend or terminate accounts that violate
        these Terms.
      </Section>

      <Section title="8. Your data">
        You retain ownership of the match data you enter. You grant us permission
        to store and process it to provide the Service. Our handling of personal
        data is described in our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </Section>

      <Section title="9. Disclaimers and limitation of liability">
        The Service is provided &quot;as is&quot; without warranties of any kind.
        The performance estimates are approximations and we do not guarantee
        their accuracy. To the fullest extent permitted by law, we are not liable
        for any indirect, incidental, or consequential damages arising from your
        use of the Service. Our total liability is limited to the amount you paid
        us in the twelve months preceding the claim.
      </Section>

      <Section title="10. Changes to these Terms">
        We may update these Terms from time to time. If we make material changes,
        we will update the &quot;Last updated&quot; date and, where appropriate,
        notify you. Continued use of the Service after changes take effect
        constitutes acceptance.
      </Section>

      <Section title="11. Contact">
        Questions about these Terms? Reach us at{" "}
        <a href="mailto:support@synthqa.app">support@synthqa.app</a> or through
        our <a href="/contact">contact page</a>.
      </Section>

      <p className="muted" style={{ fontSize: 13, marginTop: 20 }}>
        © {new Date().getFullYear()} SynthQA. CueGenius is a product of SynthQA.
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>{title}</h2>
      <p style={{ lineHeight: 1.7, color: "var(--cream)" }}>{children}</p>
    </div>
  );
}