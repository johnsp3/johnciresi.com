import React from 'react';
import { X } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

interface AudioInfoProps {
  albumTitle: string;
  tracksCount: number;
  currentTrack: Track;
  onClose: () => void;
}

const AudioInfo: React.FC<AudioInfoProps> = ({
  albumTitle,
  tracksCount,
  currentTrack,
  onClose,
}) => {
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h2
            id="audio-modal-title"
            className="text-xl font-extralight tracking-wide text-white sm:text-2xl"
          >
            {albumTitle}
          </h2>
          <p
            id="audio-modal-description"
            className="text-xs font-light tracking-wide text-white/60 sm:text-sm"
          >
            {tracksCount} track{tracksCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-white/60 transition-colors duration-300 hover:bg-white/10 hover:text-white"
          aria-label="Close audio player"
        >
          <X size={24} />
        </button>
      </div>

      {/* Track Info */}
      <div className="mb-6 flex items-center space-x-4 sm:mb-8 sm:space-x-6">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-black sm:h-20 sm:w-20">
          {currentTrack.cover ? (
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <div className="text-2xl text-white/60">🎵</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-light tracking-wide text-white sm:text-lg">
            {currentTrack.title}
          </h3>
          <p className="truncate text-xs font-light tracking-wide text-white/60 sm:text-sm">
            {currentTrack.artist}
          </p>
        </div>
      </div>
    </>
  );
};

export default AudioInfo;
