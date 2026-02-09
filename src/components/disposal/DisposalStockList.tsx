import { Ban } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DisposalStockCard } from './DisposalStockCard';
import { DISPOSAL_COLORS } from '@/lib/disposal/constants';
import type { DisposalStock } from '@/types/disposal';

interface DisposalStockListProps {
  stocks: DisposalStock[];
}

export const DisposalStockList = ({ stocks }: DisposalStockListProps) => {
  // 按出關日期排序（最近的在前）
  const sortedStocks = [...stocks].sort(
    (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-2 p-3 rounded-t-lg"
        style={{ backgroundColor: `${DISPOSAL_COLORS.disposal}20` }}
      >
        <Ban
          className="h-5 w-5"
          style={{ color: DISPOSAL_COLORS.disposal }}
          aria-hidden="true"
        />
        <h2
          className="font-bold"
          style={{ color: DISPOSAL_COLORS.disposal }}
        >
          處置中
        </h2>
        <span className="text-sm text-muted-foreground">
          ({stocks.length} 檔)
        </span>
      </div>

      {/* List */}
      <ScrollArea className="flex-1 border border-t-0 rounded-b-lg">
        {sortedStocks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            目前無處置股票
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {sortedStocks.map((stock) => (
              <DisposalStockCard key={stock.stockId} stock={stock} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
