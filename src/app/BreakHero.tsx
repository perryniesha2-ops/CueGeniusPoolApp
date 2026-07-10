"use client";

// components/landing/BreakHero.tsx
import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { rack, step, draw, isSettled, type SimState } from "@/lib/breakPhysics";

const REBREAK_INTERVAL_MS = 14_000;

export default function BreakHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<SimState | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const doRack = useCallback(() => {
    const { w, h } = sizeRef.current;
    if (w && h) stateRef.current = rack(w, h);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const w = (canvas.width = canvas.offsetWidth * dpr);
      const h = (canvas.height = canvas.offsetHeight * dpr);
      sizeRef.current = { w, h };
      doRack();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const state = stateRef.current;
      if (!state) return;
      const { w, h } = sizeRef.current;
      if (!reduced) step(state, w, h);
      draw(ctx, state, w, h);
    };
    frame();

    const rebreak = window.setInterval(() => {
      if (!reduced && stateRef.current && isSettled(stateRef.current)) doRack();
    }, REBREAK_INTERVAL_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(rebreak);
      ro.disconnect();
    };
  }, [doRack]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={doRack}
        className="absolute right-4 top-28 z-[3] border border-cue-cyan px-4 py-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.15em] text-cue-cyan transition-colors hover:bg-cue-cyan hover:text-cue-void md:right-8"
      >
        ↻ Re-break
      </button>
      <div className="relative z-[2] flex min-h-screen w-full flex-col justify-start gap-6 px-4 pb-10 pt-28 md:px-8">
        <h1 className="font-display text-[clamp(2rem,8vw,4.5rem)] uppercase leading-[0.9] text-cue-bone">
          <span className="block">Smash the</span>
          <span
            className="block text-transparent"
            style={{ WebkitTextStroke: "2px #22E4FF" }}
          >
            rack.
          </span>
          <span className="block">
            Track the <span className="text-cue-magenta">damage.</span>
          </span>
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
          <p className="max-w-[420px] font-mono text-[0.78rem] leading-relaxed text-cue-bone/75">
            &gt; Track your matches and see the skill level you&apos;re
            performing at{" "}
            <b className="font-bold text-cue-volt">over your last 10 games</b>.
            Stop playing on vibes. Start playing on data.
          </p>
          <Link
            href="/signup"
            className="inline-block self-start bg-cue-volt px-8 py-3.5 font-display text-[1rem] uppercase tracking-[0.08em] text-cue-void shadow-[6px_6px_0_#FF2E88] transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_#FF2E88]"
          >
            Start tracking
          </Link>
        </div>
      </div>
    </div>
  );
}
