import type { Shape } from './types';
import { roughRect, roughEllipse, roughDiamond, roughLine, roughArrow, solidFill, hatchFill } from './rough';

export type ResizeHandle =
  | 'nw' | 'n' | 'ne'
  | 'w'  |       'e'
  | 'sw' | 's' | 'se';

/** Standalone helper — safe to import without instantiating CanvasManager */
export function resizeHandleCursor(handle: ResizeHandle): string {
  const map: Record<ResizeHandle, string> = {
    nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
    w:  'w-resize',                  e:  'e-resize',
    sw: 'sw-resize', s: 's-resize', se: 'se-resize',
  };
  return map[handle];
}

const HANDLE_SIZE = 8;
const SEL_PAD    = 6;

export class CanvasManager {
  private ctx: CanvasRenderingContext2D;
  public panX = 0;
  public panY = 0;
  public bgColor = '#000000';

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('CanvasManager: unable to obtain 2D context.');
    this.ctx = ctx;
  }

  render(shapes: Shape[], previewRenderer?: () => void, selectedId?: string | null): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.translate(this.panX, this.panY);
    shapes.forEach((shape) => {
      this.drawShape(ctx, shape);
      if (selectedId && shape.id === selectedId) {
        this.drawSelectionBox(ctx, shape);
      }
    });
    ctx.globalCompositeOperation = 'source-over';
    previewRenderer?.();
    ctx.restore();
  }

  // ── Selection box + 8 resize handles ────────────────────────────────────────

  private drawSelectionBox(ctx: CanvasRenderingContext2D, shape: Shape): void {
    const bb = this.getBoundingBox(shape);
    if (!bb) return;
    const { x, y, w, h } = bb;
    const p = SEL_PAD;

    ctx.save();
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(x - p, y - p, w + p * 2, h + p * 2);
    ctx.setLineDash([]);

    // 8 handles
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1.5;
    for (const [hx, hy] of this.handlePositions(bb)) {
      ctx.beginPath();
      ctx.rect(hx - HANDLE_SIZE / 2, hy - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  /** Returns [x, y] for each of the 8 handles in order: nw n ne w e sw s se */
  private handlePositions(bb: { x: number; y: number; w: number; h: number }): [number, number][] {
    const { x, y, w, h } = bb;
    const p = SEL_PAD;
    const l = x - p, r = x + w + p, mx = x + w / 2;
    const t = y - p, b = y + h + p, my = y + h / 2;
    return [
      [l, t], [mx, t], [r, t],
      [l, my],          [r, my],
      [l, b],  [mx, b], [r, b],
    ];
  }

  /** Hit-test the 8 resize handles of a selected shape. Returns handle name or null. */
  hitTestHandle(shape: Shape, x: number, y: number): ResizeHandle | null {
    const bb = this.getBoundingBox(shape);
    if (!bb) return null;
    const positions = this.handlePositions(bb);
    const names: ResizeHandle[] = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
    const hit = HANDLE_SIZE / 2 + 2; // slightly larger hit area
    for (let i = 0; i < positions.length; i++) {
      const [hx, hy] = positions[i]!;
      if (Math.abs(x - hx) <= hit && Math.abs(y - hy) <= hit) return names[i]!;
    }
    return null;
  }

  /** Cursor style for a given handle */
  getHandleCursor(handle: ResizeHandle): string {
    return resizeHandleCursor(handle);
  }

  /** Apply a resize delta to a shape, returning the updated shape */
  applyResize(shape: Shape, handle: ResizeHandle, dx: number, dy: number): Shape {
    const MIN = 10;
    switch (shape.type) {
      case 'rect':
      case 'diamond': {
        let { x, y, width, height } = shape;
        if (handle.includes('w')) { x += dx; width -= dx; }
        if (handle.includes('e')) { width += dx; }
        if (handle.includes('n')) { y += dy; height -= dy; }
        if (handle.includes('s')) { height += dy; }
        width  = Math.max(MIN, width);
        height = Math.max(MIN, height);
        return { ...shape, x, y, width, height };
      }
      case 'circle': {
        let { centerX, centerY, radiusX, radiusY } = shape;
        if (handle.includes('e')) radiusX = Math.max(MIN / 2, radiusX + dx / 2);
        if (handle.includes('w')) radiusX = Math.max(MIN / 2, radiusX - dx / 2);
        if (handle.includes('s')) radiusY = Math.max(MIN / 2, radiusY + dy / 2);
        if (handle.includes('n')) radiusY = Math.max(MIN / 2, radiusY - dy / 2);
        // keep center stable for corner handles
        if (handle === 'se' || handle === 'ne') centerX += dx / 2;
        if (handle === 'sw' || handle === 'nw') centerX -= dx / 2;
        if (handle === 'sw' || handle === 'se') centerY += dy / 2;
        if (handle === 'nw' || handle === 'ne') centerY -= dy / 2;
        return { ...shape, centerX, centerY, radiusX, radiusY };
      }
      case 'arrow':
      case 'line': {
        let { x1, y1, x2, y2 } = shape;
        // treat nw/sw/w as moving start point, ne/se/e as moving end point
        if (handle === 'nw' || handle === 'sw' || handle === 'w') { x1 += dx; y1 += dy; }
        if (handle === 'ne' || handle === 'se' || handle === 'e') { x2 += dx; y2 += dy; }
        if (handle === 'n') { y1 += dy; }
        if (handle === 's') { y2 += dy; }
        return { ...shape, x1, y1, x2, y2 };
      }
      case 'text': {
        // Resize text by changing font size
        let { fontSize } = shape;
        const delta = (handle.includes('s') || handle.includes('e')) ? (dx + dy) / 2 : -(dx + dy) / 2;
        fontSize = Math.max(8, Math.round(fontSize + delta));
        return { ...shape, fontSize };
      }
      default:
        return shape;
    }
  }

  /** Get axis-aligned bounding box for any shape */
  getBoundingBox(shape: Shape): { x: number; y: number; w: number; h: number } | null {
    switch (shape.type) {
      case 'rect':    return { x: shape.x, y: shape.y, w: shape.width, h: shape.height };
      case 'diamond': return { x: shape.x, y: shape.y, w: shape.width, h: shape.height };
      case 'circle':  return { x: shape.centerX - shape.radiusX, y: shape.centerY - shape.radiusY, w: shape.radiusX * 2, h: shape.radiusY * 2 };
      case 'arrow':   return { x: Math.min(shape.x1, shape.x2), y: Math.min(shape.y1, shape.y2), w: Math.abs(shape.x2 - shape.x1), h: Math.abs(shape.y2 - shape.y1) };
      case 'line':    return { x: Math.min(shape.x1, shape.x2), y: Math.min(shape.y1, shape.y2), w: Math.abs(shape.x2 - shape.x1), h: Math.abs(shape.y2 - shape.y1) };
      case 'pencil':  return { x: Math.min(shape.startX, shape.endX), y: Math.min(shape.startY, shape.endY), w: Math.abs(shape.endX - shape.startX), h: Math.abs(shape.endY - shape.startY) };
      case 'text': {
        this.ctx.save();
        this.ctx.font = `${shape.fontSize}px Virgil, Segoe UI Emoji, sans-serif`;
        const lines = shape.text.split('\n');
        const w = Math.max(...lines.map(l => this.ctx.measureText(l).width));
        const h = lines.length * shape.fontSize * 1.4;
        this.ctx.restore();
        return { x: shape.x, y: shape.y, w, h };
      }
      default: return null;
    }
  }

  /** Hit-test a point against all shapes, returns topmost match */
  hitTestShape(shapes: Shape[], x: number, y: number): Shape | null {
    const pad = 8;
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i]!;
      if (shape.deleted || shape.type === 'eraser') continue;
      const bb = this.getBoundingBox(shape);
      if (!bb) continue;
      if (x >= bb.x - pad && x <= bb.x + bb.w + pad && y >= bb.y - pad && y <= bb.y + bb.h + pad) {
        return shape;
      }
    }
    return null;
  }

  drawShape(ctx: CanvasRenderingContext2D, shape: Shape): void {
    if (shape.deleted) return;

    const style = shape.style ?? { strokeColor: '#ffffff', fillColor: 'transparent', strokeWidth: 2, roughness: 0, seed: 1 };
    const roughness = style.roughness ?? 0;
    const seed = style.seed ?? 1;
    const hasFill = !!style.fillColor && style.fillColor !== 'transparent';

    ctx.save();
    ctx.strokeStyle = style.strokeColor;
    ctx.lineWidth = style.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.textBaseline = 'top';

    switch (shape.type) {
      case 'rect': {
        if (hasFill) {
          ctx.save();
          if (shape.rounded) {
            const r = Math.min(8, shape.width / 4, shape.height / 4);
            ctx.beginPath();
            ctx.moveTo(shape.x + r, shape.y);
            ctx.lineTo(shape.x + shape.width - r, shape.y);
            ctx.quadraticCurveTo(shape.x + shape.width, shape.y, shape.x + shape.width, shape.y + r);
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height - r);
            ctx.quadraticCurveTo(shape.x + shape.width, shape.y + shape.height, shape.x + shape.width - r, shape.y + shape.height);
            ctx.lineTo(shape.x + r, shape.y + shape.height);
            ctx.quadraticCurveTo(shape.x, shape.y + shape.height, shape.x, shape.y + shape.height - r);
            ctx.lineTo(shape.x, shape.y + r);
            ctx.quadraticCurveTo(shape.x, shape.y, shape.x + r, shape.y);
            ctx.closePath();
          } else {
            ctx.beginPath();
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
          }
          solidFill(ctx, style.fillColor);
          hatchFill(ctx, shape.x, shape.y, shape.width, shape.height, style.fillColor);
          ctx.restore();
        }
        roughRect(ctx, shape.x, shape.y, shape.width, shape.height, roughness, shape.rounded, seed);
        break;
      }

      case 'diamond': {
        const cx = shape.x + shape.width / 2;
        const cy = shape.y + shape.height / 2;
        if (hasFill) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cx, shape.y);
          ctx.lineTo(shape.x + shape.width, cy);
          ctx.lineTo(cx, shape.y + shape.height);
          ctx.lineTo(shape.x, cy);
          ctx.closePath();
          solidFill(ctx, style.fillColor);
          hatchFill(ctx, shape.x, shape.y, shape.width, shape.height, style.fillColor);
          ctx.restore();
        }
        roughDiamond(ctx, shape.x, shape.y, shape.width, shape.height, roughness, seed);
        break;
      }

      case 'circle': {
        if (hasFill) {
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(shape.centerX, shape.centerY, Math.max(shape.radiusX, 0.5), Math.max(shape.radiusY, 0.5), 0, 0, 2 * Math.PI);
          solidFill(ctx, style.fillColor);
          hatchFill(ctx, shape.centerX - shape.radiusX, shape.centerY - shape.radiusY, shape.radiusX * 2, shape.radiusY * 2, style.fillColor);
          ctx.restore();
        }
        roughEllipse(ctx, shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, roughness, seed);
        break;
      }

      case 'arrow':
        roughArrow(ctx, shape.x1, shape.y1, shape.x2, shape.y2, roughness, seed);
        break;

      case 'line':
        roughLine(ctx, shape.x1, shape.y1, shape.x2, shape.y2, roughness, seed);
        break;

      case 'pencil':
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
        break;

      case 'eraser': {
        const er = shape.radius ?? 16;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(shape.endX, shape.endY, er, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        break;
      }

      case 'text': {
        const fontSize = shape.fontSize ?? 20;
        ctx.font = `${fontSize}px Virgil, Segoe UI Emoji, sans-serif`;
        ctx.fillStyle = style.strokeColor;
        shape.text.split('\n').forEach((line, i) => {
          ctx.fillText(line, shape.x, shape.y + i * fontSize * 1.4);
        });
        break;
      }
    }

    ctx.restore();
  }

  /** Convert a MouseEvent to canvas-local coordinates (accounting for pan) */
  getCanvasCoords(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left - this.panX,
      y: e.clientY - rect.top - this.panY,
    };
  }

  /** Convert a MouseEvent to screen coordinates (no pan offset — for UI overlays) */
  getScreenCoords(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  hitTestText(shapes: Shape[], x: number, y: number): import('./types').TextShape | null {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i]!;
      if (shape.type !== 'text' || shape.deleted) continue;
      this.ctx.save();
      this.ctx.font = `${shape.fontSize}px Virgil, Segoe UI Emoji, sans-serif`;
      const lines = shape.text.split('\n');
      const lineH = shape.fontSize * 1.4;
      const totalH = lines.length * lineH;
      const maxW = Math.max(...lines.map((l) => this.ctx.measureText(l).width));
      this.ctx.restore();
      const pad = 6;
      if (x >= shape.x - pad && x <= shape.x + maxW + pad && y >= shape.y - pad && y <= shape.y + totalH + pad) {
        return shape;
      }
    }
    return null;
  }

  getContext(): CanvasRenderingContext2D { return this.ctx; }
}
