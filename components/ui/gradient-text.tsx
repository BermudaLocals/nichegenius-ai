'use client';

import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}

export function GradientText({
  children,
  from = 'from-violet-400',
  via,
  to = 'to-purple-400',
  animate = false,
  as: Component = 'span',
  className,
  ...props
}: GradientTextProps) {
  return (
    <Component
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        from,
        via,
        to,
        animate && 'animate-gradient bg-[length:200%_auto]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default GradientText;
