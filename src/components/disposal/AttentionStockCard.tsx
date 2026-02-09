import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { DISPOSAL_COLORS } from '@/lib/disposal/constants';
import type { AttentionStock } from '@/types/disposal';

interface AttentionStockCardProps {
  stock: AttentionStock;
}

export const AttentionStockCard = ({ stock }: AttentionStockCardProps) => {
  const {
    stockId,
    stockName,
    marketType,
    attentionCount,
    triggerReason,
    attentionDate,
    thresholdPrice,
  } = stock;

  const isHighRisk = attentionCount === 2;
  const borderColor = isHighRisk
    ? DISPOSAL_COLORS.attention2
    : DISPOSAL_COLORS.attention1;

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Card
      className="transition-shadow hover:shadow-md"
      style={{ borderLeftWidth: '4px', borderLeftColor: borderColor }}
    >
      <CardContent className="p-4">
        {/* Header: 股票代號名稱 + 狀態 */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{stockId}</span>
            <span className="text-foreground">{stockName}</span>
          </div>
          <StatusBadge
            type="attention"
            count={attentionCount}
            marketType={marketType}
          />
        </div>

        {/* 觸發原因 + 日期 */}
        <p className="text-sm text-muted-foreground mb-2">
          {triggerReason}
          <span className="ml-2 text-xs">({formatDate(attentionDate)})</span>
        </p>

        {/* 高風險警示：臨界價 */}
        {isHighRisk && thresholdPrice && (
          <div
            className="flex items-center gap-1.5 mt-3 p-2 rounded-md text-sm"
            style={{
              backgroundColor: `${DISPOSAL_COLORS.attention2}15`,
              color: DISPOSAL_COLORS.attention2,
            }}
          >
            <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">
              明日收盤 &gt; {thresholdPrice.toLocaleString()} 元即進處置
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
