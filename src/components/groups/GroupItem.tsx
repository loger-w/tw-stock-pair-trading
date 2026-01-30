import { Folder, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteGroupDialog } from './DeleteGroupDialog';
import { useStockSearch } from '@/hooks/useStockSearch';
import type { StockGroup } from '@/types';
import { cn } from '@/lib/utils';
import { GROUP_CONSTRAINTS } from '@/lib/constants';

interface GroupItemProps {
  group: StockGroup;
  isSelected: boolean;
  onSelect: () => void;
}

export const GroupItem = ({ group, isSelected, onSelect }: GroupItemProps) => {
  const { formatStockDisplay } = useStockSearch();

  const handleClick = () => {
    onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`選擇群組：${group.name}`}
      aria-selected={isSelected}
      className={cn(
        'rounded-lg border p-3 cursor-pointer transition-colors',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Folder
            className={cn(
              'h-4 w-4 flex-shrink-0',
              isSelected ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <span className="font-medium text-sm truncate">{group.name}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            ({group.stockIds.length}/{GROUP_CONSTRAINTS.maxStocks})
          </span>
        </div>
        <DeleteGroupDialog groupId={group.id} groupName={group.name}>
          <Button
            variant="ghost"
            size="icon-xs"
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
            aria-label={`刪除群組：${group.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <X className="h-3 w-3" />
          </Button>
        </DeleteGroupDialog>
      </div>

      {group.stockIds.length > 0 && (
        <div className="mt-2 pl-6 space-y-1">
          {group.stockIds.map((stockId) => (
            <div
              key={stockId}
              className="text-xs text-muted-foreground truncate"
            >
              {formatStockDisplay(stockId)}
            </div>
          ))}
        </div>
      )}

      {group.stockIds.length === 0 && (
        <div className="mt-2 pl-6">
          <span className="text-xs text-muted-foreground italic">
            尚無股票
          </span>
        </div>
      )}
    </div>
  );
};
