import { useStockGroups } from '@/hooks/pairs/useStockGroups';
import { useAppStore } from '@/stores/pairs/appStore';
import { GroupItem } from './GroupItem';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen } from 'lucide-react';

export const GroupList = () => {
  const { data: groups, isLoading, isError } = useStockGroups();
  const selectedGroupId = useAppStore((state) => state.selectedGroupId);
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive text-center py-4">
        載入群組失敗
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <FolderOpen className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm text-center">尚無群組</p>
        <p className="text-xs text-center mt-1">
          請新增群組並加入股票代號
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <GroupItem
          key={group.id}
          group={group}
          isSelected={group.id === selectedGroupId}
          onSelect={() => setSelectedGroupId(group.id)}
        />
      ))}
    </div>
  );
};
