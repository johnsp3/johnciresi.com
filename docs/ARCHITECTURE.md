# John Ciresi Musician Website - Architecture Guide

## Overview

This is a professional musician portfolio website built with **Astro**, **React**, and **Tailwind CSS**, featuring a modern dark theme with Apple-inspired design principles. The site is optimized for performance, accessibility, and SEO, deployed on **Vercel** with enterprise-grade features.

## Tech Stack

### Core Framework
- **Astro 5.14.1** - Static site generator with partial hydration
- **React 18.3.1** - Interactive components
- **TypeScript 5.9.2** - Type safety

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.23.22** - Animation library
- **Lucide React** - Icon library

### Performance & Monitoring
- **Sentry** - Error tracking and performance monitoring
- **Web Vitals** - Core Web Vitals measurement
- **Sharp** - Image optimization

### Deployment
- **Vercel** - Hosting platform with edge functions
- **@astrojs/vercel** - Vercel adapter for Astro

## Project Structure

```
John Ciresi website/
├── public/                          # Static assets
│   ├── audio/                       # Audio files (.mp3)
│   │   ├── baby-please.mp3
│   │   ├── dont-say-its-over.mp3
│   │   └── [other tracks...]
│   ├── images/                      # Image assets
│   │   ├── albums/                  # Album cover art
│   │   ├── gallery/                 # Gallery photos
│   │   │   ├── behind-the-scenes/
│   │   │   ├── home-studio/
│   │   │   └── the-archives/
│   │   └── e-book/                  # E-book covers
│   ├── manifest.json                # PWA manifest
│   └── sw.js                        # Service worker
│
├── src/
│   ├── components/                  # Component library
│   │   ├── Root Components (DARK THEME - ACTIVE SITE)
│   │   ├── Navigation.astro         # Main navigation with mobile menu
│   │   ├── Hero.astro               # Hero section
│   │   ├── MusicSection.astro       # Music/discography section
│   │   ├── AboutSection.astro       # About section
│   │   ├── GallerySection.astro     # Gallery section
│   │   ├── ContactSection.astro     # Contact section
│   │   ├── Footer.astro             # Footer
│   │   │
│   │   ├── audio/                   # Audio player components
│   │   │   ├── AudioControls.tsx    # Play/pause controls
│   │   │   ├── ProgressBar.tsx      # Progress bar
│   │   │   ├── AudioInfo.tsx        # Track info display
│   │   │   ├── TrackList.tsx        # Track listing
│   │   │   ├── WorkingAudioModal.tsx # Working On audio player
│   │   │   ├── WorkingAudioHandler.tsx
│   │   │   ├── useAudioPlayer.ts    # Audio player hook
│   │   │   └── useAudioDuration.ts  # Duration calculation
│   │   │
│   │   ├── interactive/             # Interactive components
│   │   │   ├── AlbumSelector.tsx    # Album selection UI
│   │   │   ├── FeaturedAlbum.tsx    # Featured album display
│   │   │   └── HeroButtons.tsx      # Hero CTA buttons
│   │   │
│   │   ├── media/                   # Media components
│   │   │   ├── MediaGallery.tsx     # Gallery wrapper
│   │   │   ├── GalleryGrid.tsx      # Grid layout
│   │   │   ├── GalleryGridItem.tsx  # Grid item
│   │   │   ├── GalleryImage.tsx     # Image component
│   │   │   ├── GalleryModal.tsx     # Lightbox modal
│   │   │   ├── GalleryDescription.tsx
│   │   │   ├── GalleryControls.tsx  # Navigation controls
│   │   │   ├── GalleryKeyboard.tsx  # Keyboard navigation
│   │   │   └── useGalleryGrid.ts    # Gallery logic
│   │   │
│   │   ├── ui/                      # UI primitives
│   │   │   ├── Button.astro         # Button component
│   │   │   ├── Card.astro           # Card component
│   │   │   ├── Heading.astro        # Heading component
│   │   │   ├── Input.astro          # Input component
│   │   │   ├── Section.astro        # Section wrapper
│   │   │   ├── Divider.astro        # Divider
│   │   │   ├── Footer.astro         # Footer UI
│   │   │   ├── Navigation.astro     # Navigation UI
│   │   │   ├── ScrollIndicator.astro
│   │   │   ├── EBookSection.astro   # E-book promo
│   │   │   ├── AlbumCoverViewer.tsx # Album viewer
│   │   │   ├── OptimizedImage.tsx   # Image optimization
│   │   │   └── ErrorBoundary.tsx    # Error handling
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── SEOHead.astro        # SEO metadata
│   │   │   ├── StructuredData.astro # JSON-LD schema
│   │   │   ├── SkipLinks.astro      # Accessibility
│   │   │   ├── AccessibilityScripts.astro
│   │   │   ├── PerformanceScripts.astro
│   │   │   ├── ImageProtectionScripts.astro
│   │   │   ├── WebVitalsScript.astro
│   │   │   ├── ServiceWorkerScript.astro
│   │   │   └── SecurityScript.astro
│   │   │
│   │   └── sections/                # Alternative sections (LIGHT THEME)
│   │       ├── HeroSection.astro    # NOT USED IN PRODUCTION
│   │       ├── AboutSection.astro   # NOT USED IN PRODUCTION
│   │       ├── GallerySection.astro # NOT USED IN PRODUCTION
│   │       ├── ContactSection.astro # NOT USED IN PRODUCTION
│   │       ├── DiscographySection.astro
│   │       └── WorkingOnSection.astro
│   │
│   ├── data/                        # Data files
│   │   ├── audio.ts                 # Audio track metadata
│   │   └── galleryData.ts           # Gallery image data
│   │
│   ├── layouts/                     # Page layouts
│   │   └── BaseLayout.astro         # Base HTML template
│   │
│   ├── pages/                       # Route pages
│   │   ├── index.astro              # Homepage
│   │   └── privacy-policy.astro     # Privacy policy
│   │
│   ├── styles/                      # Global styles
│   │   └── global.css               # Global CSS + Tailwind
│   │
│   ├── utils/                       # Utility functions
│   │   ├── audioDuration.ts         # Audio duration utilities
│   │   ├── performance.ts           # Performance utilities
│   │   ├── performanceBudgets.ts    # Performance monitoring
│   │   ├── security.ts              # Security utilities
│   │   ├── securityHeaders.ts       # Security headers
│   │   ├── errorTracking.ts         # Error tracking (Sentry)
│   │   ├── serviceWorker.ts         # SW utilities
│   │   ├── webVitals.ts             # Web Vitals tracking
│   │   └── error/                   # Error handling
│   │
│   ├── services/                    # Service layer
│   └── types/                       # TypeScript types
│       └── global.d.ts              # Global type definitions
│
├── docs/                            # Documentation
│   └── ARCHITECTURE.md              # This file
│
├── Configuration Files
├── astro.config.mjs                 # Astro configuration
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── vercel.json                      # Vercel configuration
├── eslint.config.js                 # ESLint configuration
├── package.json                     # Dependencies
└── .env.vercel                      # Environment variables
```

