import React from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackSelect: (index: number) => void;
  formatTime: (time: number) => string;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackIndex,
  onTrackSelect,
  formatTime,
}) => {
  if (tracks.length <= 1) return null;

  return (
    <div className="border-t border-white/10 pt-6">
      <h4 className="mb-4 text-sm font-light uppercase tracking-wide text-white/80">
        Track List
      </h4>
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => onTrackSelect(index)}
            className={`w-full rounded-lg p-3 text-left transition-all duration-300 ${
              index === currentTrackIndex
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light tracking-wide">
                  {track.title}
                </p>
                <p className="text-xs text-white/50">{track.artist}</p>
              </div>
              <span className="text-xs text-white/50">
                {formatTime(track.duration)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
