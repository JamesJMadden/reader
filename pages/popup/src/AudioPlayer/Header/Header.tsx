import React from 'react';
import { Button } from '@extension/ui';
import { ArrowUturnLeftIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import './Header.css';

/**
 * @namespace AudioPlayer
 * @name Header
 * @param title
 * @param description
 * @param onClickBack
 * @param onClickMenu
 * @constructor
 */
const Header = ({
  title,
  description,
  onClickBack,
  onClickMenu,
}: {
  title: string;
  description: string;
  onClickBack(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickMenu(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}) => (
  <div className="audio-player-navigation">
    <Button onClick={onClickBack} icon={<ArrowUturnLeftIcon className="size-6" />} />

    <div className="audio-player-track-info">
      <p>{title}</p>
      <small>{description}</small>
    </div>

    <Button onClick={onClickMenu} icon={<ListBulletIcon className="size-8" />} />
  </div>
);

export default Header;
