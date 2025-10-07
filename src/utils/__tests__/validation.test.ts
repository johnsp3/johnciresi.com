/**
 * Validation Utilities Tests - PLATINUM STANDARDS
 * 
 * Comprehensive unit tests for data validation utilities
 * Following React 18 and TypeScript best practices
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  TrackSchema,
  AlbumSchema,
  MediaItemSchema,
  GalleryCategorySchema,
  ContactFormSchema,
  NewsletterSubscriptionSchema,
  validateData,
  validateAlbums,
  validateGalleryCategories,
  validateContactForm,
  validateNewsletterSubscription,
  isTrack,
  isAlbum,
  isMediaItem,
  isGalleryCategory,
  isContactForm,
  isNewsletterSubscription,
  sanitizeString,
  sanitizeEmail,
  sanitizeUrl,
} from '../validation';

describe('Track Validation', () => {
  const validTrack = {
    id: 'track-1',
    title: 'Test Track',
    artist: 'John Ciresi',
    duration: 180,
    url: 'https://example.com/track.mp3',
    cover: 'https://example.com/cover.jpg',
  };

  it('should validate a valid track', () => {
    const result = validateData(TrackSchema, validTrack);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validTrack);
    }
  });

  it('should reject track with missing required fields', () => {
    const invalidTrack = { ...validTrack };
    delete invalidTrack.id;
    
    const result = validateData(TrackSchema, invalidTrack);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Required'))).toBe(true);
    }
  });

  it('should reject track with invalid URL', () => {
    const invalidTrack = { ...validTrack, url: 'not-a-url' };
    
    const result = validateData(TrackSchema, invalidTrack);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Invalid audio URL'))).toBe(true);
    }
  });

  it('should reject track with invalid audio format', () => {
    const invalidTrack = { ...validTrack, url: 'https://example.com/track.txt' };
    
    const result = validateData(TrackSchema, invalidTrack);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Audio file must be .mp3, .wav, or .ogg'))).toBe(true);
    }
  });

  it('should reject track with negative duration', () => {
    const invalidTrack = { ...validTrack, duration: -10 };
    
    const result = validateData(TrackSchema, invalidTrack);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Duration must be positive'))).toBe(true);
    }
  });

  it('should reject track with excessive duration', () => {
    const invalidTrack = { ...validTrack, duration: 4000 };
    
    const result = validateData(TrackSchema, invalidTrack);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Duration too long (max 1 hour)'))).toBe(true);
    }
  });
});

describe('Album Validation', () => {
  const validAlbum = {
    id: 'album-1',
    title: 'Test Album',
    year: '2024',
    certification: 'Latest Release',
    genre: 'Rock',
    description: 'A great test album with amazing tracks',
    artworkCredit: 'Artwork by John Ciresi',
    coverImage: 'https://example.com/cover.jpg',
    fullCoverImage: 'https://example.com/full-cover.jpg',
    tracks: [
      {
        id: 'track-1',
        title: 'Test Track',
        artist: 'John Ciresi',
        duration: 180,
        url: 'https://example.com/track.mp3',
      },
    ],
  };

  it('should validate a valid album', () => {
    const result = validateData(AlbumSchema, validAlbum);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validAlbum);
    }
  });

  it('should reject album with invalid year format', () => {
    const invalidAlbum = { ...validAlbum, year: '24' };
    
    const result = validateData(AlbumSchema, invalidAlbum);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Year must be 4 digits'))).toBe(true);
    }
  });

  it('should reject album with no tracks', () => {
    const invalidAlbum = { ...validAlbum, tracks: [] };
    
    const result = validateData(AlbumSchema, invalidAlbum);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Album must have at least one track'))).toBe(true);
    }
  });

  it('should reject album with invalid track', () => {
    const invalidAlbum = {
      ...validAlbum,
      tracks: [{ ...validAlbum.tracks[0], url: 'invalid-url' }],
    };
    
    const result = validateData(AlbumSchema, invalidAlbum);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Invalid audio URL'))).toBe(true);
    }
  });
});

describe('Media Item Validation', () => {
  const validMediaItem = {
    id: 'media-1',
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
    title: 'Test Media',
    description: 'A test media item',
  };

  it('should validate a valid media item', () => {
    const result = validateData(MediaItemSchema, validMediaItem);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validMediaItem);
    }
  });

  it('should reject media item with invalid image URL', () => {
    const invalidMediaItem = { ...validMediaItem, src: 'not-a-url' };
    
    const result = validateData(MediaItemSchema, invalidMediaItem);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Invalid image URL'))).toBe(true);
    }
  });

  it('should reject media item with missing alt text', () => {
    const invalidMediaItem = { ...validMediaItem };
    delete invalidMediaItem.alt;
    
    const result = validateData(MediaItemSchema, invalidMediaItem);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Required'))).toBe(true);
    }
  });
});

describe('Gallery Category Validation', () => {
  const validCategory = {
    id: 'category-1',
    title: 'Test Category',
    description: 'A test gallery category',
    items: [
      {
        id: 'media-1',
        src: 'https://example.com/image.jpg',
        alt: 'Test image',
        title: 'Test Media',
        description: 'A test media item',
      },
    ],
    gradient: '#FF0000',
    placeholder: 'https://example.com/placeholder.jpg',
  };

  it('should validate a valid gallery category', () => {
    const result = validateData(GalleryCategorySchema, validCategory);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validCategory);
    }
  });

  it('should reject category with invalid gradient color', () => {
    const invalidCategory = { ...validCategory, gradient: 'red' };
    
    const result = validateData(GalleryCategorySchema, invalidCategory);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Invalid gradient color'))).toBe(true);
    }
  });

  it('should reject category with no items', () => {
    const invalidCategory = { ...validCategory, items: [] };
    
    const result = validateData(GalleryCategorySchema, invalidCategory);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Category must have at least one item'))).toBe(true);
    }
  });
});

describe('Contact Form Validation', () => {
  const validContactForm = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a test message for the contact form.',
    subject: 'Test Subject',
  };

  it('should validate a valid contact form', () => {
    const result = validateData(ContactFormSchema, validContactForm);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validContactForm);
    }
  });

  it('should reject contact form with invalid email', () => {
    const invalidForm = { ...validContactForm, email: 'not-an-email' };
    
    const result = validateData(ContactFormSchema, invalidForm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Invalid email address'))).toBe(true);
    }
  });

  it('should reject contact form with short name', () => {
    const invalidForm = { ...validContactForm, name: 'J' };
    
    const result = validateData(ContactFormSchema, invalidForm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Name must be at least 2 characters'))).toBe(true);
    }
  });

  it('should reject contact form with invalid name characters', () => {
    const invalidForm = { ...validContactForm, name: 'John123' };
    
    const result = validateData(ContactFormSchema, invalidForm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Name can only contain letters and spaces'))).toBe(true);
    }
  });

  it('should reject contact form with short message', () => {
    const invalidForm = { ...validContactForm, message: 'Short' };
    
    const result = validateData(ContactFormSchema, invalidForm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Message must be at least 10 characters'))).toBe(true);
    }
  });
});

describe('Newsletter Subscription Validation', () => {
  const validSubscription = {
    email: 'john@example.com',
    name: 'John Doe',
    source: 'website',
  };

  it('should validate a valid newsletter subscription', () => {
    const result = validateData(NewsletterSubscriptionSchema, validSubscription);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validSubscription);
    }
  });

  it('should validate subscription with only email', () => {
    const minimalSubscription = { email: 'john@example.com' };
    
    const result = validateData(NewsletterSubscriptionSchema, minimalSubscription);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(minimalSubscription);
    }
  });

  it('should reject subscription with invalid email', () => {
    const invalidSubscription = { ...validSubscription, email: 'not-an-email' };
    
    const result = validateData(NewsletterSubscriptionSchema, invalidSubscription);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Invalid email address'))).toBe(true);
    }
  });
});

describe('Type Guards', () => {
  const validTrack = {
    id: 'track-1',
    title: 'Test Track',
    artist: 'John Ciresi',
    duration: 180,
    url: 'https://example.com/track.mp3',
  };

  it('should correctly identify valid track', () => {
    expect(isTrack(validTrack)).toBe(true);
  });

  it('should correctly identify invalid track', () => {
    expect(isTrack({ ...validTrack, id: '' })).toBe(false);
  });

  it('should correctly identify valid album', () => {
    const validAlbum = {
      id: 'album-1',
      title: 'Test Album',
      year: '2024',
      description: 'A test album',
      tracks: [validTrack],
    };
    expect(isAlbum(validAlbum)).toBe(true);
  });

  it('should correctly identify invalid album', () => {
    expect(isAlbum({ ...validTrack })).toBe(false);
  });
});

describe('Sanitization Utilities', () => {
  it('should sanitize string input', () => {
    const input = '  <script>alert("xss")</script>Test String  ';
    const result = sanitizeString(input);
    expect(result).toBe('scriptalert(xss)/scriptTest String');
  });

  it('should limit string length', () => {
    const input = 'This is a very long string that should be truncated';
    const result = sanitizeString(input, 10);
    expect(result).toBe('This is a ');
  });

  it('should sanitize email input', () => {
    const input = '  JOHN@EXAMPLE.COM  ';
    const result = sanitizeEmail(input);
    expect(result).toBe('john@example.com');
  });

  it('should sanitize URL input', () => {
    const input = '  https://example.com/path  ';
    const result = sanitizeUrl(input);
    expect(result).toBe('https://example.com/path');
  });

  it('should throw error for invalid URL', () => {
    const input = 'not-a-url';
    expect(() => sanitizeUrl(input)).toThrow('Invalid URL format');
  });
});

describe('Array Validation Functions', () => {
  const validAlbums = [
    {
      id: 'album-1',
      title: 'Test Album',
      year: '2024',
      description: 'A test album',
      tracks: [
        {
          id: 'track-1',
          title: 'Test Track',
          artist: 'John Ciresi',
          duration: 180,
          url: 'https://example.com/track.mp3',
        },
      ],
    },
  ];

  it('should validate array of albums', () => {
    const result = validateAlbums(validAlbums);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validAlbums);
    }
  });

  it('should reject invalid album in array', () => {
    const invalidAlbums = [
      ...validAlbums,
      { ...validAlbums[0], year: 'invalid' },
    ];
    
    const result = validateAlbums(invalidAlbums);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some(error => error.includes('Year must be 4 digits'))).toBe(true);
    }
  });
});
