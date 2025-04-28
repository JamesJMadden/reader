import React, { useState } from 'react';
import { BackwardIcon, ForwardIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Button } from '@extension/ui';
import './Controls.css';

/**
 *
 * @param props
 * @constructor
 */
const Controls = (props: { playing?: boolean }) => {
  const [playing, setPlaying] = useState(props.playing);

  return (
    <div className="audio-player-controls">
      {/* Go back to beginning, double click will select previous translation if there is one */}
      <Button onClick={() => {}} icon={<BackwardIcon className="size-6" />} />

      {/* Toggle playing state of audio */}
      <Button
        onClick={() => setPlaying(prevState => !prevState)}
        icon={playing ? <PauseIcon className="size-6" /> : <PlayIcon className="size-6" />}
      />

      {/* Go to the next translation if there is one */}
      <Button onClick={() => {}} icon={<ForwardIcon className="size-6" />} disabled={true} />
    </div>
  );
};

export default Controls;
