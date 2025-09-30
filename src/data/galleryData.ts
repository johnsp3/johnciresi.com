// Types
export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

export interface GalleryCategory {
  id: string;
  title: string;
  description: string;
  items: MediaItem[];
  gradient: string;
  placeholder: string;
}

// Gallery data - enterprise-grade structure with custom placeholders and real photos
export const galleryCategories: GalleryCategory[] = [
  {
    id: 'home-studio',
    title: 'Home Studio',
    description: 'Personal creative space and intimate recording environment',
    gradient: 'from-black via-gray-900 to-gray-800',
    placeholder: '/images/gallery/home-studio/studio-placeholder-1.png',
    items: [
      {
        id: 'home-1',
        src: '/images/gallery/home-studio/studio-1.png',
        alt: 'Home studio setup and equipment',
        title: 'Studio Setup',
        description: 'Professional recording equipment and creative workspace'
      },
      {
        id: 'home-2',
        src: '/images/gallery/home-studio/studio-2.png',
        alt: 'Recording environment',
        title: 'Recording Environment',
        description: 'Intimate space where musical magic happens'
      },
      {
        id: 'home-3',
        src: '/images/gallery/home-studio/studio-3.png',
        alt: 'Studio equipment and instruments',
        title: 'Studio Equipment',
        description: 'Professional instruments and recording gear'
      },
      {
        id: 'home-4',
        src: '/images/gallery/home-studio/studio-4.png',
        alt: 'Creative workspace',
        title: 'Creative Workspace',
        description: 'Personal creative environment for music production'
      },
      {
        id: 'home-5',
        src: '/images/gallery/home-studio/studio-5.png',
        alt: 'Recording setup',
        title: 'Recording Setup',
        description: 'Professional recording configuration'
      },
      {
        id: 'home-6',
        src: '/images/gallery/home-studio/studio-6.png',
        alt: 'Studio instruments',
        title: 'Studio Instruments',
        description: 'Collection of musical instruments and equipment'
      },
      {
        id: 'home-7',
        src: '/images/gallery/home-studio/studio-7.png',
        alt: 'Home studio environment',
        title: 'Studio Environment',
        description: 'Personal recording space and creative atmosphere'
      },
      {
        id: 'home-8',
        src: '/images/gallery/home-studio/studio-8.png',
        alt: 'Recording equipment',
        title: 'Recording Equipment',
        description: 'Professional audio equipment and setup'
      },
      {
        id: 'home-9',
        src: '/images/gallery/home-studio/studio-9.png',
        alt: 'Studio workspace',
        title: 'Studio Workspace',
        description: 'Creative workspace for music production'
      }
    ]
  },
  {
    id: 'behind-scenes',
    title: 'Behind The Scenes',
    description: 'Intimate moments of the creative process',
    gradient: 'from-gray-800 via-gray-900 to-black',
    placeholder: '/images/gallery/behind-the-scenes/studio-placeholder -1.png',
    items: [
      {
        id: 'behind-1',
        src: '/images/gallery/behind-the-scenes/John-1.png',
        alt: 'John Chezik in the studio',
        title: 'In The Studio',
        description: 'Behind the scenes moments of the creative process'
      },
      {
        id: 'behind-2',
        src: '/images/gallery/behind-the-scenes/John-2.jpg',
        alt: 'Creative process and artistic journey',
        title: 'Creative Process',
        description: 'Intimate moments of artistic creation and inspiration'
      },
      {
        id: 'behind-3',
        src: '/images/gallery/behind-the-scenes/John-3.png',
        alt: 'Studio session moments',
        title: 'Studio Session',
        description: 'Behind the scenes of recording and production'
      },
      {
        id: 'behind-4',
        src: '/images/gallery/behind-the-scenes/John-4.png',
        alt: 'Musical creativity in action',
        title: 'Musical Creativity',
        description: 'Moments of inspiration and musical creation'
      },
      {
        id: 'behind-5',
        src: '/images/gallery/behind-the-scenes/John-5.png',
        alt: 'Artist at work',
        title: 'Artist At Work',
        description: 'Behind the scenes of the musical creative process'
      },
      {
        id: 'behind-6',
        src: '/images/gallery/behind-the-scenes/John-6.png',
        alt: 'Studio moments',
        title: 'Studio Moments',
        description: 'Intimate behind the scenes moments'
      },
      {
        id: 'behind-7',
        src: '/images/gallery/behind-the-scenes/John-7.png',
        alt: 'Creative journey',
        title: 'Creative Journey',
        description: 'Behind the scenes of the artistic process'
      }
    ]
  },
  {
    id: 'the-archives',
    title: 'The Archives',
    description: 'Professional recording environment and equipment',
    gradient: 'from-gray-900 via-black to-gray-800',
    placeholder: '/images/gallery/the archives/studio-placeholder-3.png',
    items: [
      {
        id: 'archives-1',
        src: '/images/gallery/the archives/archives-1.png',
        alt: 'Musical archives and history',
        title: 'Musical Archives',
        description: 'A collection of memories, milestones, and musical history'
      },
      {
        id: 'archives-2',
        src: '/images/gallery/the archives/archives-2.png',
        alt: 'Historical musical moments',
        title: 'Historical Moments',
        description: 'Preserved memories from the musical journey'
      },
      {
        id: 'archives-3',
        src: '/images/gallery/the archives/archives-3.png',
        alt: 'Archive collection',
        title: 'Archive Collection',
        description: 'Curated collection of musical memories and milestones'
      },
      {
        id: 'archives-4',
        src: '/images/gallery/the archives/archives-4.png',
        alt: 'Musical history',
        title: 'Musical History',
        description: 'Documented history of musical achievements'
      },
      {
        id: 'archives-5',
        src: '/images/gallery/the archives/archives-5.png',
        alt: 'Archive memories',
        title: 'Archive Memories',
        description: 'Preserved moments from the musical journey'
      },
      {
        id: 'archives-6',
        src: '/images/gallery/the archives/archives-6.png',
        alt: 'Historical collection',
        title: 'Historical Collection',
        description: 'Collection of historical musical moments'
      },
      {
        id: 'archives-7',
        src: '/images/gallery/the archives/archives-7.png',
        alt: 'Musical milestones',
        title: 'Musical Milestones',
        description: 'Documented milestones in the musical career'
      },
      {
        id: 'archives-8',
        src: '/images/gallery/the archives/archives-8.png',
        alt: 'Archive treasures',
        title: 'Archive Treasures',
        description: 'Treasures from the musical archives and history'
      }
    ]
  }
];
