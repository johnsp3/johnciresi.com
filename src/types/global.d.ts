// Global type declarations for the musician website

declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server';
  const Component: AstroComponentFactory;
  export default Component;
}

declare module '*.astro?astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server';
  const Component: AstroComponentFactory;
  export default Component;
}

declare global {
  interface Window {
    openAudioPlayer?: (albumId?: string) => void;
  }
}

export {};
