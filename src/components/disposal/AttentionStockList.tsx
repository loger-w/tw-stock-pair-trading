import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AttentionStockCard } from './AttentionStockCard';
import { DISPOSAL_COLORS } from '@/lib/disposal/constants';
import type { AttentionStock } from '@/types/disposal';

interface AttentionStockListProps {
  stocks: AttentionStock[];
}

export const AttentionStockList = ({ stocks }: AttentionStockListProps) => {
  // 按注意次數降序排列（高風險在前）
  const sortedStocks = [...stocks].sort(
    (a, b) => b.attentionCount - a.attentionCount
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-2 p-3 rounded-t-lg"
        style={{ backgroundColor: `${DISPOSAL_COLORS.attention1}20` }}
      >
        <AlertCircle
          className="h-5 w-5"
          style={{ color: DISPOSAL_COLORS.attention1 }}
          aria-hidden="true"
        />
        <h2
          className="font-bold"
          style={{ color: DISPOSAL_COLORS.attention1 }}
        >
          注意股票
        </h2>
        <span className="text-sm text-muted-foreground">
          ({stocks.length} 檔)
        </span>
      </div>

      {/* List */}
      <ScrollArea className="flex-1 border border-t-0 rounded-b-lg">
        {sortedStocks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            目前無注意股票
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {sortedStocks.map((stock) => (
              <AttentionStockCard key={stock.stockId} stock={stock} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
