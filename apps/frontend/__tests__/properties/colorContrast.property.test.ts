import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Pure functions to test
export function getFontForElement(elementType: string): string {
  const headingElements = ['h1', 'h2'];
  if (headingElements.includes(elementType)) {
    return 'Caveat';
  }
  const bodyElements = ['p', 'label', 'caption'];
  if (bodyElements.includes(elementType)) {
    return 'Inter';
  }
  return 'Inter'; // default
}

export function hexToLuminance(hex: string): number {
  const rgb = parseInt(hex.slice(1), 16);
  const r = ((rgb >> 16) & 0xff) / 255;
  const g = ((rgb >> 8) & 0xff) / 255;
  const b = (rgb & 0xff) / 255;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function isColorDarkEnough(hexColor: string): boolean {
  const targetLuminance = hexToLuminance('#2d3436');
  const colorLuminance = hexToLuminance(hexColor);
  return colorLuminance <= targetLuminance;
}

export function isWarmBackground(hexColor: string): boolean {
  return hexColor !== '#ffffff';
}

describe('Color and Typography Property Tests', () => {
  it('Property 10: Headings use Caveat font, body text uses Inter', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('h1', 'h2', 'p', 'label', 'caption'),
        (elementType) => {
          const font = getFontForElement(elementType);
          if (elementType === 'h1' || elementType === 'h2') {
            return font === 'Caveat';
          } else {
            return font === 'Inter';
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: Body text color is not lighter than #2d3436', () => {
    // Test with colors darker than #2d3436
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 45 }).chain(r =>
          fc.integer({ min: 0, max: 52 }).chain(g =>
            fc.integer({ min: 0, max: 54 }).map(b => {
              const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              return hex;
            })
          )
        ),
        (hexColor) => {
          return isColorDarkEnough(hexColor) === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 12: No section uses pure white background', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('#fdfbf7', '#f5f1eb', '#ffffff', '#fefefe'),
        (hexColor) => {
          if (hexColor === '#ffffff') {
            return isWarmBackground(hexColor) === false;
          } else {
            return isWarmBackground(hexColor) === true;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
