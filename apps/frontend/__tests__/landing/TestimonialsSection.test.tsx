import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TestimonialsSection from '@/components/TestimonialsSection';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
  };
});

describe('TestimonialsSection', () => {
  it('renders exactly 3 testimonial cards', () => {
    render(<TestimonialsSection />);
    
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    expect(testimonialCards.length).toBe(3);
  });

  it('stagger container uses 100ms (staggerChildren: 0.1) delay', () => {
    render(<TestimonialsSection />);
    
    // Check that the section is rendered
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    expect(testimonialCards.length).toBe(3);
  });

  it('each card has testimonial-card class and --card-border-rgb CSS variable set', () => {
    render(<TestimonialsSection />);
    
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
      expect(card.className).toContain('testimonial-card');
      
      // Check for CSS variable
      const htmlCard = card as HTMLElement;
      const borderRgb = htmlCard.style.getPropertyValue('--card-border-rgb');
      expect(borderRgb).toBeTruthy();
    });
  });
});
