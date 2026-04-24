// ── Primitive Types ───────────────────────────────────────────────────────────

export type Point = { x: number; y: number };

export type ToolType =
  | 'select'
  | 'hand'
  | 'rect'
  | 'diamond'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'pencil'
  | 'text'
  | 'eraser';

// ── Style shared by all drawn shapes ─────────────────────────────────────────

export interface ShapeStyle {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  roughness: number;
  seed: number;        // pre-computed once; makes rough rendering stable across redraws
}

// ── Shape Types ───────────────────────────────────────────────────────────────

export interface BaseShape {
  id: string;
  deleted?: boolean;
  style: ShapeStyle;
}

export interface RectShape extends BaseShape {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  rounded: boolean;
}

export interface DiamondShape extends BaseShape {
  type: 'diamond';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleShape extends BaseShape {
  type: 'circle';
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
}

export interface ArrowShape extends BaseShape {
  type: 'arrow';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LineShape extends BaseShape {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PencilShape extends BaseShape {
  type: 'pencil';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface EraserShape extends BaseShape {
  type: 'eraser';
  endX: number;
  endY: number;
  radius: number;
}

export interface TextShape extends BaseShape {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

export type Shape =
  | RectShape
  | DiamondShape
  | CircleShape
  | ArrowShape
  | LineShape
  | PencilShape
  | EraserShape
  | TextShape;

// ── Active style state (shared across tools) ──────────────────────────────────

export const DEFAULT_STYLE: ShapeStyle = {
  strokeColor: '#ffffff',
  fillColor: 'transparent',
  strokeWidth: 2,
  roughness: 0,
  seed: 1,
};
