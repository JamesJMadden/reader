import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { useStorage } from '@extension/shared';
import { translationStorage } from '@extension/storage';
import './AudioPlayer.css';

/**
 * @description The main Popup Component
 * @param props
 * @constructor
 */
const AudioPlayer = (
  props: ComponentPropsWithoutRef<'main'> & {
    playing?: boolean;
  },
) => {
  const storage = useStorage(translationStorage);

  console.log('%c TEST: AudioPlayer', 'background-color:black;color:orange;padding:8px', storage, props);

  return <main>{props.children}</main>;
};

export default AudioPlayer;
