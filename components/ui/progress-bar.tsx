'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  gradientFrom?: string;
  gradientTo?: string;
  animate?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  gradientFrom = 'from-violet-600',
  gradientTo = 'to-purple-500',
  animate = true,
  className,
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const [mounted, setMounted] = useState(false);
  const percentage = Math.min((value / max) * 100, 100);

  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const width = useTransform(spring, (v: number) => `${v}%`);
  const displayPct = useTransform(spring, (v: number) => `${Math.round(v)}%`);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (animate && isInView) {
      spring.set(percentage);
    } else if (!animate) {
      spring.set(percentage);
    }
  }, [mounted, isInView, animate, percentage, spring]);

  return (
    <div ref={ref} className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-zinc-300">{label}</span>}
          {showPercentage && mounted && (
            <motion.span className="text-sm font-medium text-zinc-400 tabular-nums">
              {displayPct}
            </motion.span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-white/[0.06] overflow-hidden', sizeStyles[size])}>
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', gradientFrom, gradientTo)}
          style={{ width }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
