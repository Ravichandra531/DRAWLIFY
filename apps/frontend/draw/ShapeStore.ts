import { generateId } from './utils';
import type { Shape } from './types';

type ShapeStoreEvents = {
  add: (shape: Shape) => void;
  update: (shape: Shape) => void;
  remove: (shapeId: string) => void;
  clear: () => void;
};

export class ShapeStore {
  private shapes = new Map<string, Shape>();
  private listeners: Partial<ShapeStoreEvents> = {};

  add(shape: Shape): void {
    if (!shape.id) (shape as Shape).id = generateId();
    this.shapes.set(shape.id, shape);
    this.listeners.add?.(shape);
  }

  update(shape: Shape): void {
    if (!shape.id) return;
    this.shapes.set(shape.id, shape);
    this.listeners.update?.(shape);
  }

  remove(shapeId: string): void {
    const shape = this.shapes.get(shapeId);
    if (shape) {
      shape.deleted = true; // soft-delete so it can be synced to peers
      this.shapes.delete(shapeId);
      this.listeners.remove?.(shapeId);
    }
  }

  getAll(): Shape[] {
    return Array.from(this.shapes.values()).filter((s) => !s.deleted);
  }

  get(id: string): Shape | undefined {
    return this.shapes.get(id);
  }

  clear(): void {
    this.shapes.clear();
    this.listeners.clear?.();
  }

  on<K extends keyof ShapeStoreEvents>(event: K, callback: ShapeStoreEvents[K]): void {
    this.listeners[event] = callback;
  }
}