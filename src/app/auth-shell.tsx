export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="landing">
      <div className="ghost g8" />
      <div className="ghost g9" />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 380,
          margin: "0 auto",
          paddingTop: 70,
        }}
      >
        <div className="logo" style={{ fontSize: 56, textAlign: "center" }}>
          <img
            src="/cuegenius-logo.svg"
            alt="CueGenius"
            style={{ height: 90, width: "auto", display: "block" }}
          />
        </div>
        {children}
      </div>
    </main>
  );
}
