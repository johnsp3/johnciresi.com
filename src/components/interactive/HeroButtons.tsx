import React from 'react';

interface HeroButtonsProps {
  className?: string;
}

const HeroButtons: React.FC<HeroButtonsProps> = ({ className = '' }) => {
  const handleListenToLatest = () => {
    if (window.openAudioPlayer) {
      window.openAudioPlayer();
    } else {
      // Log warning for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        import('@/utils/logger').then(({ logWarn }) => {
          logWarn('Audio player not available. Make sure WorkingAudioHandler is loaded.', { 
            component: 'HeroButtons',
            action: 'handleListenToLatest'
          });
        });
      }
    }
  };

  const handleViewDiscography = () => {
    const musicSection = document.getElementById('music');
    if (musicSection) {
      musicSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-8 sm:flex-row ${className}`}
    >
      <button
        onClick={handleListenToLatest}
        className="group relative whitespace-nowrap border border-gray-800 bg-black px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-white transition-all duration-500 hover:bg-gray-800"
        aria-label="Listen to latest album"
      >
        <span className="relative z-10">Listen to Latest</span>
        <div className="absolute inset-0 origin-center scale-0 bg-gradient-to-r from-gray-800/20 to-gray-600/10 transition-transform duration-500 group-hover:scale-100"></div>
      </button>
      <button
        onClick={handleViewDiscography}
        className="group relative whitespace-nowrap border border-gray-200 bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-black transition-all duration-500 hover:bg-gray-100"
        aria-label="View discography section"
      >
        <span className="relative z-10">View Discography</span>
        <div className="absolute inset-0 origin-center scale-0 bg-gradient-to-r from-gray-100/20 to-gray-200/10 transition-transform duration-500 group-hover:scale-100"></div>
      </button>
    </div>
  );
};

export default HeroButtons;
