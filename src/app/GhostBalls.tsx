"use client";

import { useEffect, useRef } from "react";

export default function GhostBalls() {
  const g8 = useRef<HTMLDivElement>(null);
  const g9 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      // Balls drift opposite the cursor, by a small amount.
      if (g8.current)
        g8.current.style.transform = `translate(${-x * 30}px, ${-y * 30}px)`;
      if (g9.current)
        g9.current.style.transform = `translate(${-x * 45}px, ${-y * 45}px)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={g8} className="ghost g8" />
      <div ref={g9} className="ghost g9" />
    </>
  );
}
