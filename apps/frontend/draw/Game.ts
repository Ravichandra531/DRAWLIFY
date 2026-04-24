import { CanvasManager } from './CanvasManager';
import { ShapeStore } from './ShapeStore';
import { NetworkManager } from './NetworkManager';
import { ToolManager } from './ToolManager';
import { InputHandler } from './InputHandler';
import { TextInputManager } from './TextInputManager';
import { getExistingShapes } from './http';
import type { ToolType } from './types';

export class Game {
  private canvasManager: CanvasManager;
  private store: ShapeStore;
  private network: NetworkManager;
  private toolManager: ToolManager;
  private inputHandler: InputHandler;
  private textInputManager: TextInputManager;

  constructor(
    canvas: HTMLCanvasElement,
    private roomId: string, // stored as class field — fixes the `roomId` free-variable bug
    socket: WebSocket,
  ) {
    this.canvasManager = new CanvasManager(canvas);
    this.store = new ShapeStore();
    this.toolManager = new ToolManager();

    // Socket is injected — NetworkManager no longer creates its own connection
    this.network = new NetworkManager(roomId, socket, (shape) => {
      this.store.update(shape);
      this.canvasManager.render(this.store.getAll());
    });

    this.inputHandler = new InputHandler(
      canvas,
      this.canvasManager,
      this.toolManager,
      this.store,
      this.network,
    );

    this.textInputManager = new TextInputManager(canvas, this.store, this.network, this.toolManager, this.canvasManager);

    this.init();
  }

  private async init(): Promise<void> {
    try {
      const shapes = await getExistingShapes(this.roomId); // `this.roomId` — no longer a free variable
      shapes.forEach((s) => this.store.add(s));
      this.canvasManager.render(this.store.getAll());
    } catch {
      console.error('[Game] Failed to load existing shapes for room', this.roomId);
    }
  }

  setTool(type: ToolType): void {
    this.toolManager.setActiveTool(type);
  }

  forceRender(): void {
    this.canvasManager.render(this.store.getAll());
  }

  setTheme(dark: boolean): void {
    this.canvasManager.bgColor = dark ? '#000000' : '#ffffff';
    this.canvasManager.render(this.store.getAll());
  }

  destroy(): void {
    this.inputHandler.destroy();
    this.network.destroy();
    this.textInputManager.destroy();
  }
}