import { generateId } from './utils';
import type { Point, Shape, EraserShape, ShapeStyle } from './types';
import type { ShapeStore } from './ShapeStore';
import type { NetworkManager } from './NetworkManager';
import { DEFAULT_STYLE } from './types';
import { roughRect, roughEllipse, roughDiamond, roughLine, roughArrow } from './rough';

export const ERASER_SIZE = 16; // radius in px

// ── Active style (shared mutable state) ──────────────────────────────────────

export const activeStyle: ShapeStyle = { ...DEFAULT_STYLE };

/** Create a style snapshot for a new shape — generates a fresh seed each time */
function newStyle(): ShapeStyle {
  return { ...activeStyle, seed: Math.floor(Math.random() * 2 ** 31) };
}

// ── Tool Interface ─────────────────────────────────────────────────────────────

export interface Tool {
  onMouseDown?(point: Point, store: ShapeStore, network: NetworkManager): void;
  onMouseMove?(point: Point, isDragging: boolean, store: ShapeStore, network: NetworkManager): void;
  onMouseUp?(point: Point, store: ShapeStore, network: NetworkManager): void;
  renderPreview?(ctx: CanvasRenderingContext2D, start: Point, current: Point): void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function previewStyle(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = activeStyle.strokeColor;
  ctx.lineWidth = activeStyle.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash([6, 4]);
}

// ── Select / Hand tools (no-op — handled at higher level) ─────────────────────

export class SelectTool implements Tool {}
export class HandTool implements Tool {}

// ── Rect Tool ──────────────────────────────────────────────────────────────────

export class RectTool implements Tool {
  private start: Point | null = null;

  onMouseDown(point: Point): void { this.start = point; }

  onMouseUp(point: Point, store: ShapeStore, network: NetworkManager): void {
    if (!this.start) return;
    const shape: Shape = {
      id: generateId(),
      type: 'rect',
      x: Math.min(this.start.x, point.x),
      y: Math.min(this.start.y, point.y),
      width: Math.abs(point.x - this.start.x),
      height: Math.abs(point.y - this.start.y),
      rounded: false,
      style: newStyle(),
    };
    store.add(shape);
    network.sendShape(shape);
    this.start = null;
  }

  renderPreview(ctx: CanvasRenderingContext2D, start: Point, current: Point): void {
    ctx.save();
    previewStyle(ctx);
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    const w = Math.abs(current.x - start.x);
    const h = Math.abs(current.y - start.y);
    roughRect(ctx, x, y, w, h, activeStyle.roughness, false, 0);
    ctx.restore();
  }
}

// ── Rounded Rect Tool ─────────────────────────────────────────────────────────

export class RoundedRectTool implements Tool {
  private start: Point | null = null;

  onMouseDown(point: Point): void { this.start = point; }

  onMouseUp(point: Point, store: ShapeStore, network: NetworkManager): void {
    if (!this.start) return;
    const shape: Shape = {
      id: generateId(),
      type: 'rect',
      x: Math.min(this.start.x, point.x),
      y: Math.min(this.start.y, point.y),
      width: Math.abs(point.x - this.start.x),
      height: Math.abs(point.y - this.start.y),
      rounded: true,
      style: newStyle(),
    };
    store.add(shape);
    network.sendShape(shape);
    this.start = null;
  }

  renderPreview(ctx: CanvasRenderingContext2D, start: Point, current: Point): void {
    ctx.save();
    previewStyle(ctx);
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    const w = Math.abs(current.x - start.x);
    const h = Math.abs(current.y - start.y);
    roughRect(ctx, x, y, w, h, activeStyle.roughness, true, 0);
    ctx.restore();
  }
}

// ── Diamond Tool ──────────────────────────────────────────────────────────────

export class DiamondTool implements Tool {
  private start: Point | null = null;

  onMouseDown(point: Point): void { this.start = point; }

  onMouseUp(point: Point, store: ShapeStore, network: NetworkManager): void {
    if (!this.start) return;
    const shape: Shape = {
      id: generateId(),
      type: 'diamond',
      x: Math.min(this.start.x, point.x),
      y: Math.min(this.start.y, point.y),
      width: Math.abs(point.x - this.start.x),
      height: Math.abs(point.y - this.start.y),
      style: newStyle(),
    };
    store.add(shape);
    network.sendShape(shape);
    this.start = null;
  }

  renderPreview(ctx: CanvasRenderingContext2D, start: Point, current: Point): void {
    ctx.save();
    previewStyle(ctx);
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    const w = Math.abs(current.x - start.x);
    const h = Math.abs(current.y - start.y);
    roughDiamond(ctx, x, y, w, h, activeStyle.roughness, 0);
    ctx.restore();
  }
}

// ── Circle / Ellipse Tool ─────────────────────────────────────────────────────

export class CircleTool implements Tool {
  private start: Point | null = null;

