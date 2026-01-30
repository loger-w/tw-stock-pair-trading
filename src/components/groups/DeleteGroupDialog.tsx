import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';
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
import { useDeleteGroup } from '@/hooks/useStockGroups';
import { useAppStore } from '@/stores/appStore';

interface DeleteGroupDialogProps {
  groupId: string;
  groupName: string;
  children: ReactNode;
}

export const DeleteGroupDialog = ({
  groupId,
  groupName,
  children,
}: DeleteGroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const deleteGroup = useDeleteGroup();
  const selectedGroupId = useAppStore((state) => state.selectedGroupId);
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);

  const handleDelete = async () => {
    try {
      await deleteGroup.mutateAsync(groupId);

      // Clear selection if deleted group was selected
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }

      setOpen(false);
      toast.success(`群組「${groupName}」已刪除`);
    } catch {
      toast.error('刪除群組失敗');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>刪除群組</DialogTitle>
          <DialogDescription>
            確定要刪除群組「{groupName}」嗎？此操作無法復原。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteGroup.isPending}
          >
            {deleteGroup.isPending ? '刪除中...' : '刪除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