## Architecture Patterns

### 1. Component Architecture

#### Astro Components (.astro)
- Used for static content and server-side rendering
- Located in `src/components/` (root level for production)
- Dark theme styling with glass morphism effects
- Examples: Navigation, Hero, MusicSection, AboutSection, GallerySection, ContactSection

#### React Components (.tsx)
- Used for interactive, client-side features
- Categorized by functionality:
  - **audio/** - Music player functionality
  - **interactive/** - User interactions (album selection, buttons)
  - **media/** - Gallery and image handling
  - **ui/** - Reusable UI primitives

### 2. Styling System

**Design Principles:**
- Dark theme with purple/blue accent colors
- Glass morphism effects (`backdrop-blur`, `bg-dark-elevated/80`)
- Smooth transitions and animations
- Mobile-first responsive design

**Color Palette:**
```css
--color-dark-bg: #0a0a0a          /* Main background */
--color-dark-elevated: #1a1a1a    /* Elevated surfaces */
--color-accent-primary: #8b5cf6   /* Purple accent */
--color-text-primary: #ffffff     /* Primary text */
--color-text-secondary: #a0a0a0   /* Secondary text */
```

**Tailwind Custom Classes:**
- `bg-dark-bg` - Main background
- `bg-dark-elevated` - Elevated cards/surfaces
- `text-text-primary` - Primary text
- `text-text-secondary` - Secondary text
- `bg-accent-primary` - Accent color

### 3. Data Management

**Audio Data** (`src/data/audio.ts`):
```typescript
export interface AudioTrack {
  id: string;
  title: string;
  album: string;
  year: number;
  duration: string;
  audioFile: string;
  albumCover: string;
}
```

**Gallery Data** (`src/data/galleryData.ts`):
```typescript
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  description?: string;
}
```

### 4. Performance Optimizations

- **Image Optimization:** Sharp for automatic image optimization
- **Lazy Loading:** Images and components loaded on-demand
- **Code Splitting:** React components hydrated only when needed
- **Service Worker:** Offline support and caching
- **Web Vitals Monitoring:** Real-time performance tracking

### 5. Navigation System

**Desktop Navigation:**
- Fixed top bar with glass morphism
- Links: Music, About, Gallery, Working On, Contact
- Smooth scroll to sections

**Mobile Navigation:**
- Hamburger menu button (< 768px)
- Slide-in menu from right
- Backdrop overlay with blur
- Keyboard accessible (Escape to close)
- Touch-friendly with smooth animations

**Features:**
- ARIA attributes for accessibility
- Focus management
- Body scroll lock when menu open
- Icon toggle (hamburger ↔ close)

### 6. SEO & Accessibility

**SEO Components:**
- `SEOHead.astro` - Meta tags, Open Graph, Twitter Cards
- `StructuredData.astro` - JSON-LD schema for rich snippets
- Sitemap generation with `@astrojs/sitemap`

**Accessibility Features:**
- Skip links for keyboard navigation
- ARIA labels and roles
- Semantic HTML
- Keyboard navigation support
- Focus management
- Color contrast compliance

### 7. Security Features

- Content Security Policy (CSP)
- Security headers via `securityHeaders.ts`
- Image protection scripts
- XSS protection
- CSRF protection removed (unused dependency)

### 8. Error Handling

- **Sentry Integration:** Client and server-side error tracking
- **Error Boundaries:** React error boundaries for graceful failures
- **Error Tracking:** Centralized error logging in `errorTracking.ts`

## Key Features

### Audio Player
- Custom MP3 player with playlist support
- Track progress bar with seek functionality
- Album artwork display
- Featured album section with auto-play
- "Working On" section with unreleased tracks

### Gallery System
- Three categories: Behind the Scenes, Home Studio, The Archives
- Lightbox modal for full-size viewing
- Keyboard navigation (Arrow keys, Escape)
- Touch gestures for mobile
- Lazy loading for performance

### Contact & Newsletter
- Contact form (serverless API)
- Newsletter subscription
- Email validation
- Unsubscribe functionality

### E-Book Promotion
- "The Visual Man" e-book section
- Call-to-action buttons
- Download/preview options

## Build & Deployment

### Development
```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
```

### Quality Checks
```bash
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking
```

### Environment Variables
See `vercel-env-example.txt` for required environment variables:
- Email service configuration
- Sentry DSN
- API keys

### Vercel Deployment
- Automatic deployments from Git
- Edge functions for serverless API routes
- Environment variable management
- Performance analytics

## File Naming Conventions

### Images
- **Albums:** `album-name-year.png` (e.g., `fractured-2024.png`)
- **Gallery:** `category-##.png` (e.g., `home-studio-01.png`)
- **Hero:** `john-studio-high-quality-hero-poster.png`

