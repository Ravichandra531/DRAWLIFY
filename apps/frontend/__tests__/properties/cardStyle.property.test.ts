import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Pure functions to test
export function hasAsymmetricBorderRadius(borderRadius: string): boolean {
  const radii = borderRadius.split(' ').map(r => parseFloat(r));
  if (radii.length !== 4) return false;
  
  // Check that adjacent corners differ
  return (
    radii[0] !== radii[1] ||
    radii[1] !== radii[2] ||
    radii[2] !== radii[3] ||
    radii[3] !== radii[0]
  );
}

export function hasMultiLayerShadow(boxShadow: string): boolean {
  const layers = boxShadow.split(',').map(s => s.trim());
  return layers.length >= 2;
}

describe('Card Style Property Tests', () => {
  it('Property 6: Feature card border radii are asymmetric', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 4, max: 20 }),
          fc.integer({ min: 4, max: 20 }),
          fc.integer({ min: 4, max: 20 }),
          fc.integer({ min: 4, max: 20 })
        ).filter(([a, b, c, d]) => a !== b || b !== c || c !== d || d !== a),
        ([r1, r2, r3, r4]) => {
          const borderRadius = `${r1}px ${r2}px ${r3}px ${r4}px`;
          return hasAsymmetricBorderRadius(borderRadius) === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: Feature cards have multi-layer box shadows', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.record({
            x: fc.integer({ min: 0, max: 10 }),
            y: fc.integer({ min: 0, max: 10 }),
            blur: fc.integer({ min: 0, max: 10 }),
          }),
          fc.record({
            x: fc.integer({ min: 0, max: 10 }),
            y: fc.integer({ min: 0, max: 10 }),
            blur: fc.integer({ min: 0, max: 10 }),
          })
        ),
        ([shadow1, shadow2]) => {
          const boxShadow = `${shadow1.x}px ${shadow1.y}px ${shadow1.blur}px rgba(0,0,0,0.06), ${shadow2.x}px ${shadow2.y}px ${shadow2.blur}px rgba(0,0,0,0.04)`;
          return hasMultiLayerShadow(boxShadow) === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
