import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SignalBadge } from './SignalBadge';
import { getTradingAction, getActionColor } from '@/lib/signals';
import { formatPercent } from '@/lib/calculations';
import { ACTION_LABELS } from '@/lib/constants';
import type { PairAnalysis } from '@/types';
import { cn } from '@/lib/utils';

interface PairCardProps {
  pair: PairAnalysis;
  isExpanded: boolean;
  onClick: () => void;
}

export const PairCard = ({ pair, isExpanded, onClick }: PairCardProps) => {
  const { stockAAction, stockBAction } = getTradingAction(pair.arbitrageSpace);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${pair.stockAName} vs ${pair.stockBName} 配對分析`}
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isExpanded && 'ring-2 ring-primary'
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Signal Badge */}
          <div className="flex-shrink-0">
            <SignalBadge signal={pair.signalStrength} />
          </div>

          {/* Center: Stock Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Stock A */}
              <div className="flex items-center gap-1">
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor:
                      stockAAction === 'long'
                        ? 'var(--pairs-long)'
                        : 'var(--pairs-short)',
                    color: 'white',
                  }}
                >
                  {ACTION_LABELS[stockAAction]}
                </span>
                <span className="font-medium text-sm">
                  {pair.stockA} {pair.stockAName}
                </span>
              </div>

              <span className="text-muted-foreground">vs</span>

              {/* Stock B */}
              <div className="flex items-center gap-1">
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor:
                      stockBAction === 'long'
                        ? 'var(--pairs-long)'
                        : 'var(--pairs-short)',
                    color: 'white',
                  }}
                >
                  {ACTION_LABELS[stockBAction]}
                </span>
                <span className="font-medium text-sm">
                  {pair.stockB} {pair.stockBName}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                套利空間{' '}
                <span
                  className="font-medium"
                  style={{
                    color:
                      Math.abs(pair.arbitrageSpace) >= 0.15
                        ? 'var(--pairs-strong-signal)'
                        : undefined,
                  }}
                >
                  {formatPercent(pair.arbitrageSpace)}
                </span>
              </span>
              <span>
                同步率{' '}
                <span className="font-medium">
                  {formatPercent(pair.coMovementRate, 0)}
                </span>
              </span>
              <span>
                Z-Score{' '}
                <span
                  className="font-medium"
                  style={{
                    color:
                      Math.abs(pair.zScore) >= 2.0
                        ? 'var(--pairs-strong-signal)'
                        : undefined,
                  }}
                >
                  {pair.zScore >= 0 ? '+' : ''}
                  {pair.zScore.toFixed(2)}
                </span>
              </span>
            </div>
          </div>

          {/* Right: Expand Icon */}
          <div className="flex-shrink-0">
            <ChevronDown
              className={cn(
                'h-5 w-5 text-muted-foreground transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
