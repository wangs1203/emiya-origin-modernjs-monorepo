import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export interface IContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  full?: boolean;
  shadow?: boolean;
}

export default function Container({
  children,
  full = false,
  shadow = false,
  ...props
}: IContainerProps) {
  return (
    <div
      className={`tw-overflow-hidden tw-flex-auto tw-h-full tw-min-h-0${
        !full ? ' tw-p-5' : ''
      }`}
    >
      <div
        className={clsx(
          'tw-flex tw-flex-col tw-overflow-hidden tw-h-full tw-relative tw-bg-white tw-p-5',
          { 'tw-rounded-md tw-shadow-[0_0_6px_#a1a0a0]': !full && shadow },
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
