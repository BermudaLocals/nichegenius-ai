'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ---- Types ----

export type InputVariant = 'default' | 'filled' | 'ghost';

interface BaseInputProps {
  variant?: InputVariant;
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export interface InputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: 'sm' | 'md' | 'lg';
}

export interface TextareaProps extends BaseInputProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export interface SelectProps extends BaseInputProps, SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

// ---- Styles ----

const variantStyles: Record<InputVariant, string> = {
  default:
    'bg-white/[0.03] border border-white/10 focus-within:border-violet-500/50 focus-within:bg-white/[0.05]',
  filled:
    'bg-white/[0.06] border border-transparent focus-within:border-violet-500/50 focus-within:bg-white/[0.08]',
  ghost:
    'bg-transparent border border-transparent focus-within:border-white/10 focus-within:bg-white/[0.03]',
};

const sizeStyles = {
  sm: 'h-9 text-sm px-3',
  md: 'h-11 text-sm px-4',
  lg: 'h-13 text-base px-5',
};

// ---- Input Component ----

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', inputSize = 'md', label, error, helperText, iconLeft, iconRight, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
            {label}
            {props.required && <span className="text-violet-400 ml-1">*</span>}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center rounded-xl transition-all duration-200',
            'ring-0 focus-within:ring-2 focus-within:ring-violet-500/20',
            variantStyles[variant],
            error && 'border-red-500/50 focus-within:border-red-500/50 focus-within:ring-red-500/20',
          )}
        >
          {iconLeft && (
            <span className="pl-3 flex-shrink-0 text-zinc-500">{iconLeft}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-transparent text-white placeholder:text-zinc-500 outline-none',
              sizeStyles[inputSize],
              iconLeft && 'pl-2',
              iconRight && 'pr-2',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <span className="pr-3 flex-shrink-0 text-zinc-500">{iconRight}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-zinc-500 mt-1">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

// ---- Textarea Component ----

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = 'default', label, error, helperText, rows = 4, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
            {label}
            {props.required && <span className="text-violet-400 ml-1">*</span>}
          </label>
        )}
        <div
          className={cn(
            'rounded-xl transition-all duration-200',
            'ring-0 focus-within:ring-2 focus-within:ring-violet-500/20',
            variantStyles[variant],
            error && 'border-red-500/50 focus-within:border-red-500/50 focus-within:ring-red-500/20',
          )}
        >
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            className={cn(
              'w-full bg-transparent text-white placeholder:text-zinc-500 outline-none px-4 py-3 text-sm resize-y min-h-[80px]',
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-zinc-500 mt-1">{helperText}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

// ---- Select Component ----

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ variant = 'default', label, error, helperText, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
            {label}
            {props.required && <span className="text-violet-400 ml-1">*</span>}
          </label>
        )}
        <div
          className={cn(
            'relative rounded-xl transition-all duration-200',
            'ring-0 focus-within:ring-2 focus-within:ring-violet-500/20',
            variantStyles[variant],
            error && 'border-red-500/50',
          )}
        >
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-transparent text-white outline-none h-11 px-4 text-sm appearance-none cursor-pointer',
              '[&>option]:bg-zinc-900 [&>option]:text-white',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-zinc-500 mt-1">{helperText}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Input;
