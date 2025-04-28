import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { useStorage } from '@extension/shared';
import { translationStorage } from '@extension/storage';
import './Reader.css';

/**
 * @description The main Popup Component
 * @param props
 * @constructor
 */
const Reader = (
  props: ComponentPropsWithoutRef<'main'> & {
    playing?: boolean;
  },
) => {
  const storage = useStorage(translationStorage);

  console.log('%c TEST: Reader', 'background-color:black;color:magenta;padding:8px', storage, props);

  return <main>{props.children}</main>;
};

export default Reader;
