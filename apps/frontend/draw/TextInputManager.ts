import { generateId } from './utils';
import type { TextShape, ShapeStyle } from './types';
import { activeStyle } from './Tool';
import type { ShapeStore } from './ShapeStore';
import type { NetworkManager } from './NetworkManager';
import type { ToolManager } from './ToolManager';
import type { CanvasManager } from './CanvasManager';

export const FONT_SIZE = 20;
export const FONT_FAMILY = 'Virgil, Segoe UI Emoji, sans-serif';
export const LINE_HEIGHT = 1.4;

export class TextInputManager {
  private activeTextarea: HTMLTextAreaElement | null = null;
  // Canvas-space position of the active textarea
  private activeX = 0;
  private activeY = 0;
  // If editing an existing shape, store its id so we update instead of create
  private editingShapeId: string | null = null;
  // Snapshot of the shape being edited, so Escape can restore it
  private editingSnapshot: TextShape | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private store: ShapeStore,
    private network: NetworkManager,
    private toolManager: ToolManager,
    private canvasManager: CanvasManager,
  ) {
    this.canvas.addEventListener('mousedown', this.onCanvasMouseDown);
  }

  private onCanvasMouseDown = (e: MouseEvent): void => {
    if (this.toolManager.getActiveToolType() !== 'text') {
      if (this.activeTextarea) this.commit();
      return;
    }

    // If a textarea is already open, commit it first
    if (this.activeTextarea) {
      this.commit();
      return;
    }

    e.preventDefault(); // stop canvas from stealing focus

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if the click landed on an existing text shape
    const hit = this.canvasManager.hitTestText(this.store.getAll(), x, y);
    if (hit) {
      this.openForEdit(hit, e.clientX, e.clientY);
    } else {
      this.openNew(x, y, e.clientX, e.clientY);
    }
  };

  // ── Open a blank textarea at a new position ──────────────────────────────────

  private openNew(canvasX: number, canvasY: number, clientX: number, clientY: number): void {
    this.activeX = canvasX;
    this.activeY = canvasY;
    this.editingShapeId = null;
    this.showTextarea(clientX, clientY, '');
  }

  // ── Open a textarea pre-filled with an existing shape's text ─────────────────

  private openForEdit(shape: TextShape, clientX: number, clientY: number): void {
    const rect = this.canvas.getBoundingClientRect();
    this.activeX = shape.x;
    this.activeY = shape.y;
    this.editingShapeId = shape.id;
    this.editingSnapshot = { ...shape }; // snapshot for Escape restore

    // Hide the shape while editing so the textarea sits exactly on top
    this.store.remove(shape.id);
    this.canvasManager.render(this.store.getAll());

    this.showTextarea(rect.left + shape.x, rect.top + shape.y, shape.text);
  }

  // ── Core textarea creation ────────────────────────────────────────────────────

  private showTextarea(clientX: number, clientY: number, initialValue: string): void {
    const textarea = document.createElement('textarea');
    textarea.rows = 1;
    textarea.placeholder = 'Type something…';
    textarea.spellcheck = false;
    textarea.value = initialValue;

    Object.assign(textarea.style, {
      position: 'fixed',
      left: `${clientX}px`,
      top: `${clientY}px`,
      minWidth: '2px',
      width: '2px',
      minHeight: `${FONT_SIZE * LINE_HEIGHT}px`,
      padding: '0',
      margin: '0',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: '#ffffff',
      fontSize: `${FONT_SIZE}px`,
      fontFamily: FONT_FAMILY,
      lineHeight: String(LINE_HEIGHT),
      resize: 'none',
      overflow: 'hidden',
      whiteSpace: 'pre',
      zIndex: '9999',
      caretColor: '#ffffff',
      boxShadow: 'none',
    } as unknown as Partial<CSSStyleDeclaration>);

    document.body.appendChild(textarea);

    // Size to fit initial content (for edit mode)
    const autoResize = () => {
      textarea.style.width = '2px';
      textarea.style.width = `${textarea.scrollWidth + 2}px`;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener('input', autoResize);

    textarea.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        this.cancel();
      }
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault();
        this.commit();
      }
    });

    textarea.addEventListener('blur', () => {
      if (this.activeTextarea === textarea) this.commit();
    });

    this.activeTextarea = textarea;

    requestAnimationFrame(() => {
      textarea.focus();
      // Place cursor at end of existing text
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      autoResize();
    });
  }

  // ── Commit: save the shape (new or updated) ───────────────────────────────────

  private commit(): void {
    const textarea = this.activeTextarea;
    if (!textarea) return;
    this.activeTextarea = null;

    const text = textarea.value.trim();
    textarea.remove();

    if (text) {
      if (this.editingShapeId) {
        const updated: TextShape = {
          id: this.editingShapeId,
          type: 'text',
          x: this.activeX,
          y: this.activeY,
          text,
          fontSize: FONT_SIZE,
          style: this.editingSnapshot?.style ?? { ...activeStyle },
        };
        this.store.update(updated);
        this.network.sendShape(updated);
      } else {
        const shape: TextShape = {
          id: generateId(),
          type: 'text',
          x: this.activeX,
          y: this.activeY,
          text,
          fontSize: FONT_SIZE,
          style: { ...activeStyle },
        };
        this.store.add(shape);
        this.network.sendShape(shape);
      }
    } else if (this.editingShapeId) {
      const deleted: TextShape = {
        id: this.editingShapeId,
        type: 'text',
        x: this.activeX,
        y: this.activeY,
        text: '',
        fontSize: FONT_SIZE,
        style: this.editingSnapshot?.style ?? { ...activeStyle },
        deleted: true,
      };
      this.network.sendShape(deleted);
    }

    this.editingShapeId = null;
    this.editingSnapshot = null;
    this.canvasManager.render(this.store.getAll());
  }

  // ── Cancel: restore the original shape without saving ────────────────────────

  private cancel(): void {
    const textarea = this.activeTextarea;
    if (!textarea) return;
    this.activeTextarea = null;
    textarea.remove();

    if (this.editingSnapshot) {
      // Restore the original shape
      this.store.add(this.editingSnapshot);
      this.editingSnapshot = null;
    }

    this.editingShapeId = null;
    this.canvasManager.render(this.store.getAll());
  }

  destroy(): void {
    this.canvas.removeEventListener('mousedown', this.onCanvasMouseDown);
    if (this.activeTextarea) {
      this.activeTextarea.remove();
      this.activeTextarea = null;
    }
  }
}
