import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('should render the app title', () => {
    render(<Header onAvatarClick={() => {}} />);
    expect(screen.getByText('EcoTrack AI')).toBeInTheDocument();
  });

  it('should call onAvatarClick when avatar is clicked', () => {
    const handleAvatarClick = vi.fn();
    render(<Header onAvatarClick={handleAvatarClick} />);
    
    const avatarBtn = screen.getByRole('button', { name: /view or reset profile preferences/i });
    fireEvent.click(avatarBtn);
    
    expect(handleAvatarClick).toHaveBeenCalledTimes(1);
  });

  it('should render notifications button', () => {
    render(<Header onAvatarClick={() => {}} />);
    const notifBtn = screen.getByRole('button', { name: /system notifications/i });
    expect(notifBtn).toBeInTheDocument();
  });
});
