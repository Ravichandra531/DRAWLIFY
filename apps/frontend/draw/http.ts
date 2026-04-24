import { HTTP_BACKEND } from '@/config';
import axios from 'axios';
import type { Shape } from './types';

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  const res = await axios.get<{ message: string }[]>(`${HTTP_BACKEND}/chats/${roomId}`);
  return res.data.flatMap((x) => {
    try {
      const parsed = JSON.parse(x.message);
      // Server may store a single shape or a batched array of shapes
      return Array.isArray(parsed) ? (parsed as Shape[]) : [parsed as Shape];
    } catch {
      return [];
    }
  });
}