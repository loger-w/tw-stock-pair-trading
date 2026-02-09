import { StockItem } from './StockItem';
import { useStockSearch } from '@/hooks/pairs/useStockSearch';

interface StockListProps {
  groupId: string;
  stockIds: string[];
}

export const StockList = ({ groupId, stockIds }: StockListProps) => {
  const { formatStockDisplay } = useStockSearch();

  if (stockIds.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        尚無股票，請在上方輸入框新增
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {stockIds.map((stockId) => (
        <StockItem
          key={stockId}
          groupId={groupId}
          stockId={stockId}
          displayText={formatStockDisplay(stockId)}
        />
      ))}
    </div>
  );
};
