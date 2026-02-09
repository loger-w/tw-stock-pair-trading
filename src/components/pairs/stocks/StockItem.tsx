import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteStockDialog } from './DeleteStockDialog';

interface StockItemProps {
  groupId: string;
  stockId: string;
  displayText: string;
}

export const StockItem = ({
  groupId,
  stockId,
  displayText,
}: StockItemProps) => {
  return (
    <Badge
      variant="secondary"
      className="pl-3 pr-1 py-1 text-sm flex items-center gap-1"
    >
      <span>{displayText}</span>
      <DeleteStockDialog
        groupId={groupId}
        stockId={stockId}
        stockDisplay={displayText}
      >
        <Button
          variant="ghost"
          size="icon-xs"
          className="h-5 w-5 hover:bg-destructive/20 hover:text-destructive"
          aria-label={`移除 ${displayText}`}
        >
          <X className="h-3 w-3" />
        </Button>
      </DeleteStockDialog>
    </Badge>
  );
};
