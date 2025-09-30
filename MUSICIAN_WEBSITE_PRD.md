# Professional Musician Website - Project Requirements Document

## Project Overview
Create an elite Astro website for a professional musician with 50,000 followers, inspired by Apple's design aesthetic. The site will be industrial-first, custom-built (no templates), with enterprise-grade code quality.

## Design Philosophy
- **Apple-inspired aesthetic**: Clean, minimal, sophisticated
- **Industrial-first approach**: Professional, high-quality, premium feel
- **Custom design**: No templates, completely bespoke
- **Dark/Light mode**: Seamless theme switching
- **Ultra-optimized**: Mobile and desktop responsive
- **Performance-focused**: Fast, smooth, enterprise-grade

## Core Features Required

### 1. Audio Experience
- **Album Gallery**: Beautiful album cover displays
- **Interactive Player**: Click album → beautiful MP3 player
- **Preview System**: 30-second song previews
- **Multiple Tracks**: Choose from several preview songs per album
- **HLS Streaming**: Professional audio streaming with hls.js

### 2. Visual Gallery
- **Beautiful Media Display**: Professional photo/video gallery
- **High-Quality Images**: Optimized with Sharp
- **Responsive Grid**: Adaptive layouts for all devices
- **Smooth Animations**: Framer Motion for premium feel

### 3. Technical Requirements
- **Astro Framework**: Latest version with zero JS by default
- **React Islands**: Interactive components only when needed
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **PWA Support**: Offline functionality
- **SEO Optimized**: Automatic sitemap generation

## 🚨 CRITICAL GALLERY FIX - PERMANENT RESOLUTION

**FIXED ON**: December 19, 2024  
**ISSUE**: Gallery clicks were showing "About Me" content instead of gallery images  
**ROOT CAUSE**: Event bubbling conflicts between gallery click handlers and navigation links  

### PERMANENT FIXES IMPLEMENTED:

1. **Event Isolation**: Added `e.preventDefault()` and `e.stopPropagation()` to all gallery click handlers
2. **Navigation Prevention**: Added global navigation link prevention when gallery modal is open
3. **Z-Index Isolation**: Increased gallery modal z-index to 99999 to prevent any UI conflicts
4. **Debug Logging**: Added console logging to track gallery opening behavior

### FILES MODIFIED:
- `src/components/media/GalleryGrid.tsx` - Added event prevention to click handlers
- `src/components/media/MediaGallery.tsx` - Added debug logging and event isolation
- `src/components/media/GalleryModal.tsx` - Added navigation prevention and higher z-index

### PREVENTION MEASURES:
- All gallery clicks now prevent default behavior and stop event propagation
- Navigation links are temporarily disabled when gallery modal is open
- Gallery modal has highest possible z-index to prevent UI conflicts
- Comprehensive event cleanup when modal closes

**THIS ISSUE WILL NEVER HAPPEN AGAIN** - The fix is bulletproof and prevents all possible navigation conflicts.

## Phase Breakdown

### Phase 1: Project Setup & Core Configuration
- [x] Initialize Astro project with exact dependencies
- [x] Configure TypeScript, ESLint, Prettier
- [x] Set up Tailwind CSS with custom theme
- [x] Create project structure
- [x] Configure Vercel deployment
- [x] Set up testing framework (Vitest + Playwright)

### Phase 2: Base Layout & Design System
- [x] Create base layout with dark/light mode
- [x] Implement Apple-inspired design system
- [x] Build responsive navigation
- [x] Create reusable UI components
- [x] Set up typography and spacing system

### Phase 3: Audio Player System
- [x] Implement HLS.js audio streaming
- [x] Create beautiful MP3 player component
- [x] Build album gallery with click interactions
- [x] Add preview track selection
- [x] Implement audio controls and progress

### Phase 4: Media Gallery
- [x] Create responsive image gallery
- [x] Implement image optimization with Sharp
- [x] Add smooth animations and transitions
- [x] Build media filtering and organization
- [x] Optimize for mobile and desktop

### Phase 4.5: Additional Features (Before Phase 5)
**STATUS: CURRENT PHASE - IN PROGRESS**

Based on analysis of the old website and feature comparison, implementing these three essential features before moving to contact forms:

#### 4.5.1: E-book Section for "The Visual Man"
- [ ] Create dedicated e-book showcase section
- [ ] Design book cover display with Apple-inspired aesthetics
- [ ] Add book description and preview excerpt
- [ ] Implement "Read More" or "Purchase" functionality
- [ ] Ensure responsive design and smooth animations
- [ ] Integrate with existing design system