### Audio
- **Format:** `song-title.mp3` (lowercase, hyphenated)
- **Examples:** `baby-please.mp3`, `dont-say-its-over.mp3`

## Important Notes

### Theme Configuration
⚠️ **CRITICAL:** The production site uses the **DARK THEME** components located in `src/components/` (root level).

**Do NOT use or modify:**
- Files in `src/components/sections/` - These use a LIGHT THEME and are NOT in production

**Current Production Components:**
- `src/components/Navigation.astro` ✅ (Dark theme with mobile menu)
- `src/components/Hero.astro` ✅ (Dark theme)
- `src/components/MusicSection.astro` ✅ (Dark theme)
- `src/components/AboutSection.astro` ✅ (Dark theme)
- `src/components/GallerySection.astro` ✅ (Dark theme)
- `src/components/ContactSection.astro` ✅ (Dark theme)
- `src/components/Footer.astro` ✅ (Dark theme)

### Dependencies Removed
The following dependencies were removed as unused:
- `@astrojs/netlify` - Not deploying to Netlify
- `csurf` - CSRF protection not needed
- `helmet` - Security headers handled differently
- `dotenv` - Environment variables managed by Vercel

## Performance Budgets

- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.8s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Total Bundle Size:** < 500KB

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

When making changes:
1. Always test on mobile and desktop
2. Verify dark theme is preserved
3. Run `npm run build` to check for errors
4. Test accessibility with keyboard navigation
5. Check performance metrics
6. Update documentation as needed

## License

Proprietary - All rights reserved by John Ciresi

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Commit:** 758bbc9 (Dark theme production site)
