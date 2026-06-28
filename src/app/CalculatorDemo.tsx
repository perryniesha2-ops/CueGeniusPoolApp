"use client";

import { useState } from "react";

export default function CalculatorDemo() {
  const [inn, setInn] = useState(6);
  const [saf, setSaf] = useState(1);
  const [osaf, setOsaf] = useState(0);
  const [gw, setGw] = useState(3);

  const score = Math.max(0.1, (inn - saf - osaf) / Math.max(1, gw));
  const sl =
    score <= 2
      ? 7
      : score <= 3
        ? 6
        : score <= 4
          ? 5
          : score <= 5
            ? 4
            : score <= 7
              ? 3
              : 2;
  const note = sl >= 6 ? "sharp play" : sl >= 4 ? "solid play" : "room to grow";

  const field = (
    label: string,
    val: number,
    set: (n: number) => void,
    min = 0,
  ) => (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "var(--muted)",
          margin: "10px 0 4px",
        }}
      >
        {label}
      </label>
      <input
        type="number"
        value={val}
        min={min}
        className="field"
        onChange={(e) => set(Number(e.target.value))}
      />
    </div>
  );

  return (
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="section-title">What are you really playing at?</div>
      <p className="muted" style={{ marginBottom: 6 }}>
        Enter a sample 8-ball match — no signup needed.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {field("Your innings", inn, setInn, 1)}
        {field("Your safeties", saf, setSaf)}
        {field("Opponent safeties", osaf, setOsaf)}
        {field("Games you won", gw, setGw, 1)}
      </div>
      <div
        style={{
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: 16,
          background: "rgba(77,107,255,0.08)",
          border: "1px solid var(--line)",
          borderRadius: 14,
        }}
      >
        <div className="poolball eight" style={{ width: 80, height: 80 }}>
          <div
            className="poolball-num"
            style={{ width: 38, height: 38, fontSize: 22 }}
          >
            {sl}
          </div>
        </div>
        <div>
          <div className="stat-big">SL {sl}</div>
          <div className="muted">
            avg score {score.toFixed(2)} · {note}
          </div>
        </div>
      </div>
      <a
        href="/signup"
        className="btn btn-primary btn-block"
        style={{ marginTop: 16 }}
      >
        Track all your matches →
      </a>
    </div>
  );
}
