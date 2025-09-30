export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

export interface Album {
  id: string;
  title: string;
  year: string;
  certification?: string;
  genre?: string;
  description: string;
  artworkCredit?: string;
  coverImage?: string;
  tracks: Track[];
}

export const albums: Album[] = [
  {
    id: 'fractured',
    title: 'Fractured',
    year: '2024',
    certification: 'Latest Release',
    genre: 'Hard Rock',
    description: 'Hard-hitting rock with raw energy and powerful vocals. This album captures the intensity and passion of modern rock music.',
    artworkCredit: 'Artwork by John Chezik',
    coverImage: '/images/albums/Fractured 2024 Album Cover.png',
    tracks: [
      {
        id: 'fractured-1',
        title: "Don't Say It's Over",
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: "/audio/Don't Say It's Over.mp3",
        cover: '/images/albums/Fractured 2024 Album Cover.png'
      },
      {
        id: 'fractured-2',
        title: 'Love Can Hurt So Bad',
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: '/audio/Love Can Hurt So Bad.mp3',
        cover: '/images/albums/Fractured 2024 Album Cover.png'
      }
    ]
  },
  {
    id: 'the-visual-man',
    title: 'The Visual Man',
    year: '2023',
    certification: 'Studio Album',
    genre: 'Hard Rock',
    description: 'A concept album where each song builds toward becoming the visual man.',
    artworkCredit: 'Artwork by John Chezik',
    coverImage: '/images/albums/The Visual Man Album Cover 2023.png',
    tracks: [
      {
        id: 'visual-man-1',
        title: "I'm The Visual Man",
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: "/audio/I'm The Visual Man.mp3",
        cover: '/images/albums/The Visual Man Album Cover 2023.png'
      },
      {
        id: 'visual-man-2',
        title: "Losing You",
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: "/audio/Losing You.mp3",
        cover: '/images/albums/The Visual Man Album Cover 2023.png'
      }
    ]
  },
  {
    id: 'the-revealing',
    title: 'The Revealing',
    year: '2022',
    certification: 'Studio Album',
    genre: 'Soft Rock',
    description: 'Love songs and ballads.',
    artworkCredit: 'Artwork by John Chezik',
    coverImage: '/images/albums/The Revealing Album Cover.png',
    tracks: [
      {
        id: 'revealing-1',
        title: 'Baby Please',
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: '/audio/Baby Please.mp3',
        cover: '/images/albums/The Revealing Album Cover.png'
      },
      {
        id: 'revealing-2',
        title: 'I Miss Your Touch',
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: '/audio/I Miss Your Touch.mp3',
        cover: '/images/albums/The Revealing Album Cover.png'
      }
    ]
  },
  {
    id: 'look-at-me',
    title: 'Look At Me',
    year: '2019',
    certification: 'Hard Rock/Instrumental',
    genre: 'Hard Rock Instrumental',
    description: 'A powerful, hard rock instrumental album.',
    artworkCredit: 'Artwork by John Chezik',
    coverImage: '/images/albums/Look At Me Album Cover.png',
    tracks: [
      {
        id: 'look-at-me-1',
        title: 'Look At Me',
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: '/audio/Look At Me.mp3',
        cover: '/images/albums/Look At Me Album Cover.png'
      },
      {
        id: 'look-at-me-2',
        title: 'Secret Of My Heart',
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: '/audio/Secret Of My Heart.mp3',
        cover: '/images/albums/Look At Me Album Cover.png'
      }
    ]
  },
  {
    id: 'frameworks',
    title: 'FrameWorks',
    year: '2010',
    certification: 'Rock',
    genre: 'Hard Rock',
    description: 'Recordings from 2010 - a return to making music.',
    artworkCredit: 'Artwork by John Chezik',
    coverImage: '/images/albums/FrameWorks.png',
    tracks: [
      {
        id: 'frameworks-1',
        title: 'What You Mean to Me',
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: '/audio/What You Mean to Me.mp3',
        cover: '/images/albums/FrameWorks.png'
      },
      {
        id: 'frameworks-2',
        title: 'My Life',
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: '/audio/My Life.mp3',
        cover: '/images/albums/FrameWorks.png'
      },
      {
        id: 'frameworks-3',
        title: 'The One I Want',
        artist: 'John Chezik',
        duration: 180, // 3 minutes
        url: '/audio/The One I Want.mp3',
        cover: '/images/albums/FrameWorks.png'
      }
    ]
  }
];
