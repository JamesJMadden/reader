import React from 'react';
import './Track.css';

/**
 *
 * @param audio
 * @constructor
 */
const Track = ({ audio }: { audio: HTMLAudioElement | undefined }) => {
  return (
    <div className="audio-player-track-container">
      <input
        type="range"
        name="range"
        id="range"
        defaultValue={audio ? audio.currentTime : 0}
        min="0"
        max="1000"
        onInput={e => {
          const range = e.target as HTMLInputElement;
          const min = Number(range.min);
          const max = Number(range.max);
          const currentVal = Number(range.value);

          range.style.backgroundSize = ((currentVal - min) / (max - min)) * 100 + '% 100%';
        }}
      />

      <div className="audio-player-track-meta">
        <div className="audio-player-track-meta-time">{audio?.currentTime || '0:00'}</div>
        <div className="audio-player-track-meta-time">{audio?.duration || '0:00'}</div>
      </div>
    </div>
  );
};

export default Track;
