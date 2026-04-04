'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export function ScoreRing({
  score,
  maxScore = 100,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  gradientFrom = '#8b5cf6',
  gradientTo = '#a855f7',
  className,
  animate = true,
  delay = 0,
}: ScoreRingProps) {
  const [mounted, setMounted] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / maxScore, 1);
  const gradientId = `score-ring-${Math.random().toString(36).slice(2, 9)}`;

  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const strokeDashoffset = useTransform(spring, (v: number) => circumference - v * circumference);
  const displayValue = useTransform(spring, (v: number) => Math.round(v * maxScore));

  useEffect(() => {
    setMounted(true);
    if (animate) {
      const timer = setTimeout(() => spring.set(percentage), delay * 1000);
      return () => clearTimeout(timer);
    } else {
      spring.set(percentage);
    }
  }, [animate, percentage, spring, delay]);

  if (!mounted) return <div style={{ width: size, height: size }} />;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-2xl font-bold text-white tabular-nums">
          {displayValue}
        </motion.span>
        {label && <span className="text-[10px] font-medium text-zinc-400 mt-0.5">{label}</span>}
      </div>
      {sublabel && <span className="text-xs text-zinc-500 mt-2">{sublabel}</span>}
    </div>
  );
}

export default ScoreRing;
