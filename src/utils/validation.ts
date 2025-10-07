/**
 * Data Validation Utilities - PLATINUM STANDARDS
 * 
 * Provides:
 * - Runtime data validation with Zod
 * - Strict TypeScript typing
 * - Performance optimization
 * - Type-safe data structures
 * - Error handling with detailed messages
 */

import { z } from 'zod';

// ============================================================================
// AUDIO DATA VALIDATION SCHEMAS
// ============================================================================

/**
 * Track validation schema with strict typing
 */
export const TrackSchema = z.object({
  id: z.string().min(1, 'Track ID is required'),
  title: z.string().min(1, 'Track title is required').max(100, 'Track title too long'),
  artist: z.string().min(1, 'Artist name is required').max(50, 'Artist name too long'),
  duration: z.number().positive('Duration must be positive').max(3600, 'Duration too long (max 1 hour)'),
  url: z.string().url('Invalid audio URL').refine(
    (url) => url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg'),
    'Audio file must be .mp3, .wav, or .ogg'
  ),
  cover: z.string().url('Invalid cover image URL').optional(),
});

/**
 * Album validation schema with strict typing
 */
export const AlbumSchema = z.object({
  id: z.string().min(1, 'Album ID is required'),
  title: z.string().min(1, 'Album title is required').max(100, 'Album title too long'),
  year: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
  certification: z.string().max(50, 'Certification too long').optional(),
  genre: z.string().max(50, 'Genre too long').optional(),
  description: z.string().min(10, 'Description too short').max(500, 'Description too long'),
  artworkCredit: z.string().max(100, 'Artwork credit too long').optional(),
  coverImage: z.string().url('Invalid cover image URL').optional(),
  fullCoverImage: z.string().url('Invalid full cover image URL').optional(),
  tracks: z.array(TrackSchema).min(1, 'Album must have at least one track'),
});

// ============================================================================
// GALLERY DATA VALIDATION SCHEMAS
// ============================================================================

/**
 * Media item validation schema
 */
export const MediaItemSchema = z.object({
  id: z.string().min(1, 'Media item ID is required'),
  src: z.string().url('Invalid image URL'),
  alt: z.string().min(1, 'Alt text is required').max(200, 'Alt text too long'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(300, 'Description too long'),
});

/**
 * Gallery category validation schema
 */
export const GalleryCategorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  title: z.string().min(1, 'Category title is required').max(100, 'Category title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  items: z.array(MediaItemSchema).min(1, 'Category must have at least one item'),
  gradient: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid gradient color'),
  placeholder: z.string().url('Invalid placeholder image URL'),
});

// ============================================================================
// CONTACT FORM VALIDATION SCHEMAS
// ============================================================================

/**
 * Contact form validation schema
 */
export const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email too long'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message too long'),
  subject: z.string().max(100, 'Subject too long').optional(),
});

// ============================================================================
// NEWSLETTER VALIDATION SCHEMAS
// ============================================================================

/**
 * Newsletter subscription validation schema
 */
export const NewsletterSubscriptionSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email too long'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long')
    .optional(),
  source: z.string().max(50, 'Source too long').optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Track = z.infer<typeof TrackSchema>;
export type Album = z.infer<typeof AlbumSchema>;
export type MediaItem = z.infer<typeof MediaItemSchema>;
export type GalleryCategory = z.infer<typeof GalleryCategorySchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type NewsletterSubscription = z.infer<typeof NewsletterSubscriptionSchema>;

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates data against a schema with detailed error handling
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const errors = result.error.errors.map(err => {
        const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
        return `${path}${err.message}`;
      });
      
      // Log validation errors in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Validation failed${context ? ` for ${context}` : ''}:`, errors);
      }
      
      return { success: false, errors };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    console.error('Validation error:', errorMessage);
    return { success: false, errors: [errorMessage] };
  }
}

/**
 * Validates an array of albums
 */
export function validateAlbums(albums: unknown[]): { success: true; data: Album[] } | { success: false; errors: string[] } {
  const schema = z.array(AlbumSchema);
  return validateData(schema, albums, 'albums');
}

/**
 * Validates gallery categories
 */
export function validateGalleryCategories(categories: unknown[]): { success: true; data: GalleryCategory[] } | { success: false; errors: string[] } {
  const schema = z.array(GalleryCategorySchema);
  return validateData(schema, categories, 'gallery categories');
}

/**
 * Validates contact form data
 */
export function validateContactForm(formData: unknown): { success: true; data: ContactForm } | { success: false; errors: string[] } {
  return validateData(ContactFormSchema, formData, 'contact form');
}

/**
 * Validates newsletter subscription data
 */
export function validateNewsletterSubscription(subscriptionData: unknown): { success: true; data: NewsletterSubscription } | { success: false; errors: string[] } {
  return validateData(NewsletterSubscriptionSchema, subscriptionData, 'newsletter subscription');
}

// ============================================================================
// RUNTIME TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if data is a valid Track
 */
export function isTrack(data: unknown): data is Track {
  return TrackSchema.safeParse(data).success;
}

/**
 * Type guard to check if data is a valid Album
 */
export function isAlbum(data: unknown): data is Album {
  return AlbumSchema.safeParse(data).success;
}

/**
 * Type guard to check if data is a valid MediaItem
 */
export function isMediaItem(data: unknown): data is MediaItem {
  return MediaItemSchema.safeParse(data).success;
}

/**
 * Type guard to check if data is a valid GalleryCategory
 */
export function isGalleryCategory(data: unknown): data is GalleryCategory {
  return GalleryCategorySchema.safeParse(data).success;
}

/**
 * Type guard to check if data is a valid ContactForm
 */
export function isContactForm(data: unknown): data is ContactForm {
  return ContactFormSchema.safeParse(data).success;
}

/**
 * Type guard to check if data is a valid NewsletterSubscription
 */
export function isNewsletterSubscription(data: unknown): data is NewsletterSubscription {
  return NewsletterSubscriptionSchema.safeParse(data).success;
}

// ============================================================================
// SANITIZATION UTILITIES
// ============================================================================

/**
 * Sanitizes string input by trimming and removing dangerous characters
 */
export function sanitizeString(input: string, maxLength?: number): string {
  let sanitized = input.trim();
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>\"'&]/g, '');
  
  // Limit length if specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitizes email input
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Sanitizes URL input
 */
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url.trim());
    return urlObj.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
}

export default {
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
};
