import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { GroupList } from '@/components/groups/GroupList';
import { PeriodSelector } from '@/components/groups/PeriodSelector';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';

export const Sidebar = () => {
  return (
    <aside className="w-72 border-r border-border bg-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1
          className="text-lg font-bold"
          style={{ color: 'var(--pairs-primary)' }}
        >
          台股雙刀戰法
        </h1>
        <p className="text-xs text-muted-foreground mt-1">配對交易分析系統</p>
      </div>

      {/* Create Group */}
      <div className="p-4">
        <CreateGroupDialog />
      </div>

      <Separator />

      {/* Period Selector */}
      <div className="p-4">
        <PeriodSelector />
      </div>

      <Separator />

      {/* Group List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <GroupList />
        </div>
      </ScrollArea>
    </aside>
  );
};
