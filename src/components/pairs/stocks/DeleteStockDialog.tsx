import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRemoveStockFromGroup } from '@/hooks/pairs/useStockGroups';
import { toast } from 'sonner';

interface DeleteStockDialogProps {
  groupId: string;
  stockId: string;
  stockDisplay: string;
  children: ReactNode;
}

export const DeleteStockDialog = ({
  groupId,
  stockId,
  stockDisplay,
  children,
}: DeleteStockDialogProps) => {
  const [open, setOpen] = useState(false);
  const removeStock = useRemoveStockFromGroup();

  const handleDelete = async () => {
    try {
      await removeStock.mutateAsync({ groupId, stockId });
      setOpen(false);
      toast.success(`已移除 ${stockDisplay}`);
    } catch {
      toast.error('移除股票失敗');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>移除股票</DialogTitle>
          <DialogDescription>
            確定要從群組中移除「{stockDisplay}」嗎？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={removeStock.isPending}
          >
            {removeStock.isPending ? '移除中...' : '移除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