  onMouseDown(point: Point): void { this.start = point; }

  onMouseUp(point: Point, store: ShapeStore, network: NetworkManager): void {
    if (!this.start) return;
    const shape: Shape = {
      id: generateId(),
      type: 'circle',
      centerX: (this.start.x + point.x) / 2,
      centerY: (this.start.y + point.y) / 2,
      radiusX: Math.abs(point.x - this.start.x) / 2,
      radiusY: Math.abs(point.y - this.start.y) / 2,
      style: newStyle(),
    };
    store.add(shape);
    network.sendShape(shape);
    this.start = null;
  }

  renderPreview(ctx: CanvasRenderingContext2D, start: Point, current: Point): void {
    ctx.save();
    previewStyle(ctx);
    roughEllipse(
      ctx,
      (start.x + current.x) / 2,
      (start.y + current.y) / 2,
      Math.abs(current.x - start.x) / 2,
      Math.abs(current.y - start.y) / 2,
      activeStyle.roughness,
      0,
    );
    ctx.restore();
  }
}

// ── Arrow Tool ────────────────────────────────────────────────────────────────

export class ArrowTool implements Tool {
  private start: Point | null = null;

  onMouseDown(point: Point): void { this.start = point; }

  onMouseUp(point: Point, store: ShapeStore, network: NetworkManager): void {
    if (!this.start) return;
    const shape: Shape = {
      id: generateId(),
      type: 'arrow',
      x1: this.start.x,
      y1: this.start.y,
      x2: point.x,
      y2: point.y,
      style: newStyle(),
    };
    store.add(shape);
    network.sendShape(shape);
    this.start = null;
  }

  renderPreview(ctx: CanvasRenderingContext2D, start: Point, current: Point): void {
    ctx.save();
    previewStyle(ctx);
    roughArrow(ctx, start.x, start.y, current.x, current.y, activeStyle.roughness, 0);
    ctx.restore();
  }
}

// ── Line Tool ─────────────────────────────────────────────────────────────────

export class LineTool implements Tool {
  private start: Point | null = null;

  onMouseDown(point: Point): void { this.start = point; }

  onMouseUp(point: Point, store: ShapeStore, network: NetworkManager): void {
    if (!this.start) return;
    const shape: Shape = {
      id: generateId(),
      type: 'line',
      x1: this.start.x,
      y1: this.start.y,
      x2: point.x,
      y2: point.y,
      style: newStyle(),
    };
    store.add(shape);
    network.sendShape(shape);
    this.start = null;
  }

  renderPreview(ctx: CanvasRenderingContext2D, start: Point, current: Point): void {
    ctx.save();
    previewStyle(ctx);
    roughLine(ctx, start.x, start.y, current.x, current.y, activeStyle.roughness, 0);
    ctx.restore();
  }
}

// ── Pencil Tool ────────────────────────────────────────────────────────────────

export class PencilTool implements Tool {
  private points: Point[] = [];

  onMouseDown(point: Point): void {
    this.points = [point];
  }

  onMouseMove(point: Point, isDragging: boolean, store: ShapeStore): void {
    if (!isDragging || this.points.length === 0) return;
    this.points.push(point);
    const last = this.points[this.points.length - 2]!;
    store.add({
      id: generateId(),
      type: 'pencil',
      startX: last.x,
      startY: last.y,
      endX: point.x,
      endY: point.y,
      style: newStyle(),
    });
  }

  onMouseUp(_point: Point, _store: ShapeStore, network: NetworkManager): void {
    if (this.points.length < 2) { this.points = []; return; }
    const segments: Shape[] = [];
    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1]!;
      const curr = this.points[i]!;
      segments.push({
        id: generateId(),
        type: 'pencil',
        startX: prev.x,
        startY: prev.y,
        endX: curr.x,
        endY: curr.y,
        style: newStyle(),
      });
    }
    network.sendShapes(segments);
    this.points = [];
  }
}

// ── Eraser Tool ────────────────────────────────────────────────────────────────

export class EraserTool implements Tool {
  private pendingShapes: EraserShape[] = [];

  onMouseMove(point: Point, isDragging: boolean, store: ShapeStore): void {
    if (!isDragging) return;
    const shape: EraserShape = {
      id: generateId(),
      type: 'eraser',
      endX: point.x,
      endY: point.y,
      radius: ERASER_SIZE,
      style: { ...DEFAULT_STYLE },
    };
    store.add(shape);
    this.pendingShapes.push(shape);
  }

  onMouseUp(_point: Point, _store: ShapeStore, network: NetworkManager): void {
    if (this.pendingShapes.length > 0) {
      network.sendShapes(this.pendingShapes);
      this.pendingShapes = [];
    }
  }
}

// ── Text Tool ──────────────────────────────────────────────────────────────────

export class TextTool implements Tool {}
