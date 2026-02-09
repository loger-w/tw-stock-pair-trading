import { CalendarCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { DISPOSAL_COLORS } from '@/lib/disposal/constants';
import type { DisposalStock } from '@/types/disposal';

interface DisposalStockCardProps {
  stock: DisposalStock;
}

export const DisposalStockCard = ({ stock }: DisposalStockCardProps) => {
  const { stockId, stockName, marketType, disposalInterval, startDate, endDate } =
    stock;

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const calculateDaysLeft = (endDateStr: string): number | null => {
    if (!endDateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDateStr);
    if (isNaN(end.getTime())) return null;
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft(endDate);

  return (
    <Card
      className="transition-shadow hover:shadow-md"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: DISPOSAL_COLORS.disposal,
      }}
    >
      <CardContent className="p-4">
        {/* Header: 股票代號名稱 + 狀態 */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{stockId}</span>
            <span className="text-foreground">{stockName}</span>
          </div>
          <StatusBadge
            type="disposal"
            interval={disposalInterval}
            marketType={marketType}
          />
        </div>

        {/* 處置期間 */}
        <p className="text-sm text-muted-foreground mb-2">
          處置期間：{formatDate(startDate)} ~ {formatDate(endDate)}
        </p>

        {/* 出關倒數 */}
        <div
          className="flex items-center gap-1.5 mt-3 p-2 rounded-md text-sm"
          style={{
            backgroundColor: `${DISPOSAL_COLORS.disposal}15`,
            color: DISPOSAL_COLORS.disposal,
          }}
        >
          <CalendarCheck className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span className="font-medium">
            {daysLeft === null
              ? '日期未知'
              : daysLeft > 0
                ? `出關倒數 ${daysLeft} 天`
                : '即將出關'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
