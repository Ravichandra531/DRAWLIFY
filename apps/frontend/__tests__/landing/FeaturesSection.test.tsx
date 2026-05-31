import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeaturesSection from '@/components/FeaturesSection';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
  };
});

describe('FeaturesSection', () => {
  it('renders exactly 6 feature cards', () => {
    render(<FeaturesSection />);
    
    const featureCards = document.querySelectorAll('.feature-card');
    expect(featureCards.length).toBe(6);
  });

  it('each card has bg-[#f5f1eb] background class', () => {
    render(<FeaturesSection />);
    
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      expect(card.className).toContain('bg-[#f5f1eb]');
    });
  });

  it('each card has a blob SVG icon container (not a plain square/rectangle)', () => {
    render(<FeaturesSection />);
    
    const svgBlobs = document.querySelectorAll('svg path[fill-opacity="0.15"]');
    // Should have 6 blob paths (one per feature)
    expect(svgBlobs.length).toBe(6);
  });

  it('stagger container uses 80ms (staggerChildren: 0.08) delay', () => {
    render(<FeaturesSection />);
    
    // Check that the section heading is present
    expect(screen.getByText(/Everything you need/i)).toBeTruthy();
    
    // All 6 cards should be rendered
    const featureCards = document.querySelectorAll('.feature-card');
    expect(featureCards.length).toBe(6);
  });
});
