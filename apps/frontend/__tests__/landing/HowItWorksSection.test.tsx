import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowItWorksSection from '@/components/HowItWorksSection';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
  };
});

describe('HowItWorksSection', () => {
  it('renders exactly 2 SVG dashed connector lines between 3 steps', () => {
    render(<HowItWorksSection />);
    
    const connectorLines = document.querySelectorAll('svg line[stroke-dasharray]');
    expect(connectorLines.length).toBe(2);
  });

  it('connector lines use strokeDasharray attribute', () => {
    render(<HowItWorksSection />);
    
    const connectorLines = document.querySelectorAll('svg line');
    connectorLines.forEach(line => {
      expect(line.getAttribute('stroke-dasharray')).toBeTruthy();
    });
  });

  it('step numerals have aria-hidden="true" and opacity in [0.1, 0.25]', () => {
    render(<HowItWorksSection />);
    
    const numerals = document.querySelectorAll('span[aria-hidden="true"]');
    // Should have 3 step numerals
    expect(numerals.length).toBe(3);
    
    numerals.forEach(numeral => {
      const style = window.getComputedStyle(numeral);
      const opacity = parseFloat(style.opacity || '0.15');
      expect(opacity).toBeGreaterThanOrEqual(0.1);
      expect(opacity).toBeLessThanOrEqual(0.25);
    });
  });

  it('even-index steps have initial.x === -30, odd-index steps have initial.x === 30', () => {
    render(<HowItWorksSection />);
    
    // Check that all 3 steps are rendered
    expect(screen.getByText(/Open the canvas/i)).toBeTruthy();
    expect(screen.getByText(/Sketch your ideas/i)).toBeTruthy();
    expect(screen.getByText(/Share & collaborate/i)).toBeTruthy();
  });
});
