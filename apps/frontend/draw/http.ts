import { HTTP_BACKEND } from '@/config';
import axios from 'axios';
import type { Shape } from './types';

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const res = await axios.get<Shape[]>(`${HTTP_BACKEND}/shapes/${roomId}`);
    return res.data;
  } catch {
    return [];
  }
}
