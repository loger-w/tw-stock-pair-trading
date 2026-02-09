import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDisposalData } from '@/hooks/disposal/useDisposalData';
import { DataUpdateTime } from './DataUpdateTime';
import { AttentionStockList } from './AttentionStockList';
import { DisposalStockList } from './DisposalStockList';

export const DisposalOverview = () => {
  const { data, isLoading, isError, refetch, isFetching } = useDisposalData();

  // Loading 狀態
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error 狀態
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-6xl mb-4">!</div>
        <h2 className="text-xl font-bold text-destructive mb-2">
          資料載入失敗
        </h2>
        <p className="text-muted-foreground mb-4">
          無法取得處置預警資料，請稍後再試
        </p>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`}
          />
          重新載入
        </Button>
      </div>
    );
  }

  const { attentionStocks, disposalStocks, lastUpdated } = data!;

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header: 更新時間 + 重新整理 */}
      <div className="flex items-center justify-between mb-6">
        <DataUpdateTime lastUpdated={lastUpdated} />
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="ghost"
          size="sm"
          aria-label="重新載入資料"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
        </Button>
      </div>

      {/* 兩欄卡片佈局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <AttentionStockList stocks={attentionStocks} />
        <DisposalStockList stocks={disposalStocks} />
      </div>

      {/* 免責聲明 */}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        資料僅供參考，實際以證交所/櫃買中心公告為準
      </p>
    </div>
  );
};
