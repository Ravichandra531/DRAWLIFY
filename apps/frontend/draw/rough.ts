/**
 * Stable hand-drawn rendering.
 * Seed is stored per-shape so jitter is identical on every redraw (no shaking).
 */

// ── Seeded PRNG ───────────────────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Jitter: offset by ±amount pixels */
function j(rand: () => number, v: number, amt: number): number {
  return v + (rand() - 0.5) * amt * 2;
}

function jAmt(roughness: number): number {
  if (roughness === 0) return 0;
  if (roughness === 1) return 2;
  return 5;
}

// ── Rect ──────────────────────────────────────────────────────────────────────

export function roughRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  roughness: number,
  rounded: boolean,
  seed: number,
): void {
  if (roughness === 0) {
    if (rounded) smoothRoundedRect(ctx, x, y, w, h, 8);
    else { ctx.beginPath(); ctx.rect(x, y, w, h); ctx.stroke(); }
    return;
  }
  const passes = roughness === 2 ? 2 : 1;
  const amt = jAmt(roughness);
  for (let p = 0; p < passes; p++) {
    const rand = mulberry32(seed + p * 997);
    ctx.beginPath();
    if (rounded) {
      const r = Math.min(8, w / 4, h / 4);
      ctx.moveTo(j(rand, x + r, amt),     j(rand, y, amt));
      ctx.lineTo(j(rand, x + w - r, amt), j(rand, y, amt));
      ctx.quadraticCurveTo(j(rand, x + w, amt), j(rand, y, amt), j(rand, x + w, amt), j(rand, y + r, amt));
      ctx.lineTo(j(rand, x + w, amt),     j(rand, y + h - r, amt));
      ctx.quadraticCurveTo(j(rand, x + w, amt), j(rand, y + h, amt), j(rand, x + w - r, amt), j(rand, y + h, amt));
      ctx.lineTo(j(rand, x + r, amt),     j(rand, y + h, amt));
      ctx.quadraticCurveTo(j(rand, x, amt), j(rand, y + h, amt), j(rand, x, amt), j(rand, y + h - r, amt));
      ctx.lineTo(j(rand, x, amt),         j(rand, y + r, amt));
      ctx.quadraticCurveTo(j(rand, x, amt), j(rand, y, amt), j(rand, x + r, amt), j(rand, y, amt));
    } else {
      ctx.moveTo(j(rand, x,     amt), j(rand, y,     amt));
      ctx.lineTo(j(rand, x + w, amt), j(rand, y,     amt));
      ctx.lineTo(j(rand, x + w, amt), j(rand, y + h, amt));
      ctx.lineTo(j(rand, x,     amt), j(rand, y + h, amt));
      ctx.lineTo(j(rand, x,     amt), j(rand, y,     amt));
    }
    ctx.stroke();
  }
}

// ── Ellipse ───────────────────────────────────────────────────────────────────

