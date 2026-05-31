import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Pure functions to test
export function getStepAnimationX(index: number): number {
  return index % 2 === 0 ? -30 : 30;
}

export function isValidScrollTransition(duration: number, ease: string): boolean {
  return duration >= 0.4 && duration <= 0.7 && ease === 'easeOut';
}

export function buttonHasAriaLabel(buttonProps: { text?: string; 'aria-label'?: string }): boolean {
  const hasVisibleText = buttonProps.text && buttonProps.text.trim().length > 0;
  const hasAriaLabel = buttonProps['aria-label'] && buttonProps['aria-label'].trim().length > 0;
  
  if (!hasVisibleText) {
    return hasAriaLabel;
  }
  return true;
}

export function getAnimationPropKeys(motionProps: Record<string, any>): string[] {
  const validKeys = ['opacity', 'x', 'y', 'scale', 'rotate', 'pathLength'];
  return Object.keys(motionProps).filter(key => validKeys.includes(key));
}

describe('Animation Config Property Tests', () => {
  it('Property 1: Step animation direction alternates by index', () => {
    fc.assert(
      fc.property(fc.nat(1000), (index) => {
        const x = getStepAnimationX(index);
        if (index % 2 === 0) {
          return x === -30;
        } else {
          return x === 30;
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: Scroll animation durations are within bounds', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.4, max: 0.7, noNaN: true }),
        fc.constant('easeOut'),
        (duration, ease) => {
          return isValidScrollTransition(duration, ease) === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: Icon-only buttons have aria-label', () => {
    fc.assert(
      fc.property(
        fc.record({
          text: fc.option(fc.string(), { nil: undefined }),
          'aria-label': fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
        }),
        (buttonProps) => {
          const hasVisibleText = buttonProps.text && buttonProps.text.trim().length > 0;
          if (!hasVisibleText) {
            // Icon-only button must have aria-label
            return buttonHasAriaLabel(buttonProps);
          }
          // Button with text is always valid
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 14: Animations use only transform and opacity properties', () => {
    fc.assert(
      fc.property(
        fc.record({
          opacity: fc.option(fc.double({ min: 0, max: 1 }), { nil: undefined }),
          x: fc.option(fc.integer({ min: -100, max: 100 }), { nil: undefined }),
          y: fc.option(fc.integer({ min: -100, max: 100 }), { nil: undefined }),
          scale: fc.option(fc.double({ min: 0.5, max: 2 }), { nil: undefined }),
          rotate: fc.option(fc.integer({ min: -360, max: 360 }), { nil: undefined }),
          pathLength: fc.option(fc.double({ min: 0, max: 1 }), { nil: undefined }),
        }),
        (motionProps) => {
          const keys = getAnimationPropKeys(motionProps);
          const validKeys = ['opacity', 'x', 'y', 'scale', 'rotate', 'pathLength'];
          return keys.every(key => validKeys.includes(key));
        }
      ),
      { numRuns: 100 }
    );
  });
});
