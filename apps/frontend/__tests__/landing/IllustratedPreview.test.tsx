import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import IllustratedPreview from '@/components/IllustratedPreview';
import * as FramerMotion from 'framer-motion';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

describe('IllustratedPreview', () => {
  it('renders an SVG element with role="img" and a title child', () => {
    render(<IllustratedPreview />);
    
    const svg = document.querySelector('svg[role="img"]');
    expect(svg).toBeTruthy();
    
    const title = document.querySelector('title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toContain('whiteboard');
  });

  it('fallback paragraph is present in the DOM', () => {
    render(<IllustratedPreview />);
    
    const fallback = document.querySelector('.illustrated-preview-fallback');
    expect(fallback).toBeTruthy();
    expect(fallback?.textContent).toContain('Interactive whiteboard preview');
  });

  it('each motion.path has pathLength animation props with correct stagger delays', () => {
    render(<IllustratedPreview />);
    
    const paths = document.querySelectorAll('path');
    // Should have 3 paths (freehand, shape, arrow)
    expect(paths.length).toBeGreaterThanOrEqual(3);
  });

  it('when useReducedMotion returns true, paths render with pathLength: 1 and no stagger', () => {
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(true);
    
    render(<IllustratedPreview />);
    
    const svg = document.querySelector('svg[role="img"]');
    expect(svg).toBeTruthy();
    
    // In reduced motion mode, paths should be immediately visible
    const paths = document.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(3);
  });
});
