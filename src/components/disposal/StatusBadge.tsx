import { cn } from '@/lib/utils';
import { DISPOSAL_COLORS, MARKET_LABELS } from '@/lib/disposal/constants';
import type { AttentionCount, DisposalInterval, MarketType } from '@/types/disposal';

interface AttentionBadgeProps {
  type: 'attention';
  count: AttentionCount;
  marketType: MarketType;
}

interface DisposalBadgeProps {
  type: 'disposal';
  interval: DisposalInterval;
  marketType: MarketType;
}

type StatusBadgeProps = AttentionBadgeProps | DisposalBadgeProps;

export const StatusBadge = (props: StatusBadgeProps) => {
  const { marketType } = props;

  if (props.type === 'attention') {
    const { count } = props;
    const isHighRisk = count === 2;
    const bgColor = isHighRisk ? DISPOSAL_COLORS.attention2 : DISPOSAL_COLORS.attention1;
    const label = isHighRisk ? '高風險' : '注意';

    return (
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white'
          )}
          style={{ backgroundColor: bgColor }}
        >
          {label} {count}/3
        </span>
        <span className="text-xs text-muted-foreground">
          {MARKET_LABELS[marketType]}
        </span>
      </div>
    );
  }

  // disposal type
  const { interval } = props;
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
        style={{ backgroundColor: DISPOSAL_COLORS.disposal }}
      >
        {interval}分盤
      </span>
      <span className="text-xs text-muted-foreground">
        {MARKET_LABELS[marketType]}
      </span>
    </div>
  );
};
