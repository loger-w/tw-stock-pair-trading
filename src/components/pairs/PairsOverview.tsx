import { useState, useCallback, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AddStockInput } from './stocks/AddStockInput';
import { StockList } from './stocks/StockList';
import { SignalFilter } from './SignalFilter';
import { CalculateButton } from './CalculateButton';
import { PairCard } from './PairCard';
import { PairDetail } from './analysis/PairDetail';
import { useStockGroup } from '@/hooks/pairs/useStockGroups';
import { usePairCalculation, sortBySignalStrength } from '@/hooks/pairs/usePairCalculation';
import { useStockSearch } from '@/hooks/pairs/useStockSearch';
import { fetchStockPrices } from '@/services/pairs/api';
import { useAppStore } from '@/stores/pairs/appStore';
import { isStrongSignal } from '@/lib/pairs/signals';
import { GROUP_CONSTRAINTS } from '@/lib/pairs/constants';
import type { PairAnalysis } from '@/types/pairs';
import { toast } from 'sonner';

export const PairsOverview = () => {
  const selectedGroupId = useAppStore((state) => state.selectedGroupId);
  const analysisPeriod = useAppStore((state) => state.analysisPeriod);
  const showStrongSignalsOnly = useAppStore((state) => state.showStrongSignalsOnly);
  const expandedPairId = useAppStore((state) => state.expandedPairId);
  const setExpandedPairId = useAppStore((state) => state.setExpandedPairId);

  const { data: group, isLoading: isGroupLoading } = useStockGroup(selectedGroupId);
  const { calculatePairAnalysis, filterStocksWithSufficientData } = usePairCalculation();
  const { stockCatalog } = useStockSearch();

  const [analysisResults, setAnalysisResults] = useState<PairAnalysis[]>([]);
  const [excludedStocks, setExcludedStocks] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Reset state when switching groups
  useEffect(() => {
    setAnalysisResults([]);
    setExcludedStocks([]);
    setHasCalculated(false);
    setExpandedPairId(null);
  }, [selectedGroupId, setExpandedPairId]);

  const handleCalculate = useCallback(async () => {
    if (!group || group.stockIds.length < GROUP_CONSTRAINTS.minStocks) {
      return;
    }

    setIsCalculating(true);
    setAnalysisResults([]);
    setExcludedStocks([]);

    try {
      // Fetch price data
      const priceData = await fetchStockPrices(group.stockIds, analysisPeriod);

      // Filter stocks with sufficient data
      const { validStockIds, excludedStockIds } = filterStocksWithSufficientData(
        group.stockIds,
        priceData,
        analysisPeriod
      );

      setExcludedStocks(excludedStockIds);

      if (validStockIds.length < GROUP_CONSTRAINTS.minStocks) {
        toast.error('有效股票不足，無法進行配對分析');
        setHasCalculated(true);
        setIsCalculating(false);
        return;
      }

      // Calculate pair analysis
      const results = calculatePairAnalysis(validStockIds, priceData, stockCatalog);
      const sortedResults = sortBySignalStrength(results);

      setAnalysisResults(sortedResults);
      setHasCalculated(true);
      toast.success(`已完成 ${sortedResults.length} 組配對分析`);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('分析失敗，請稍後再試');
    } finally {
      setIsCalculating(false);
    }
  }, [group, analysisPeriod, calculatePairAnalysis, filterStocksWithSufficientData, stockCatalog]);

  const handlePairClick = (pairId: string) => {
    // Accordion behavior: toggle or switch
    setExpandedPairId(expandedPairId === pairId ? null : pairId);
  };

  // Filter results based on signal filter
  const filteredResults = showStrongSignalsOnly
    ? analysisResults.filter((r) => isStrongSignal(r.signalStrength))
    : analysisResults;

  // Empty state: no group selected
  if (!selectedGroupId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
        <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg">請先選擇或建立群組</p>
        <p className="text-sm mt-2">在左側邊欄選擇一個群組開始分析</p>
      </div>
    );
  }

  // Loading state
  if (isGroupLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Group not found
  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
        <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
        <p>找不到群組</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Group Header */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--pairs-primary)' }}>
          {group.name}
        </h2>
      </div>

      {/* Add Stock Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">新增股票</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddStockInput groupId={group.id} currentStockIds={group.stockIds} />

          {/* Stock List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                已加入股票 ({group.stockIds.length}/{GROUP_CONSTRAINTS.maxStocks})
              </span>
            </div>
            <StockList groupId={group.id} stockIds={group.stockIds} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Analysis Controls */}
      <div className="flex items-center justify-between gap-4">
        <SignalFilter />
        <CalculateButton
          stockCount={group.stockIds.length}
          isCalculating={isCalculating}
          onClick={handleCalculate}
        />
      </div>

      {/* Excluded Stocks Warning */}
      {excludedStocks.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
          <strong>注意：</strong>
          {excludedStocks.join('、')} 歷史資料不足 {analysisPeriod} 天，已排除
        </div>
      )}

      {/* Results */}
      {isCalculating ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : hasCalculated ? (
        filteredResults.length > 0 ? (
          <div className="space-y-3">
            {filteredResults.map((pair) => (
              <div key={pair.id}>
                <PairCard
                  pair={pair}
                  isExpanded={expandedPairId === pair.id}
                  onClick={() => handlePairClick(pair.id)}
                />
                {expandedPairId === pair.id && (
                  <PairDetail pair={pair} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {showStrongSignalsOnly
              ? '無強烈訊號的配對'
              : '無分析結果'}
          </div>
        )
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {group.stockIds.length < GROUP_CONSTRAINTS.minStocks
            ? `請加入至少 ${GROUP_CONSTRAINTS.minStocks} 檔股票以進行配對分析`
            : '點擊「計算」按鈕開始分析'}
        </div>
      )}
    </div>
  );
};
