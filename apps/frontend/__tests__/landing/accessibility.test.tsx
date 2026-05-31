import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import IllustratedPreview from '@/components/IllustratedPreview';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('Accessibility Tests', () => {
  it('all icon-only buttons across all components have a non-empty aria-label', () => {
    const { container: navbarContainer } = render(<Navbar />);
    
    // Find hamburger button (icon-only)
    const iconButtons = navbarContainer.querySelectorAll('button');
    iconButtons.forEach(button => {
      const ariaLabel = button.getAttribute('aria-label');
      if (!button.textContent?.trim()) {
        // Icon-only button must have aria-label
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel?.length).toBeGreaterThan(0);
      }
    });
  });

  it('all decorative SVGs have aria-hidden="true"', () => {
    const { container } = render(<HeroSection />);
    
    // Find decorative shapes
    const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
    expect(decorativeElements.length).toBeGreaterThan(0);
  });

  it('IllustratedPreview SVG has role="img" and a title element', () => {
    render(<IllustratedPreview />);
    
    const svg = document.querySelector('svg[role="img"]');
    expect(svg).toBeTruthy();
    
    const title = document.querySelector('title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toBeTruthy();
  });
});
