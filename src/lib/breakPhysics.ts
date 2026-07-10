// lib/breakPhysics.ts
// Pure 9-ball break-shot physics. No React, no DOM (drawing takes a ctx).
// Unit-testable: rack(), step() are deterministic given inputs.

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
  n: number; // 0 = cue ball
  stripe: boolean;
  cue: boolean;
}

export interface TrailDot {
  x: number;
  y: number;
  r: number;
  a: number; // alpha, decays per step
  cue: boolean;
}

export interface SimState {
  balls: Ball[];
  trails: TrailDot[];
}

const COLORS = [
  '#FFD447', // 1
  '#2E6BFF', // 2
  '#FF3B30', // 3
  '#B14CF0', // 4
  '#FF7A1A', // 5
  '#2ECC71', // 6
  '#8A3324', // 7
  '#111111', // 8
  '#FFD447', // 9 (striped)
];

const FRICTION = 0.9905;
const CUSHION_RESTITUTION = 0.86;
const STOP_EPSILON = 0.02;
const TRAIL_SPEED_THRESHOLD = 1.2;

/** Diamond rack for 9-ball plus an incoming cue ball. */
export function rack(w: number, h: number, rng: () => number = Math.random): SimState {
  const balls: Ball[] = [];
  const r = Math.max(14, Math.min(w, h) * 0.022);
  const cx = w * 0.62;
  const cy = h * 0.42;
  const gap = r * 2.08;

  const layout: Array<[number, number]> = [
    [0, 0],
    [1, -0.5], [1, 0.5],
    [2, -1], [2, 0], [2, 1],
    [3, -0.5], [3, 0.5],
    [4, 0],
  ];

  layout.forEach(([col, row], i) => {
    balls.push({
      x: cx + col * gap * 0.87,
      y: cy + row * gap,
      vx: 0,
      vy: 0,
      r,
      c: COLORS[i],
      n: i + 1,
      stripe: i === 8,
      cue: false,
    });
  });

  balls.push({
    x: w * 0.08,
    y: cy + (rng() - 0.5) * h * 0.06,
    vx: w * 0.02,
    vy: (rng() - 0.5) * 2,
    r,
    c: '#F2ECE0',
    n: 0,
    stripe: false,
    cue: true,
  });

  return { balls, trails: [] };
}

/** Advance the simulation one frame. Mutates state in place for perf. */
export function step(state: SimState, w: number, h: number): void {
  const { balls, trails } = state;

  for (const b of balls) {
    b.x += b.vx;
    b.y += b.vy;
    b.vx *= FRICTION;
    b.vy *= FRICTION;
    if (Math.abs(b.vx) < STOP_EPSILON) b.vx = 0;
    if (Math.abs(b.vy) < STOP_EPSILON) b.vy = 0;

    if (b.x < b.r) { b.x = b.r; b.vx *= -CUSHION_RESTITUTION; }
    if (b.x > w - b.r) { b.x = w - b.r; b.vx *= -CUSHION_RESTITUTION; }
    if (b.y < b.r) { b.y = b.r; b.vy *= -CUSHION_RESTITUTION; }
    if (b.y > h - b.r) { b.y = h - b.r; b.vy *= -CUSHION_RESTITUTION; }

    if (Math.hypot(b.vx, b.vy) > TRAIL_SPEED_THRESHOLD) {
      trails.push({ x: b.x, y: b.y, r: b.r * 0.55, a: 0.5, cue: b.cue });
    }
  }

  // Pairwise elastic collisions with positional correction.
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i];
      const b = balls[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      const min = a.r + b.r;
      if (d > 0 && d < min) {
        const nx = dx / d;
        const ny = dy / d;
        const overlap = (min - d) / 2;
        a.x -= nx * overlap; a.y -= ny * overlap;
        b.x += nx * overlap; b.y += ny * overlap;
        const p = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (p > 0) {
          a.vx -= p * nx; a.vy -= p * ny;
          b.vx += p * nx; b.vy += p * ny;
        }
      }
    }
  }

  for (const t of trails) t.a -= 0.016;
  state.trails = trails.filter((t) => t.a > 0);
}

export function isSettled(state: SimState): boolean {
  return state.balls.every((b) => b.vx === 0 && b.vy === 0);
}

// ---------- drawing ----------

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v)) | 0;
  const r = clamp((n >> 16) + 255 * amt);
  const g = clamp(((n >> 8) & 255) + 255 * amt);
  const b = clamp((n & 255) + 255 * amt);
  return `rgb(${r},${g},${b})`;
}

export function draw(
  ctx: CanvasRenderingContext2D,
  state: SimState,
  w: number,
  h: number,
): void {
  ctx.clearRect(0, 0, w, h);

  // faint grid
  ctx.strokeStyle = 'rgba(34,228,255,.05)';
  ctx.lineWidth = 1;
  const g = Math.max(48, w / 24);
  for (let x = 0; x < w; x += g) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += g) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  for (const t of state.trails) {
    ctx.fillStyle = t.cue
      ? `rgba(34,228,255,${t.a})`
      : `rgba(255,46,136,${t.a})`;
    ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, 7); ctx.fill();
  }

  for (const b of state.balls) {
    ctx.save();
    ctx.shadowColor = b.cue ? 'rgba(34,228,255,.8)' : b.c;
    ctx.shadowBlur = 22;
    const grd = ctx.createRadialGradient(
      b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.1,
      b.x, b.y, b.r,
    );
    grd.addColorStop(0, 'rgba(255,255,255,.95)');
    grd.addColorStop(0.25, b.c);
    grd.addColorStop(1, shade(b.c, -0.45));
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill();
    ctx.restore();

    if (b.stripe) {
      ctx.save();
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.clip();
      ctx.fillStyle = 'rgba(242,236,224,.92)';
      ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 0.55);
      ctx.fillRect(b.x - b.r, b.y + b.r * 0.45, b.r * 2, b.r * 0.55);
      ctx.restore();
    }

    if (!b.cue) {
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.38, 0, 7); ctx.fill();
      ctx.fillStyle = '#14091f';
      ctx.font = `700 ${b.r * 0.55}px var(--font-mono, "JetBrains Mono"), monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(b.n), b.x, b.y + b.r * 0.03);
    }
  }
}
