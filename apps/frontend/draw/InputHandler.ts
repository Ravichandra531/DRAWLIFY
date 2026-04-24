import type { Point } from './types';
import { resizeHandleCursor } from './CanvasManager';
import type { CanvasManager, ResizeHandle } from './CanvasManager';
import type { ToolManager } from './ToolManager';
import type { ShapeStore } from './ShapeStore';
import type { NetworkManager } from './NetworkManager';
import { ERASER_SIZE } from './Tool';

export class InputHandler {
  private isDragging = false;
  private startPoint: Point | null = null;
  private currentPoint: Point | null = null;
  private rafId: number | null = null;

  // Eraser cursor overlay
  private eraserCursor: HTMLDivElement | null = null;

  // Hand tool pan state
  private panStart: { x: number; y: number } | null = null;
  private panOrigin: { x: number; y: number } = { x: 0, y: 0 };

  // Select tool state
  private selectedId: string | null = null;

  // Move state
  private moveStart: Point | null = null;
  private moveShapeSnapshot: import('./types').Shape | null = null;

  // Resize state
  private resizeHandle: ResizeHandle | null = null;
  private resizeStart: Point | null = null;
  private resizeShapeSnapshot: import('./types').Shape | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private canvasManager: CanvasManager,
    private toolManager: ToolManager,
    private store: ShapeStore,
    private network: NetworkManager,
  ) {
    this.attachListeners();
  }

  private attachListeners(): void {
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mouseleave', this.onMouseLeave);
  }

  private onMouseDown = (e: MouseEvent): void => {
    const tool = this.toolManager.getActiveToolType();

    if (tool === 'text') return;

    if (tool !== 'select' && this.selectedId) {
      this.selectedId = null;
    }

    if (tool === 'hand') {
      this.panStart = { x: e.clientX, y: e.clientY };
      this.panOrigin = { x: this.canvasManager.panX, y: this.canvasManager.panY };
      this.canvas.style.cursor = 'grabbing';
      return;
    }

    if (tool === 'select') {
      const pt = this.canvasManager.getCanvasCoords(e);

      // Check resize handle first (only when a shape is already selected)
      if (this.selectedId) {
        const selectedShape = this.store.get(this.selectedId);
        if (selectedShape) {
          const handle = this.canvasManager.hitTestHandle(selectedShape, pt.x, pt.y);
          if (handle) {
            this.resizeHandle = handle;
            this.resizeStart = pt;
            this.resizeShapeSnapshot = { ...selectedShape } as import('./types').Shape;
            return; // ← don't fall through to move logic
          }
        }
      }

      // Check if clicking on a shape (for move or new selection)
      const hit = this.canvasManager.hitTestShape(this.store.getAll(), pt.x, pt.y);
      if (hit) {
        this.selectedId = hit.id;
        this.moveStart = pt;
        this.moveShapeSnapshot = { ...hit } as import('./types').Shape;
      } else {
        this.selectedId = null;
        this.moveStart = null;
        this.moveShapeSnapshot = null;
      }
      this.requestRender();
      return;
    }

    this.isDragging = true;
    this.startPoint = this.canvasManager.getCanvasCoords(e);
    this.currentPoint = this.startPoint;
    this.toolManager.getActiveTool()?.onMouseDown?.(this.startPoint, this.store, this.network);
    this.requestRender();
  };

  private onMouseMove = (e: MouseEvent): void => {
    const tool = this.toolManager.getActiveToolType();

    if (tool === 'hand') {
      this.updateEraserCursor(e);
      if (this.panStart) {
        this.canvasManager.panX = this.panOrigin.x + (e.clientX - this.panStart.x);
        this.canvasManager.panY = this.panOrigin.y + (e.clientY - this.panStart.y);
        this.requestRender();
      }
      return;
    }

    if (tool === 'select') {
      const pt = this.canvasManager.getCanvasCoords(e);

      // Resize drag
      if (this.resizeHandle && this.resizeStart && this.resizeShapeSnapshot) {
        const dx = pt.x - this.resizeStart.x;
        const dy = pt.y - this.resizeStart.y;
        const resized = this.canvasManager.applyResize(this.resizeShapeSnapshot, this.resizeHandle, dx, dy);
        this.store.update(resized);
        this.canvas.style.cursor = resizeHandleCursor(this.resizeHandle);
        this.requestRender();
        return;
      }

      // Move drag
      if (this.moveStart && this.moveShapeSnapshot && this.selectedId) {
        const dx = pt.x - this.moveStart.x;
        const dy = pt.y - this.moveStart.y;
        const moved = this.applyMove(this.moveShapeSnapshot, dx, dy);
        this.store.update(moved);
        this.canvas.style.cursor = 'move';
        this.requestRender();
        return;
      }

      // Hover: check handles first, then shapes
      if (this.selectedId) {
        const selectedShape = this.store.get(this.selectedId);
        if (selectedShape) {
          const handle = this.canvasManager.hitTestHandle(selectedShape, pt.x, pt.y);
          if (handle) {
            this.canvas.style.cursor = resizeHandleCursor(handle);
            this.requestRender();
            return;
          }
        }
      }
      const hit = this.canvasManager.hitTestShape(this.store.getAll(), pt.x, pt.y);
      this.canvas.style.cursor = hit ? 'move' : 'default';
      this.requestRender();
      return;
    }

    this.currentPoint = this.canvasManager.getCanvasCoords(e);
    this.updateEraserCursor(e);

    if (this.isDragging && tool !== 'text') {
      this.toolManager.getActiveTool()?.onMouseMove?.(
        this.currentPoint,
        true,
        this.store,
        this.network,
      );
    }
    this.requestRender();
  };

  private onMouseUp = (e: MouseEvent): void => {
    const tool = this.toolManager.getActiveToolType();

    if (tool === 'hand') {
      this.panStart = null;
      this.canvas.style.cursor = 'grab';
      return;
    }

    if (tool === 'select') {
      // Commit resize
      if (this.resizeHandle && this.selectedId) {
        const shape = this.store.get(this.selectedId);
        if (shape) this.network.sendShape(shape);
      }
      this.resizeHandle = null;
      this.resizeStart = null;
      this.resizeShapeSnapshot = null;

      // Commit move
      if (this.moveStart && this.selectedId) {
        const shape = this.store.get(this.selectedId);
        if (shape) this.network.sendShape(shape);
      }
      this.moveStart = null;
      this.moveShapeSnapshot = null;
      return;
    }

    if (!this.isDragging) return;
    this.isDragging = false;
    if (tool === 'text') return;

    const endPoint = this.canvasManager.getCanvasCoords(e);
    this.toolManager.getActiveTool()?.onMouseUp?.(endPoint, this.store, this.network);
    this.startPoint = null;
    this.requestRender();
  };

  private onMouseLeave = (): void => {
    this.removeEraserCursor();
  };

  // ── Move helper ───────────────────────────────────────────────────────────

  private applyMove(shape: import('./types').Shape, dx: number, dy: number): import('./types').Shape {
    switch (shape.type) {
      case 'rect':
      case 'diamond':
        return { ...shape, x: shape.x + dx, y: shape.y + dy };
      case 'circle':
        return { ...shape, centerX: shape.centerX + dx, centerY: shape.centerY + dy };
      case 'arrow':
      case 'line':
        return { ...shape, x1: shape.x1 + dx, y1: shape.y1 + dy, x2: shape.x2 + dx, y2: shape.y2 + dy };
      case 'text':
        return { ...shape, x: shape.x + dx, y: shape.y + dy };
      case 'pencil':
        return { ...shape, startX: shape.startX + dx, startY: shape.startY + dy, endX: shape.endX + dx, endY: shape.endY + dy };
      default:
        return shape;
    }
  }

  // ── Eraser cursor ─────────────────────────────────────────────────────────

  private updateEraserCursor(e: MouseEvent): void {
    if (this.toolManager.getActiveToolType() !== 'eraser') {
      this.removeEraserCursor();
      return;
    }
    if (!this.eraserCursor) {
      this.eraserCursor = document.createElement('div');
      Object.assign(this.eraserCursor.style, {
        position: 'fixed',
        pointerEvents: 'none',
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.8)',
        background: 'rgba(255,255,255,0.15)',
        zIndex: '9998',
        transform: 'translate(-50%, -50%)',
      });
      document.body.appendChild(this.eraserCursor);
      this.canvas.style.cursor = 'none';
    }
    const size = ERASER_SIZE * 2;
    Object.assign(this.eraserCursor.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
    });
  }

  private removeEraserCursor(): void {
    if (this.eraserCursor) {
      this.eraserCursor.remove();
      this.eraserCursor = null;
      this.canvas.style.cursor = '';
    }
  }

  // ── RAF render ────────────────────────────────────────────────────────────

  private requestRender(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.canvasManager.render(this.store.getAll(), () => {
        const tool = this.toolManager.getActiveTool();
        if (tool?.renderPreview && this.startPoint && this.currentPoint) {
          tool.renderPreview(
            this.canvasManager.getContext(),
            this.startPoint,
            this.currentPoint,
          );
        }
      }, this.selectedId);
      this.rafId = null;
    });
  }

  destroy(): void {
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mouseleave', this.onMouseLeave);
    this.removeEraserCursor();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
