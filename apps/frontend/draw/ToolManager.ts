import type { ToolType } from './types';
import type { Tool } from './Tool';
import {
  SelectTool, HandTool, RectTool, RoundedRectTool, DiamondTool,
  CircleTool, ArrowTool, LineTool, PencilTool, EraserTool, TextTool,
} from './Tool';

export class ToolManager {
  private tools: Map<ToolType, Tool> = new Map();
  private activeToolType: ToolType = 'rect';

  constructor() {
    this.registerTool('select', new SelectTool());
    this.registerTool('hand', new HandTool());
    this.registerTool('rect', new RectTool());
    this.registerTool('diamond', new DiamondTool());
    this.registerTool('circle', new CircleTool());
    this.registerTool('arrow', new ArrowTool());
    this.registerTool('line', new LineTool());
    this.registerTool('pencil', new PencilTool());
    this.registerTool('eraser', new EraserTool());
    this.registerTool('text', new TextTool());
  }

  registerTool(type: ToolType, tool: Tool): void {
    this.tools.set(type, tool);
  }

  setActiveTool(type: ToolType): void {
    if (this.tools.has(type)) this.activeToolType = type;
  }

  getActiveToolType(): ToolType { return this.activeToolType; }
  getActiveTool(): Tool | undefined { return this.tools.get(this.activeToolType); }
}
