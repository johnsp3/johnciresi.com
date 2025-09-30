import React from 'react';

interface HeroButtonsProps {
  className?: string;
}

const HeroButtons: React.FC<HeroButtonsProps> = ({ className = '' }) => {
  const handleListenToLatest = () => {
    if (window.openAudioPlayer) {
      window.openAudioPlayer();
    } else {
      console.warn('Audio player not available. Make sure WorkingAudioHandler is loaded.');
    }
  };

  const handleViewDiscography = () => {
    const musicSection = document.getElementById('music');
    if (musicSection) {
      musicSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center ${className}`}>
      <button 
        onClick={handleListenToLatest}
        className="px-8 py-4 bg-black text-white font-medium tracking-[0.1em] uppercase text-sm hover:bg-gray-800 transition-all duration-500 border border-gray-800 relative group whitespace-nowrap"
        aria-label="Listen to latest album"
      >
        <span className="relative z-10">Listen to Latest</span>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-600/10 scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></div>
      </button>
      <button 
        onClick={handleViewDiscography}
        className="px-8 py-4 bg-white text-black font-medium tracking-[0.1em] uppercase text-sm hover:bg-gray-100 transition-all duration-500 border border-gray-200 relative group whitespace-nowrap"
        aria-label="View discography section"
      >
        <span className="relative z-10">View Discography</span>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100/20 to-gray-200/10 scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></div>
      </button>
    </div>
  );
};

export default HeroButtons;
