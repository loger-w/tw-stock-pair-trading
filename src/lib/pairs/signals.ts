import type { SignalStrength } from '@/types/pairs';
import { COLORS, SIGNAL_LABELS } from './constants';

/**
 * Determine signal strength based on arbitrage space and Z-Score
 *
 * Rules:
 * | Arbitrage (abs) | Z-Score (abs) | Signal      |
 * |-----------------|---------------|-------------|
 * | ≥20%            | ≥2.0          | super-strong|
 * | ≥15%            | ≥2.0          | strong      |
 * | ≥15%            | 1.5~2.0       | medium      |
 * | 10%~15%         | ≥2.0          | medium      |
 * | 10%~15%         | 1.5~2.0       | weak        |
 * | ≥15%            | <1.5          | weak        |
 * | <10%            | any           | none        |
 */
export const determineSignalStrength = (
  arbitrageSpace: number,
  zScore: number
): SignalStrength => {
  const absArbitrage = Math.abs(arbitrageSpace);
  const absZScore = Math.abs(zScore);

  // No signal if arbitrage space < 10%
  if (absArbitrage < 0.1) {
    return 'none';
  }

  // Super strong: arbitrage >= 20%, z-score >= 2.0
  if (absArbitrage >= 0.2 && absZScore >= 2.0) {
    return 'super-strong';
  }

  // Strong: arbitrage >= 15%, z-score >= 2.0
  if (absArbitrage >= 0.15 && absZScore >= 2.0) {
    return 'strong';
  }

  // Medium: arbitrage >= 15% and z-score 1.5~2.0
  if (absArbitrage >= 0.15 && absZScore >= 1.5 && absZScore < 2.0) {
    return 'medium';
  }

  // Medium: arbitrage 10%~15% and z-score >= 2.0
  if (absArbitrage >= 0.1 && absArbitrage < 0.15 && absZScore >= 2.0) {
    return 'medium';
  }

  // Weak: everything else with arbitrage >= 10%
  return 'weak';
};

/**
 * Get color for signal strength
 */
export const getSignalColor = (signal: SignalStrength): string => {
  switch (signal) {
    case 'super-strong':
    case 'strong':
      return COLORS.strongSignal;
    case 'medium':
      return COLORS.mediumSignal;
    case 'weak':
    case 'none':
    default:
      return COLORS.weakSignal;
  }
};

/**
 * Get label for signal strength
 */
export const getSignalLabel = (signal: SignalStrength): string => {
  return SIGNAL_LABELS[signal];
};

/**
 * Check if signal is considered "strong" (for filtering)
 */
export const isStrongSignal = (signal: SignalStrength): boolean => {
  return signal === 'super-strong' || signal === 'strong';
};

/**
 * Get trading action based on arbitrage space
 * Positive arbitrage = A is expensive relative to B = Short A, Long B
 * Negative arbitrage = A is cheap relative to B = Long A, Short B
 */
export const getTradingAction = (
  arbitrageSpace: number
): { stockAAction: 'long' | 'short'; stockBAction: 'long' | 'short' } => {
  if (arbitrageSpace > 0) {
    // A is relatively expensive -> Short A, Long B
    return { stockAAction: 'short', stockBAction: 'long' };
  } else {
    // A is relatively cheap -> Long A, Short B
    return { stockAAction: 'long', stockBAction: 'short' };
  }
};

/**
 * Get action color based on long/short
 */
export const getActionColor = (action: 'long' | 'short'): string => {
  return action === 'long' ? COLORS.long : COLORS.short;
};

/**
 * Get signal badge CSS classes
 */
export const getSignalBadgeClasses = (signal: SignalStrength): string => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

  switch (signal) {
    case 'super-strong':
      return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
    case 'strong':
      return `${baseClasses} bg-red-50 text-red-600 border border-red-100`;
    case 'medium':
      return `${baseClasses} bg-amber-50 text-amber-600 border border-amber-100`;
    case 'weak':
      return `${baseClasses} bg-gray-100 text-gray-500 border border-gray-200`;
    case 'none':
    default:
      return `${baseClasses} bg-gray-50 text-gray-400 border border-gray-100`;
  }
};
