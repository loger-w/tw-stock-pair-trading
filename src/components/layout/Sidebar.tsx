import { useLocation } from '@tanstack/react-router';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { GroupList } from '@/components/pairs/groups/GroupList';
import { PeriodSelector } from '@/components/pairs/groups/PeriodSelector';
import { CreateGroupDialog } from '@/components/pairs/groups/CreateGroupDialog';
import { NavigationTabs } from '@/components/layout/NavigationTabs';

export const Sidebar = () => {
  const location = useLocation();
  const isDisposalPage = location.pathname === '/disposal';

  return (
    <aside className="w-72 border-r border-border bg-sidebar flex flex-col h-full">
      {/* Navigation Tabs */}
      <NavigationTabs />

      {isDisposalPage ? (
        // 處置系統頁面：僅顯示標題
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-bold text-[#dc2626]">處置預警系統</h1>
          <p className="text-xs text-muted-foreground mt-1">
            注意股票與處置股票監控
          </p>
        </div>
      ) : (
        // 雙刀戰法頁面：顯示完整 Sidebar
        <>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1
              className="text-lg font-bold"
              style={{ color: 'var(--pairs-primary)' }}
            >
              台股雙刀戰法
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              配對交易分析系統
            </p>
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
        </>
      )}
    </aside>
  );
};
