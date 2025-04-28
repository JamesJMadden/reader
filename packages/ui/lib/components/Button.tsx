import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export function Button({
  className = '',
  variant = 'ghost',
  icon = null,
  loading = false,
  disabled,
  onClick,
  children,
}: ComponentPropsWithoutRef<'button'> & {
  variant?: 'ghost' | 'outline' | 'solid';
  icon?: React.ReactNode | null;
  loading?: boolean;
}) {
  return (
    <button
      className={`btn btn-${variant} ${icon && !children ? 'btn-icon' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}>
      {icon ? <span>{icon}</span> : null}
      {children}
    </button>
  );
}
