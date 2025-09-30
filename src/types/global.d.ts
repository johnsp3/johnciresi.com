// Global type declarations for the musician website

declare global {
  interface Window {
    openAudioPlayer?: (albumId?: string) => void;
  }
}

export {};
