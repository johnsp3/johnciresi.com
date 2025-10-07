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

// Gallery data - clean and simple with only the 3 categories that exist
export const galleryCategories: GalleryCategory[] = [
  {
    id: 'home-studio',
    title: 'Home Studio',
    description: 'Personal creative space and intimate recording environment',
    gradient: 'from-black via-gray-900 to-gray-800',
    placeholder: '/images/gallery/home-studio/home-studio-placeholder.png',
    items: [
      {
        id: 'home-1',
        src: '/images/gallery/home-studio/home-studio-01.png',
        alt: 'Home studio setup and equipment',
        title: 'Studio Setup',
        description: 'Control room is finally done. After months of planning and building, this is where all the work comes together.',
      },
      {
        id: 'home-2',
        src: '/images/gallery/home-studio/home-studio-02.png',
        alt: 'Recording environment',
        title: 'Recording Environment',
        description: 'The sweet spot. Everything\'s dialed in and ready to make some records.',
      },
      {
        id: 'home-3',
        src: '/images/gallery/home-studio/home-studio-03.png',
        alt: 'Studio equipment and instruments',
        title: 'Studio Equipment',
        description: 'Another look at the control room setup. Still can\'t believe we actually pulled this off.',
      },
    ],
  },
  {
    id: 'behind-scenes',
    title: 'Behind The Scenes',
    description: 'Intimate moments of the creative process',
    gradient: 'from-gray-800 via-gray-900 to-black',
    placeholder: '/images/gallery/behind-the-scenes/behind-scenes-placeholder.png',
    items: [
      {
        id: 'behind-4',
        src: '/images/gallery/behind-the-scenes/behind-scenes-build-04.png',
        alt: 'Musical creativity in action',
        title: 'Musical Creativity',
        description: 'Control room taking shape. Ceiling treatment going in, and you can start to see what this space is going to become.',
      },
      {
        id: 'behind-5',
        src: '/images/gallery/behind-the-scenes/behind-scenes-build-05.png',
        alt: 'Artist at work',
        title: 'Artist At Work',
        description: 'Live room floor is down, and we\'re framing out the vocal booth. Starting to feel real now.',
      },
      {
        id: 'behind-6',
        src: '/images/gallery/behind-the-scenes/behind-scenes-build-06.png',
        alt: 'Studio moments',
        title: 'Studio Moments',
        description: 'Vocal booth is coming together. Got the walls up and starting to test mic placements.',
      },
      {
        id: 'behind-7',
        src: '/images/gallery/behind-the-scenes/behind-scenes-build-07.png',
        alt: 'Creative journey',
        title: 'Creative Journey',
        description: 'Looking into the live room from the control room window. Acoustic panels are up, just waiting on the floor.',
      },
      {
        id: 'behind-8',
        src: '/images/gallery/behind-the-scenes/behind-scenes-build-08.png',
        alt: 'Studio construction',
        title: 'Studio Construction',
        description: 'View into the vocal booth during early construction. Just bare bones at this point.',
      },
      {
        id: 'behind-9',
        src: '/images/gallery/behind-the-scenes/behind-scenes-build-09.png',
        alt: 'Finished studio',
        title: 'Finished Studio',
        description: 'And here\'s the finished vocal booth, all set up and ready to track drums. Worth every bit of the journey.',
      },
    ],
  },
  {
    id: 'the-archives',
    title: 'The Archives',
    description: 'Professional recording environment and equipment',
    gradient: 'from-gray-900 via-black to-gray-800',
    placeholder: '/images/gallery/the-archives/archives-placeholder.png',
    items: [
      {
        id: 'archives-1',
        src: '/images/gallery/the-archives/archives-01.png',
        alt: 'Musical archives and history',
        title: 'Musical Archives',
        description: 'Tracking some guitar parts. There\'s something about sitting in a great sounding room that just makes you play differently.',
      },
      {
        id: 'archives-2',
        src: '/images/gallery/the-archives/archives-02.png',
        alt: 'Historical musical moments',
        title: 'Historical Moments',
        description: 'Behind the board at one of my favorite studios. This is where I learned to really listen.',
      },
      {
        id: 'archives-3',
        src: '/images/gallery/the-archives/archives-03.png',
        alt: 'Archive collection',
        title: 'Archive Collection',
        description: 'Spent a lot of time in this room. Those were good days making records and figuring things out.',
      },
      {
        id: 'archives-4',
        src: '/images/gallery/the-archives/archives-04.png',
        alt: 'Musical history',
        title: 'Musical History',
        description: 'Working out of the home studio. Not fancy, but you\'d be surprised what you can do with the right gear and some acoustic treatment.',
      },
      {
        id: 'archives-5',
        src: '/images/gallery/the-archives/archives-05.png',
        alt: 'Archive memories',
        title: 'Archive Memories',
        description: 'Garage studio days. Hot in the summer, cold in the winter, but got some great tones in this little space.',
      },
      {
        id: 'archives-6',
        src: '/images/gallery/the-archives/archives-06.png',
        alt: 'Historical collection',
        title: 'Historical Collection',
        description: 'Before I had a proper studio, I was recording demos in the kitchen. You work with what you\'ve got.',
      },
    ],
  },
];
