'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedCounterProps {
  value: number;
  format?: 'number' | 'currency' | 'percentage' | 'decimal';
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  triggerOnView?: boolean;
}

export function AnimatedCounter({
  value,
  format = 'number',
  prefix = '',
  suffix = '',
  duration = 1.5,
  decimals = 0,
  className,
  triggerOnView = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [mounted, setMounted] = useState(false);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current: number) => {
    const val = Math.max(0, current);
    switch (format) {
      case 'currency':
        return `${prefix}$${val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
      case 'percentage':
        return `${prefix}${val.toFixed(decimals)}%${suffix}`;
      case 'decimal':
        return `${prefix}${val.toFixed(decimals)}${suffix}`;
      default:
        return `${prefix}${Math.round(val).toLocaleString('en-US')}${suffix}`;
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (triggerOnView && isInView) {
      spring.set(value);
    } else if (!triggerOnView) {
      spring.set(value);
    }
  }, [mounted, isInView, triggerOnView, value, spring]);

  if (!mounted) {
    return <span ref={ref} className={cn('tabular-nums', className)}>0</span>;
  }

  return (
    <motion.span ref={ref} className={cn('tabular-nums', className)}>
      {display}
    </motion.span>
  );
}

export default AnimatedCounter;
