import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AlbumCard from '../AlbumCard';

// Mock the custom event dispatch
const mockDispatchEvent = vi.fn();
Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
  writable: true,
});

describe('AlbumCard', () => {
  const mockAlbum = {
    id: 'test-album',
    title: 'Test Album',
    year: 2024,
    coverImage: '/test-cover.jpg',
    tracks: [
      { id: '1', title: 'Track 1', duration: '3:30', url: '/track1.mp3' },
      { id: '2', title: 'Track 2', duration: '4:15', url: '/track2.mp3' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders album information correctly', () => {
    render(<AlbumCard {...mockAlbum} />);
    
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2 tracks')).toBeInTheDocument();
    expect(screen.getByAltText('Test Album album cover')).toBeInTheDocument();
  });

  it('dispatches openAudioPlayer event when clicked', () => {
    render(<AlbumCard {...mockAlbum} />);
    
    const albumCard = screen.getByRole('button', { hidden: true });
    fireEvent.click(albumCard);
    
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'openAudioPlayer',
        detail: expect.objectContaining({
          album: mockAlbum,
          trackIndex: 0,
        }),
      })
    );
  });

  it('shows track preview on hover', () => {
    render(<AlbumCard {...mockAlbum} />);
    
    const albumCard = screen.getByRole('button', { hidden: true });
    fireEvent.mouseEnter(albumCard);
    
    expect(screen.getByText('Featured Tracks')).toBeInTheDocument();
    expect(screen.getByText('1. Track 1')).toBeInTheDocument();
    expect(screen.getByText('2. Track 2')).toBeInTheDocument();
  });

  it('calls onPlay callback if provided', () => {
    const mockOnPlay = vi.fn();
    render(<AlbumCard {...mockAlbum} onPlay={mockOnPlay} />);
    
    const albumCard = screen.getByRole('button', { hidden: true });
    fireEvent.click(albumCard);
    
    expect(mockOnPlay).toHaveBeenCalledWith('test-album');
  });
});
