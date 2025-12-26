import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { PublicLanding } from '../src/components/PublicLanding';

describe('PublicLanding component', () => {
  it('renders without throwing and shows tap prompt', () => {
    render(<PublicLanding onStaffLogin={() => {}} onExplore={() => {}} />);
    const btn = screen.getByText(/Tap to Explore Destinations/i);
    expect(btn).toBeDefined();
  });

  it('opens explore menu when tapping the prompt', async () => {
    render(<PublicLanding onStaffLogin={() => {}} onExplore={() => {}} />);
    const user = userEvent.setup();
    const btn = screen.getAllByText(/Tap to Explore Destinations/i)[0];
    await user.click(btn);

    // Expect menu options to appear (wait for animation/state update)
    expect(await screen.findByText(/Open Interactive Kiosk/i)).toBeDefined();
    expect(await screen.findByText(/View Accommodations/i)).toBeDefined();
    expect(await screen.findByText(/View Flights/i)).toBeDefined();
  });
});
