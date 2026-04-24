/** Generate a short, random, URL-safe ID. */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
