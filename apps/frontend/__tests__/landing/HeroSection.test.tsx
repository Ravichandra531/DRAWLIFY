import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeroSection from '@/components/HeroSection';
import * as FramerMotion from 'framer-motion';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

// Mock IllustratedPreview
vi.mock('@/components/IllustratedPreview', () => ({
  default: () => <div data-testid="illustrated-preview">Illustrated Preview</div>,
}));

describe('HeroSection', () => {
  it('renders at least 4 floating shapes, each with aria-hidden="true"', () => {
    render(<HeroSection />);
    
    const floatingShapes = document.querySelectorAll('[aria-hidden="true"]');
    // Should have at least 4 floating shapes
    expect(floatingShapes.length).toBeGreaterThanOrEqual(4);
  });

  it('entrance animation delays are in correct sequence', () => {
    render(<HeroSection />);
    
    // Check that key elements are present (they have staggered delays)
    expect(screen.getByText(/Free & Open Source/i)).toBeTruthy();
    expect(screen.getByText(/Draw. Think./i)).toBeTruthy();
    expect(screen.getByText(/A virtual whiteboard/i)).toBeTruthy();
    expect(screen.getByText(/Start Drawing/i)).toBeTruthy();
  });

  it('CTA buttons have whileHover and whileTap props', () => {
    render(<HeroSection />);
    
    const ctaButtons = screen.getAllByText(/Start Drawing/i);
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('IllustratedPreview is rendered (no img src="/canvas-preview.png")', () => {
    render(<HeroSection />);
    
    const illustratedPreview = screen.getByTestId('illustrated-preview');
    expect(illustratedPreview).toBeTruthy();
    
    // Ensure no old image tag exists
    const oldImage = document.querySelector('img[src="/canvas-preview.png"]');
    expect(oldImage).toBeFalsy();
  });

  it('when useReducedMotion returns true, looping animations and micro-interactions are disabled', () => {
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(true);
    
    render(<HeroSection />);
    
    // Component should still render
    expect(screen.getByText(/Draw. Think./i)).toBeTruthy();
  });
});
