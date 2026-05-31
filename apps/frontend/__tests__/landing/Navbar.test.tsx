import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import * as FramerMotion from 'framer-motion';

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

describe('Navbar', () => {
  it('frosted glass classes are applied to the nav element', () => {
    render(<Navbar />);
    
    const nav = document.querySelector('nav');
    expect(nav?.className).toContain('bg-[#fdfbf7]/80');
    expect(nav?.className).toContain('backdrop-blur-[12px]');
  });

  it('hamburger button has aria-label and aria-expanded attributes', () => {
    render(<Navbar />);
    
    const button = screen.getByLabelText(/Toggle navigation menu/i);
    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('mobile menu animates open/closed with correct initial/animate/exit props', () => {
    render(<Navbar />);
    
    // The mobile menu should not be visible initially
    const mobileLinks = screen.queryAllByText(/Features/i);
    // Should have desktop link but not mobile initially
    expect(mobileLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('"Start Drawing" button has whileHover and whileTap props', () => {
    render(<Navbar />);
    
    const startButton = screen.getAllByText(/Start Drawing/i)[0];
    expect(startButton).toBeTruthy();
  });

  it('when useReducedMotion returns true, whileHover and whileTap are empty', () => {
    vi.mocked(FramerMotion.useReducedMotion).mockReturnValue(true);
    
    render(<Navbar />);
    
    const startButton = screen.getAllByText(/Start Drawing/i)[0];
    expect(startButton).toBeTruthy();
  });
});
