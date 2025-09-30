import sharp from 'sharp';

// Create beautiful gradient placeholder images for the gallery
export async function createPlaceholderImages(): Promise<void> {
  const placeholders = [
    {
      name: 'studio-session-1.jpg',
      gradient: { from: '#1f2937', to: '#111827' },
      title: 'Studio Sessions',
      description: 'Behind the scenes of the creative process'
    },
    {
      name: 'live-performance-1.jpg',
      gradient: { from: '#374151', to: '#1f2937' },
      title: 'Live Performances',
      description: 'Capturing the energy of live shows'
    },
    {
      name: 'award-ceremony-1.jpg',
      gradient: { from: '#111827', to: '#000000' },
      title: 'Award Ceremonies',
      description: 'Recognition and celebration of excellence'
    },
    {
      name: 'behind-scenes-1.jpg',
      gradient: { from: '#4b5563', to: '#374151' },
      title: 'Behind the Scenes',
      description: 'Intimate moments of the creative journey'
    },
    {
      name: 'studio-session-2.jpg',
      gradient: { from: '#6b7280', to: '#4b5563' },
      title: 'Studio Setup',
      description: 'Professional recording environment'
    },
    {
      name: 'live-performance-2.jpg',
      gradient: { from: '#9ca3af', to: '#6b7280' },
      title: 'Crowd Energy',
      description: 'Connecting with the audience'
    }
  ];

  for (const placeholder of placeholders) {
    try {
      // Create a beautiful gradient image
      await sharp({
        create: {
          width: 800,
          height: 600,
          channels: 3,
          background: { r: 0, g: 0, b: 0 }
        }
      })
      .composite([
        {
          input: Buffer.from(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:${placeholder.gradient.from};stop-opacity:1" />
                  <stop offset="100%" style="stop-color:${placeholder.gradient.to};stop-opacity:1" />
                </linearGradient>
              </defs>
              <rect width="800" height="600" fill="url(#grad)" />
              <circle cx="400" cy="300" r="100" fill="rgba(255,255,255,0.1)" />
              <circle cx="400" cy="300" r="50" fill="rgba(255,255,255,0.05)" />
            </svg>
          `),
          top: 0,
          left: 0
        }
      ])
      .jpeg({ quality: 90 })
      .toFile(`./public/images/gallery/${placeholder.name}`);
      
      // eslint-disable-next-line no-console
      console.log(`Created placeholder: ${placeholder.name}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error creating ${placeholder.name}:`, error);
    }
  }
}

// Run the function if this file is executed directly
if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  createPlaceholderImages().catch((error) => {
    console.error('Error creating placeholder images:', error);
  });
}
