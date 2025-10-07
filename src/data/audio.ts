// Import validation schemas for type safety
import type { Track, Album } from '../utils/validation';

export const albums: Album[] = [
  {
    id: 'fractured',
    title: 'Fractured',
    year: '2024',
    certification: 'Latest Release',
    genre: 'Hard Rock',
    description:
      'Hard-hitting rock with raw energy and powerful vocals. This album captures the intensity and passion of modern rock music.',
    artworkCredit: 'Artwork by John Ciresi',
    coverImage: '/images/albums/fractured-2024.png',
    fullCoverImage: '/images/albums/fractured-2024.png', // Same image for now, can be replaced with high-res version
    tracks: [
      {
        id: 'fractured-1',
        title: "Don't Say It's Over",
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: "/audio/dont-say-its-over.mp3",
        cover: '/images/albums/fractured-2024.png',
      },
      {
        id: 'fractured-2',
        title: 'Love Can Hurt So Bad',
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: '/audio/love-can-hurt-so-bad.mp3',
        cover: '/images/albums/fractured-2024.png',
      },
    ],
  },
  {
    id: 'the-visual-man',
    title: 'The Visual Man',
    year: '2023',
    certification: 'Studio Album',
    genre: 'Hard Rock',
    description:
      'A concept album where each song builds toward becoming the visual man.',
    artworkCredit: 'Artwork by John Ciresi',
    coverImage: '/images/albums/the-visual-man-2023.png',
    fullCoverImage: '/images/albums/the-visual-man-2023.png',
    tracks: [
      {
        id: 'visual-man-1',
        title: "I'm The Visual Man",
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: "/audio/im-the-visual-man.mp3",
        cover: '/images/albums/the-visual-man-2023.png',
      },
      {
        id: 'visual-man-2',
        title: 'Losing You',
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: '/audio/losing-you.mp3',
        cover: '/images/albums/the-visual-man-2023.png',
      },
    ],
  },
  {
    id: 'the-revealing',
    title: 'The Revealing',
    year: '2022',
    certification: 'Studio Album',
    genre: 'Soft Rock',
    description: 'Love songs and ballads.',
    artworkCredit: 'Artwork by John Ciresi',
    coverImage: '/images/albums/the-revealing-2022.png',
    fullCoverImage: '/images/albums/the-revealing-2022.png',
    tracks: [
      {
        id: 'revealing-1',
        title: 'Baby Please',
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: '/audio/baby-please.mp3',
        cover: '/images/albums/the-revealing-2022.png',
      },
      {
        id: 'revealing-2',
        title: 'I Miss Your Touch',
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: '/audio/i-miss-your-touch.mp3',
        cover: '/images/albums/the-revealing-2022.png',
      },
    ],
  },
  {
    id: 'look-at-me',
    title: 'Look At Me',
    year: '2019',
    certification: 'Hard Rock/Instrumental',
    genre: 'Hard Rock Instrumental',
    description: 'A powerful, hard rock instrumental album.',
    artworkCredit: 'Artwork by John Ciresi',
    coverImage: '/images/albums/look-at-me-2019.png',
    fullCoverImage: '/images/albums/look-at-me-2019.png',
    tracks: [
      {
        id: 'look-at-me-1',
        title: 'Look At Me',
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: '/audio/look-at-me.mp3',
        cover: '/images/albums/look-at-me-2019.png',
      },
      {
        id: 'look-at-me-2',
        title: 'Secret Of My Heart',
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: '/audio/secret-of-my-heart.mp3',
        cover: '/images/albums/look-at-me-2019.png',
      },
    ],
  },
  {
    id: 'frameworks',
    title: 'FrameWorks',
    year: '2010',
    certification: 'Rock',
    genre: 'Hard Rock',
    description: 'Recordings from 2010 - a return to making music.',
    artworkCredit: 'Artwork by John Ciresi',
    coverImage: '/images/albums/frameworks-2010.png',
    fullCoverImage: '/images/albums/frameworks-2010.png',
    tracks: [
      {
        id: 'frameworks-1',
        title: 'What You Mean to Me',
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: '/audio/what-you-mean-to-me.mp3',
        cover: '/images/albums/frameworks-2010.png',
      },
      {
        id: 'frameworks-2',
        title: 'My Life',
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: '/audio/my-life.mp3',
        cover: '/images/albums/frameworks-2010.png',
      },
      {
        id: 'frameworks-3',
        title: 'The One I Want',
        artist: 'John Ciresi',
        duration: 180, // 3 minutes
        url: '/audio/the-one-i-want.mp3',
        cover: '/images/albums/frameworks-2010.png',
      },
    ],
  },
];