export function roughEllipse(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, rx: number, ry: number,
  roughness: number,
  seed: number,
): void {
  if (roughness === 0) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.max(rx, 0.5), Math.max(ry, 0.5), 0, 0, 2 * Math.PI);
    ctx.stroke();
    return;
  }
  const passes = roughness === 2 ? 2 : 1;
  const amt = jAmt(roughness);
  const steps = 36;
  for (let p = 0; p < passes; p++) {
    const rand = mulberry32(seed + p * 997);
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      // Compute the clean ellipse point, then jitter the final x/y by a small amount
      const px = cx + rx * Math.cos(angle) + (rand() - 0.5) * amt * 2;
      const py = cy + ry * Math.sin(angle) + (rand() - 0.5) * amt * 2;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

// ── Diamond ───────────────────────────────────────────────────────────────────

export function roughDiamond(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  roughness: number,
  seed: number,
): void {
  const cx = x + w / 2;
  const cy = y + h / 2;
  if (roughness === 0) {
    ctx.beginPath();
    ctx.moveTo(cx, y); ctx.lineTo(x + w, cy);
    ctx.lineTo(cx, y + h); ctx.lineTo(x, cy);
    ctx.closePath(); ctx.stroke();
    return;
  }
  const passes = roughness === 2 ? 2 : 1;
  const amt = jAmt(roughness);
  for (let p = 0; p < passes; p++) {
    const rand = mulberry32(seed + p * 997);
    ctx.beginPath();
    ctx.moveTo(j(rand, cx,     amt), j(rand, y,     amt));
    ctx.lineTo(j(rand, x + w,  amt), j(rand, cy,    amt));
    ctx.lineTo(j(rand, cx,     amt), j(rand, y + h, amt));
    ctx.lineTo(j(rand, x,      amt), j(rand, cy,    amt));
    ctx.closePath();
    ctx.stroke();
  }
}

// ── Line ──────────────────────────────────────────────────────────────────────

export function roughLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  roughness: number,
  seed: number,
): void {
  if (roughness === 0) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    return;
  }
  const amt = jAmt(roughness);
  const rand = mulberry32(seed);
  ctx.beginPath();
  ctx.moveTo(j(rand, x1, amt), j(rand, y1, amt));
  // Slight bow in the middle for a hand-drawn feel
  const mx = (x1 + x2) / 2 + (rand() - 0.5) * amt * 3;
  const my = (y1 + y2) / 2 + (rand() - 0.5) * amt * 3;
  ctx.quadraticCurveTo(mx, my, j(rand, x2, amt), j(rand, y2, amt));
  ctx.stroke();
}

// ── Arrow ─────────────────────────────────────────────────────────────────────

export function roughArrow(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  roughness: number,
  seed: number,
): void {
  roughLine(ctx, x1, y1, x2, y2, roughness, seed);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 14;
  const amt = roughness === 0 ? 0 : jAmt(roughness);
  const rand = mulberry32(seed + 9999);
  ctx.beginPath();
  ctx.moveTo(j(rand, x2, amt), j(rand, y2, amt));
  ctx.lineTo(
    j(rand, x2 - size * Math.cos(angle - Math.PI / 6), amt),
    j(rand, y2 - size * Math.sin(angle - Math.PI / 6), amt),
  );
  ctx.moveTo(j(rand, x2, amt), j(rand, y2, amt));
  ctx.lineTo(
    j(rand, x2 - size * Math.cos(angle + Math.PI / 6), amt),
    j(rand, y2 - size * Math.sin(angle + Math.PI / 6), amt),
  );
  ctx.stroke();
}

// ── Fill helpers ──────────────────────────────────────────────────────────────

/** Solid semi-transparent fill — caller must set up clip path first */
export function solidFill(ctx: CanvasRenderingContext2D, color: string): void {
  if (!color || color === 'transparent') return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.2;
  ctx.fill();
  ctx.restore();
}

/** Hatch fill clipped to the current path */
export function hatchFill(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  color: string,
): void {
  if (!color || color === 'transparent') return;
  ctx.save();
  ctx.clip(); // clip to the shape path already set by caller
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  const gap = 8;
  const diag = Math.sqrt(w * w + h * h);
  for (let i = -diag; i < diag * 2; i += gap) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i - h, y + h);
    ctx.stroke();
  }
  ctx.restore();
}

// ── Smooth rounded rect ───────────────────────────────────────────────────────

function smoothRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  const cr = Math.min(r, w / 4, h / 4);
  ctx.beginPath();
  ctx.moveTo(x + cr, y);
  ctx.lineTo(x + w - cr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + cr);
  ctx.lineTo(x + w, y + h - cr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - cr, y + h);
  ctx.lineTo(x + cr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - cr);
  ctx.lineTo(x, y + cr);
  ctx.quadraticCurveTo(x, y, x + cr, y);
  ctx.closePath();
  ctx.stroke();
}
