import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateGroup } from '@/hooks/useStockGroups';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';

export const CreateGroupDialog = () => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const createGroup = useCreateGroup();
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = groupName.trim();
    if (!trimmedName) {
      toast.error('請輸入群組名稱');
      return;
    }

    try {
      const newGroup = await createGroup.mutateAsync(trimmedName);
      setSelectedGroupId(newGroup.id);
      setGroupName('');
      setOpen(false);
      toast.success(`群組「${trimmedName}」已建立`);
    } catch {
      toast.error('建立群組失敗');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default">
          <Plus className="mr-2 h-4 w-4" />
          新增群組
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>新增股票群組</DialogTitle>
          <DialogDescription>
            建立一個新的股票群組，之後可以加入股票進行配對分析。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">群組名稱</Label>
              <Input
                id="group-name"
                placeholder="例如：記憶體、AI 族群"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={createGroup.isPending}>
              {createGroup.isPending ? '建立中...' : '建立'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
