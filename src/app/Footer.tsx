export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img
            src="/logo.svg"
            alt="CueGenius"
            style={{ height: 25, width: "auto", display: "block" }}
          />{" "}
        </div>
        <div className="footer-links">
          <a href="mailto:support@synthqa.app">Contact us</a>
        </div>
        <div className="footer-copy">
          © {year} CueGenius. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
