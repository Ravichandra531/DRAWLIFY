import type { Shape } from './types';

/**
 * Manages all WebSocket communication for a room.
 * Accepts an already-open socket (owned by RoomCanvas) so it does NOT
 * create or close connections — that lifecycle belongs to the caller.
 */
export class NetworkManager {
  private sendQueue: Shape[] = [];
  private flushTimer: number | null = null;
  private readonly FLUSH_INTERVAL = 50; // ms — batches rapid pencil strokes

  constructor(
    private roomId: string,
    private socket: WebSocket,
    private onRemoteShape: (shape: Shape) => void,
  ) {
    this.initSocket();
  }

  private initSocket(): void {
    this.socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data as string);
        if (message.type === 'message') {
          const payload = JSON.parse(message.message as string);
          // Support both single shape (legacy) and batched shape arrays
          const shapes: Shape[] = Array.isArray(payload) ? payload : [payload];
          shapes.forEach((shape) => this.onRemoteShape(shape));
        }
      } catch {
        // Malformed message — silently discard
      }
    });
  }

  sendShape(shape: Shape): void {
    this.sendQueue.push(shape);
    this.scheduleFlush();
  }

  sendShapes(shapes: Shape[]): void {
    this.sendQueue.push(...shapes);
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.flushTimer !== null) return;
    this.flushTimer = window.setTimeout(() => {
      this.flush();
      this.flushTimer = null;
    }, this.FLUSH_INTERVAL);
  }

  private flush(): void {
    if (
      this.sendQueue.length === 0 ||
      this.socket.readyState !== WebSocket.OPEN
    ) {
      return;
    }
    const payload = {
      type: 'message',
      message: JSON.stringify(this.sendQueue),
      roomId: this.roomId,
    };
    this.socket.send(JSON.stringify(payload));
    this.sendQueue = [];
  }

  destroy(): void {
    if (this.flushTimer !== null) clearTimeout(this.flushTimer);
    // Do NOT close the socket — it is owned by RoomCanvas
  }
}