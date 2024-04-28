import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import './container.less';

export interface IContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  full?: boolean;
  shadow?: boolean;
}

export default function Container({
  children,
  full = false,
  shadow = false,
  className,
  ...props
}: IContainerProps) {
  return (
    <div className={clsx('emiya-container', className, { full })}>
      <div
        className={clsx('emiya-container__content', {
          'tw-rounded-md tw-shadow-[0_0_6px_#a1a0a0]': !full && shadow,
        })}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
