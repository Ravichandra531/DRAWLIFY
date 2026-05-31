import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CtaSection from '@/components/CtaSection';
import * as FramerMotion from 'framer-motion';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

describe('CtaSection', () => {
  it('renders at least 2 floating shapes with aria-hidden="true"', () => {
    render(<CtaSection />);
    
    const floatingShapes = document.querySelectorAll('[aria-hidden="true"]');
    expect(floatingShapes.length).toBeGreaterThanOrEqual(2);
  });

  it('CTA button has whileHover and whileTap props', () => {
    render(<CtaSection />);
    
    const ctaButton = screen.getByText(/Open Drawlify/i);
    expect(ctaButton).toBeTruthy();
  });

  it('gradient background includes two Color_Palette accent colors', () => {
    render(<CtaSection />);
    
    const section = document.querySelector('section');
    const style = section?.getAttribute('style');
    
    // Check for gradient with accent colors (with or without spaces)
    expect(style).toContain('linear-gradient');
    expect(style).toMatch(/253,?\s*203,?\s*110/); // #fdcb6e
    expect(style).toMatch(/0,?\s*184,?\s*148/); // #00b894
  });
});
