'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Game } from '@/draw/Game';
import { activeStyle } from '@/draw/Tool';
import type { ToolType, ShapeStyle } from '@/draw/types';

export type { ToolType };

// ── Toolbar config ────────────────────────────────────────────────────────────

type ToolDef = { type: ToolType; label: string; shortcut: string; icon: React.ReactNode };

const TOOLS: ToolDef[] = [
  { type: 'select',  label: 'Select',    shortcut: '1', icon: <SelectIcon /> },
  { type: 'hand',    label: 'Hand',      shortcut: '2', icon: <HandIcon /> },
  { type: 'rect',    label: 'Rectangle', shortcut: '3', icon: <RectIcon /> },
  { type: 'diamond', label: 'Diamond',   shortcut: '4', icon: <DiamondIcon /> },
  { type: 'circle',  label: 'Ellipse',   shortcut: '5', icon: <CircleIcon /> },
  { type: 'arrow',   label: 'Arrow',     shortcut: '6', icon: <ArrowIcon /> },
  { type: 'line',    label: 'Line',      shortcut: '7', icon: <LineIcon /> },
  { type: 'pencil',  label: 'Pencil',    shortcut: '8', icon: <PencilIcon /> },
  { type: 'text',    label: 'Text',      shortcut: '9', icon: <TextIcon /> },
  { type: 'eraser',  label: 'Eraser',    shortcut: '0', icon: <EraserIcon /> },
];

// Dark theme colors
const DARK_STROKE_COLORS  = ['#ffffff', '#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc', '#f472b6'];
const DARK_FILL_COLORS    = ['transparent', '#1e1e2e', '#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc'];
// Light theme colors
const LIGHT_STROKE_COLORS = ['#000000', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#9333ea', '#db2777'];
const LIGHT_FILL_COLORS   = ['transparent', '#ffffff', '#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#bfdbfe', '#e9d5ff'];

const STROKE_WIDTHS     = [1, 2, 4];
const ROUGHNESS_LABELS  = ['Architect', 'Artist', 'Cartoonist'];

// ── Main Canvas component ─────────────────────────────────────────────────────

export function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef   = useRef<Game | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>('rect');
  const [style, setStyle]               = useState<ShapeStyle>({ ...activeStyle });
  const [darkMode, setDarkMode]         = useState(true);

  // Sync tool to game
  useEffect(() => { gameRef.current?.setTool(selectedTool); }, [selectedTool]);

  // Init game once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial canvas size
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const g = new Game(canvas, roomId, socket);
    g.setTool(selectedTool);
    gameRef.current = g;

    // Handle resize by resizing the canvas element directly (no re-mount)
    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      g.forceRender();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      g.destroy();
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When theme changes, update canvas background and default stroke color
  useEffect(() => {
    const defaultStroke = darkMode ? '#ffffff' : '#000000';
    Object.assign(activeStyle, { strokeColor: defaultStroke });
    setStyle(s => ({ ...s, strokeColor: defaultStroke }));
    gameRef.current?.setTheme(darkMode);
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const tool = TOOLS.find(t => t.shortcut === e.key);
      if (tool) setSelectedTool(tool.type);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const updateStyle = useCallback((patch: Partial<ShapeStyle>) => {
    Object.assign(activeStyle, patch);
    setStyle(s => ({ ...s, ...patch }));
  }, []);

  const bg           = darkMode ? '#000000' : '#ffffff';
  const panelBg      = darkMode ? '#1a1a1a' : '#f8f8f8';
  const panelBorder  = darkMode ? '#333333' : '#e2e2e2';
  const strokeColors = darkMode ? DARK_STROKE_COLORS : LIGHT_STROKE_COLORS;
  const fillColors   = darkMode ? DARK_FILL_COLORS   : LIGHT_FILL_COLORS;
  const toolbarBg    = darkMode ? '#1a1a1a' : '#f0f0f0';
  const toolbarBorder = darkMode ? '#333333' : '#d4d4d4';
  const iconColor    = darkMode ? '#aaaaaa' : '#555555';
  const activeToolBg = '#403e6e';

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: bg }}>
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          cursor: selectedTool === 'hand' ? 'grab' : selectedTool === 'select' ? 'default' : selectedTool === 'eraser' ? 'none' : 'crosshair',
          background: bg,
        }}
      />

      {/* ── Top toolbar ── */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-lg px-1.5 py-1 shadow-xl"
        style={{ background: toolbarBg, border: `1px solid ${toolbarBorder}` }}
      >
        {TOOLS.map(({ type, label, shortcut, icon }) => (
          <ToolButton
            key={type}
            label={label}
            shortcut={shortcut}
            active={selectedTool === type}
            activeBg={activeToolBg}
            iconColor={iconColor}
            onClick={() => setSelectedTool(type)}
          >
            {icon}
          </ToolButton>
        ))}
      </div>

      {/* ── Style panel with hamburger toggle ── */}
      <StylePanel
        style={style}
        onChange={updateStyle}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        strokeColors={strokeColors}
        fillColors={fillColors}
        panelBg={panelBg}
        panelBorder={panelBorder}
      />
    </div>
  );
}

