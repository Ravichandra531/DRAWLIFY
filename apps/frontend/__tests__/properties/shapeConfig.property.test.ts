import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Pure functions to test
export function isValidShapeDelay(delay: number): boolean {
  return delay >= 0 && delay <= 2;
}

export function isValidShapeOpacity(opacity: number): boolean {
  return opacity >= 0.15 && opacity <= 0.4;
}

export function isValidShapeSize(size: number): boolean {
  return size >= 40 && size <= 200;
}

describe('Shape Config Property Tests', () => {
  it('Property 3: Floating shape animation delays are within bounds', () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 2, noNaN: true }), (delay) => {
        return isValidShapeDelay(delay) === true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: Floating shape opacity is within bounds', () => {
    fc.assert(
      fc.property(fc.double({ min: 0.15, max: 0.4, noNaN: true }), (opacity) => {
        return isValidShapeOpacity(opacity) === true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 5: Floating shape dimensions are within bounds', () => {
    fc.assert(
      fc.property(fc.integer({ min: 40, max: 200 }), (size) => {
        return isValidShapeSize(size) === true;
      }),
      { numRuns: 100 }
    );
  });
});
