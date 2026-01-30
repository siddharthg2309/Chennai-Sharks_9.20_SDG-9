import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type IconWrapperProps = {
  icon: LucideIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
  glowClassName?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
};

export function IconWrapper({
  icon: Icon,
  size = 26,
  strokeWidth = 1.5,
  className,
  glowClassName,
  primaryClassName,
  secondaryClassName,
}: IconWrapperProps) {
  return (
    <div className={cn('relative flex items-center justify-center w-10 h-10', className)}>
      <span
        className={cn(
          'absolute inset-0 rounded-full bg-emerald-500/10 blur-xl scale-125 opacity-70 transition-opacity duration-200 group-hover:opacity-100',
          glowClassName,
        )}
        aria-hidden="true"
      />
      <Icon
        size={size}
        strokeWidth={strokeWidth}
        className={cn('absolute opacity-20', secondaryClassName)}
        aria-hidden="true"
      />
      <Icon size={size} strokeWidth={strokeWidth} className={cn('relative', primaryClassName)} />
    </div>
  );
}
