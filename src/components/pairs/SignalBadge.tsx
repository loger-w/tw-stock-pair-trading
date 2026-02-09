import type { SignalStrength } from '@/types/pairs';
import { getSignalLabel, getSignalBadgeClasses } from '@/lib/pairs/signals';
import { cn } from '@/lib/utils';

interface SignalBadgeProps {
  signal: SignalStrength;
  className?: string;
}

export const SignalBadge = ({ signal, className }: SignalBadgeProps) => {
  return (
    <span className={cn(getSignalBadgeClasses(signal), className)}>
      訊號{getSignalLabel(signal)}
    </span>
  );
};
