'use client';

import { type ReactNode, type HTMLAttributes } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// ---- Types ----

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'gradient-border';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  animate?: boolean;
  delay?: number;
  children: ReactNode;
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ---- Variant Styles ----

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] shadow-xl shadow-black/20',
  elevated:
    'bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/30',
  outlined:
    'bg-transparent border border-white/10 hover:border-white/20',
  'gradient-border':
    'bg-white/[0.03] backdrop-blur-xl shadow-xl shadow-black/20 border-0 relative before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px] before:bg-gradient-to-br before:from-violet-500/30 before:via-purple-500/20 before:to-transparent before:-z-10 before:content-[\'\'] before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude]',
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ---- Card Component ----

export function Card({
  variant = 'default',
  hover = true,
  animate = false,
  delay = 0,
  children,
  className,
  ...props
}: CardProps) {
  const Component = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        variants: fadeInUp,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-50px' },
        custom: delay,
      }
    : {};
  const hoverProps = animate && hover
    ? {
        whileHover: { y: -4, transition: { duration: 0.2 } },
      }
    : {};

  return (
    <Component
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300',
        variantStyles[variant],
        hover && !animate && 'hover:-translate-y-1 hover:shadow-2xl',
        className,
      )}
      {...motionProps}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
}

// ---- Card Header ----

export function CardHeader({ children, className, ...props }: CardSectionProps) {
  return (
    <div
      className={cn(
        'px-6 pt-6 pb-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ---- Card Body ----

export function CardBody({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

// ---- Card Footer ----

export function CardFooter({ children, className, ...props }: CardSectionProps) {
  return (
    <div
      className={cn(
        'px-6 pb-6 pt-2 border-t border-white/5 mt-auto',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ---- Glass Card ----

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: 'violet' | 'purple' | 'blue' | 'emerald' | 'none';
  intensity?: 'light' | 'medium' | 'strong';
  animate?: boolean;
  delay?: number;
}

const glowColors = {
  violet: 'shadow-violet-500/10 hover:shadow-violet-500/20',
  purple: 'shadow-purple-500/10 hover:shadow-purple-500/20',
  blue: 'shadow-blue-500/10 hover:shadow-blue-500/20',
  emerald: 'shadow-emerald-500/10 hover:shadow-emerald-500/20',
  none: '',
};

const intensityStyles = {
  light: 'bg-white/[0.02] border-white/[0.05]',
  medium: 'bg-white/[0.04] border-white/[0.08]',
  strong: 'bg-white/[0.07] border-white/[0.12]',
};

export function GlassCard({
  children,
  glow = 'violet',
  intensity = 'medium',
  animate = false,
  delay = 0,
  className,
  ...props
}: GlassCardProps) {
  const Component = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        variants: fadeInUp,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-50px' },
        custom: delay,
        whileHover: { y: -4, transition: { duration: 0.2 } },
      }
    : {};

  return (
    <Component
      className={cn(
        'rounded-2xl backdrop-blur-xl border shadow-2xl',
        'transition-all duration-300 hover:-translate-y-1',
        intensityStyles[intensity],
        glowColors[glow],
        className,
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