// ── Style Panel ───────────────────────────────────────────────────────────────

interface StylePanelProps {
  style: ShapeStyle;
  onChange: (p: Partial<ShapeStyle>) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  strokeColors: string[];
  fillColors: string[];
  panelBg: string;
  panelBorder: string;
}

function StylePanel({ style, onChange, darkMode, onToggleDark, strokeColors, fillColors, panelBg, panelBorder }: StylePanelProps) {
  const [open, setOpen] = useState(false);

  const labelColor = darkMode ? '#888888' : '#6b7280';
  const textColor  = darkMode ? '#cccccc' : '#374151';
  const btnBorder  = darkMode ? '#333333' : '#d4d4d4';
  const btnHover   = darkMode ? '#2a2a2a' : '#e5e5e5';

  return (
    <>
      {/* Hamburger — small square box, top-left, like Excalidraw */}
      <div
        onClick={() => setOpen(o => !o)}
        className="absolute top-3 left-3 flex flex-col justify-center gap-[4px] cursor-pointer z-20 items-center rounded-md"
        style={{
          width: 28, height: 28,
          background: darkMode ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${darkMode ? '#333333' : '#d4d4d4'}`,
        }}
        title={open ? 'Hide styles' : 'Show styles'}
      >
        <span className="block" style={{ width: 14, height: 1.5, borderRadius: 1, background: darkMode ? '#aaaaaa' : '#555555' }} />
        <span className="block" style={{ width: 14, height: 1.5, borderRadius: 1, background: darkMode ? '#aaaaaa' : '#555555' }} />
        <span className="block" style={{ width: 14, height: 1.5, borderRadius: 1, background: darkMode ? '#aaaaaa' : '#555555' }} />
      </div>

      {/* Style panel */}
      {open && (
        <div
          className="absolute top-12 left-3 w-52 rounded-xl shadow-xl text-xs flex flex-col gap-3 p-3 z-20"
          style={{ background: panelBg, border: `1px solid ${panelBorder}`, color: textColor }}
        >
          {/* Dark / Light toggle */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: labelColor }}>
              {darkMode ? 'Dark mode' : 'Light mode'}
            </span>
            <button
              onClick={onToggleDark}
              className="relative w-10 h-5 rounded-full transition-colors duration-200 flex items-center"
              style={{ background: darkMode ? '#111111' : '#d1d5db' }}
              title="Toggle dark/light mode"
            >
              <span
                className="absolute w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: darkMode ? 'translateX(22px)' : 'translateX(2px)' }}
              />
            </button>
          </div>

          {/* Stroke color */}
          <div>
            <div className="mb-1.5 font-semibold uppercase tracking-wider text-[10px]" style={{ color: labelColor }}>Stroke</div>
            <div className="flex flex-wrap gap-1.5">
              {strokeColors.map(c => (
                <ColorSwatch key={c} color={c} active={style.strokeColor === c} darkMode={darkMode} onClick={() => onChange({ strokeColor: c })} />
              ))}
            </div>
          </div>

          {/* Fill color */}
          <div>
            <div className="mb-1.5 font-semibold uppercase tracking-wider text-[10px]" style={{ color: labelColor }}>Fill</div>
            <div className="flex flex-wrap gap-1.5">
              {fillColors.map(c => (
                <ColorSwatch key={c} color={c} active={style.fillColor === c} darkMode={darkMode} onClick={() => onChange({ fillColor: c })} />
              ))}
            </div>
          </div>

          {/* Stroke width */}
          <div>
            <div className="mb-1.5 font-semibold uppercase tracking-wider text-[10px]" style={{ color: labelColor }}>Stroke width</div>
            <div className="flex gap-1.5">
              {STROKE_WIDTHS.map(w => (
                <button
                  key={w}
                  onClick={() => onChange({ strokeWidth: w })}
                  className="flex-1 h-8 rounded-lg border transition-all flex items-center justify-center"
                  style={{
                    borderColor: style.strokeWidth === w ? '#7c3aed' : btnBorder,
                    background: style.strokeWidth === w ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: style.strokeWidth === w ? '#a78bfa' : labelColor,
                  }}
                  onMouseEnter={e => { if (style.strokeWidth !== w) (e.currentTarget as HTMLButtonElement).style.borderColor = btnHover; }}
                  onMouseLeave={e => { if (style.strokeWidth !== w) (e.currentTarget as HTMLButtonElement).style.borderColor = btnBorder; }}
                >
                  <div className="rounded-full" style={{ height: w, width: 24, background: 'currentColor' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Roughness */}
          <div>
            <div className="mb-1.5 font-semibold uppercase tracking-wider text-[10px]" style={{ color: labelColor }}>Roughness</div>
            <div className="flex gap-1.5">
              {ROUGHNESS_LABELS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => onChange({ roughness: i })}
                  title={label}
                  className="flex-1 h-8 rounded-lg border text-[11px] font-medium transition-all"
                  style={{
                    borderColor: style.roughness === i ? '#7c3aed' : btnBorder,
                    background: style.roughness === i ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: style.roughness === i ? '#a78bfa' : labelColor,
                  }}
                >
                  {label[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ToolButton({
  children, label, shortcut, active, activeBg, iconColor, onClick,
}: {
  children: React.ReactNode;
  label: string;
  shortcut: string;
  active: boolean;
  activeBg: string;
  iconColor: string;
  onClick: () => void;
}) {
  return (
    <button
      title={`${label} (${shortcut})`}
      onClick={onClick}
      className="relative flex items-center justify-center rounded-md transition-all"
      style={{
        width: 32, height: 32,
        background: active ? activeBg : 'transparent',
        color: active ? '#ffffff' : iconColor,
      }}
    >
      {children}
      <span className="absolute bottom-0.5 right-0.5 text-[7px] opacity-40">{shortcut}</span>
    </button>
  );
}

function ColorSwatch({ color, active, darkMode, onClick }: { color: string; active: boolean; darkMode: boolean; onClick: () => void }) {
  const border = active ? '#7c3aed' : 'transparent';
  return (
    <button
      onClick={onClick}
      className="w-6 h-6 rounded-md transition-all"
      style={{
        background: color === 'transparent' ? undefined : color,
        border: `2px solid ${border}`,
        transform: active ? 'scale(1.1)' : 'scale(1)',
        outline: color === 'transparent' ? `1px solid ${darkMode ? '#3a3a5c' : '#d4d4d4'}` : 'none',
      }}
      title={color === 'transparent' ? 'No fill' : color}
    >
      {color === 'transparent' && (
        <svg viewBox="0 0 24 24" className="w-full h-full" style={{ color: darkMode ? '#4b5563' : '#9ca3af' }}>
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2.5" />
          <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      )}
    </button>
  );
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function SelectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 3l14 9-7 1-4 7z" />
    </svg>
  );
}
function HandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 11V8a2 2 0 0 0-4 0v3M14 11V6a2 2 0 0 0-4 0v5M10 11V8a2 2 0 0 0-4 0v8a6 6 0 0 0 12 0v-5a2 2 0 0 0-4 0" />
    </svg>
  );
}
function RectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="1" />
    </svg>
  );
}
function DiamondIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l10 10-10 10L2 12z" />
    </svg>
  );
}
function CircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="12" rx="10" ry="7" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="19" x2="19" y2="5" />
      <polyline points="9 5 19 5 19 15" />
    </svg>
  );
}
function LineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="19" x2="19" y2="5" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
function TextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}
function EraserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 20H7L3 16l10-10 7 7-2.5 2.5" />
      <path d="M6.0 11.0 L13 18" />
    </svg>
  );
}