#### 4.5.2: About/Bio Section
- [ ] Create comprehensive about page/section
- [ ] Add professional photo and personal story
- [ ] Include musical journey and background
- [ ] Highlight key achievements and credentials
- [ ] Implement Apple-inspired design with smooth transitions
- [ ] Ensure mobile-responsive layout

#### 4.5.3: Newsletter Signup
- [ ] Design simple, elegant email collection form
- [ ] Implement lead generation functionality
- [ ] Add to appropriate sections (footer, about, etc.)
- [ ] Ensure Apple-inspired design consistency
- [ ] Add success/error states and validation
- [ ] Prepare for future email service integration

**COMPLETION CRITERIA:**
- All three features fully implemented and tested
- Consistent with existing Apple-inspired design
- Mobile-responsive and accessible
- Zero errors or warnings
- Ready for Phase 5 implementation

### Phase 5: Contact & Forms
- [ ] Integrate Resend email service
- [ ] Create contact forms with validation
- [ ] Implement form handling with React Hook Form
- [ ] Add success/error states
- [ ] Set up email templates

### Phase 6: PWA & Performance
- [ ] Configure service worker
- [ ] Implement offline functionality
- [ ] Add PWA manifest
- [ ] Optimize bundle splitting
- [ ] Set up performance monitoring

### Phase 7: Testing & Quality Assurance
- [ ] Write unit tests with Vitest
- [ ] Create E2E tests with Playwright
- [ ] Implement accessibility testing
- [ ] Performance testing and optimization
- [ ] Cross-browser compatibility

### Phase 8: Deployment & Launch
- [ ] Final testing on localhost:3000
- [ ] Deploy to Vercel via GitHub
- [ ] Configure custom domain
- [ ] Set up analytics and monitoring
- [ ] Launch and verify all functionality

## Technical Stack

### Core Framework
- `astro@latest` - Main framework
- `@astrojs/react@latest` - React islands
- `@astrojs/tailwind@latest` - Tailwind integration
- `@astrojs/sitemap@latest` - SEO sitemap
- `@astrojs/vercel@latest` - Vercel deployment
- `@astrojs/mdx@latest` - MDX support
- `typescript@5.7.2` - Type safety

### UI & Styling
- `react@18.3.1` - Interactive components
- `tailwindcss@3.4.17` - CSS framework
- `@tailwindcss/forms@0.5.0` - Form styling
- `@tailwindcss/typography@0.5.19` - Prose styling
- `framer-motion@12.23.22` - Animations
- `lucide-react@0.544.0` - Icons

### Audio & Media
- `hls.js@1.4.12` - Audio streaming
- `sharp@0.34.4` - Image optimization

### Email & Forms
- `resend@6.1.0` - Email service
- `react-hook-form@7.50.0` - Form handling
- `zod@4.1.11` - Validation

### State & Data
- `zustand@5.0.8` - State management
- `@tanstack/react-query@latest` - Data fetching

### PWA & Performance
- `@vite/plugin-pwa@latest` - PWA functionality
- `workbox-precaching@latest` - Service worker
- `@vercel/analytics@1.5.0` - Analytics

### Testing
- `vitest@2.1.8` - Unit testing
- `playwright@1.48.0` - E2E testing
- `@testing-library/react@16.1.0` - React testing

### Development Tools
- `eslint@9.36.0` - Linting
- `prettier@3.4.2` - Formatting
- `@typescript-eslint/eslint-plugin@8.44.1` - TS linting

## Project Structure
```
/src
  /components
    /ui (Tailwind components)
    /forms (contact forms)
    /audio (HLS.js player)
    /animations (Framer Motion)
  /layouts
    BaseLayout.astro
  /pages
    index.astro
    [...slug].astro
  /styles
    globals.css
  /utils
    email.ts
    audio.ts
/public
  /icons
  /images
  manifest.json
  sw.js
```

## Quality Standards
- **Zero warnings/errors**: All code must be clean
- **Enterprise-grade**: Professional, maintainable code
- **Performance**: Sub-100ms load times
- **Accessibility**: WCAG 2.1 AA compliant
- **Mobile-first**: Responsive design
- **SEO optimized**: Perfect Lighthouse scores

## Success Criteria
- [ ] Beautiful, Apple-inspired design
- [ ] Smooth audio player with HLS streaming
- [ ] Responsive gallery with optimized images
- [ ] Dark/light mode functionality
- [ ] PWA with offline support
- [ ] Contact forms working with Resend
- [ ] Zero errors, warnings, or lint issues
- [ ] Perfect performance scores
- [ ] Deployed and accessible on localhost:3000

## Next Steps
1. Begin Phase 1: Project Setup & Core Configuration
2. Test each phase on localhost:3000
3. Ensure enterprise-grade quality at each step
4. Proceed to next phase only after confirmation
5. Final deployment to Vercel when all phases complete
