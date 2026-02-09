import { Card, CardContent } from '@/components/ui/card';
import { SignalBadge } from '@/components/pairs/SignalBadge';
import { getTradingAction, getSignalLabel } from '@/lib/pairs/signals';
import { formatPercent, formatPrice } from '@/lib/pairs/calculations';
import { ACTION_LABELS, COLORS } from '@/lib/pairs/constants';
import type { PairAnalysis } from '@/types/pairs';

interface InfoCardsProps {
  pair: PairAnalysis;
}

export const InfoCards = ({ pair }: InfoCardsProps) => {
  const { stockAAction, stockBAction } = getTradingAction(pair.arbitrageSpace);
  const signalLabel = getSignalLabel(pair.signalStrength);
  const hasStrongSignal = pair.signalStrength === 'super-strong' || pair.signalStrength === 'strong';

  const getCheckMark = (value: number, threshold: number) => {
    return value >= threshold ? (
      <span className="ml-1 text-green-600">✓</span>
    ) : null;
  };

  return (
    <div className="space-y-4">
      {/* 標題 */}
      <h3 className="text-lg font-semibold" style={{ color: COLORS.primary }}>
        {pair.stockA} {pair.stockAName} vs {pair.stockB} {pair.stockBName} 詳細分析
      </h3>

      {/* 第一列：今日股價 + 連動性分析 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 今日股價 */}
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">今日股價</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{pair.stockA} {pair.stockAName}</span>
                <span className="font-semibold">{formatPrice(pair.stockACurrentPrice)} 元</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{pair.stockB} {pair.stockBName}</span>
                <span className="font-semibold">{formatPrice(pair.stockBCurrentPrice)} 元</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 連動性分析 */}
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">連動性分析</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">漲跌同向率</span>
                <span className="font-semibold">
                  {formatPercent(pair.coMovementRate, 0)}
                  {getCheckMark(pair.coMovementRate, 0.8)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">相關係數</span>
                <span className="font-semibold">
                  {pair.correlationCoef.toFixed(2)}
                  {getCheckMark(pair.correlationCoef, 0.7)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 第二列：價差比率統計 */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">價差比率統計</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-xs text-muted-foreground">歷史均值</div>
              <div className="font-semibold mt-1">{pair.historicalMean.toFixed(4)}</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-xs text-muted-foreground">歷史標準差</div>
              <div className="font-semibold mt-1">{pair.historicalStdDev.toFixed(4)}</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-xs text-muted-foreground">歷史最大值</div>
              <div className="font-semibold mt-1">{pair.historicalMax.toFixed(4)}</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-xs text-muted-foreground">歷史最小值</div>
              <div className="font-semibold mt-1">{pair.historicalMin.toFixed(4)}</div>
            </div>
            <div className="text-center p-2 bg-primary/10 rounded border border-primary/20">
              <div className="text-xs text-muted-foreground">當前價差比率</div>
              <div className="font-semibold mt-1" style={{ color: COLORS.primary }}>
                {pair.currentRatio.toFixed(4)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 第三列：核心指標 */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">核心指標</h4>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="text-center p-4 rounded-lg"
              style={{
                backgroundColor: hasStrongSignal ? 'rgba(220, 38, 38, 0.1)' : 'rgba(156, 163, 175, 0.1)',
              }}
            >
              <div className="text-sm text-muted-foreground">套利空間</div>
              <div
                className="text-3xl font-bold mt-2"
                style={{
                  color: hasStrongSignal ? COLORS.strongSignal : COLORS.weakSignal,
                }}
              >
                {pair.arbitrageSpace >= 0 ? '+' : ''}{formatPercent(pair.arbitrageSpace)}
              </div>
            </div>
            <div
              className="text-center p-4 rounded-lg"
              style={{
                backgroundColor: Math.abs(pair.zScore) >= 2 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(156, 163, 175, 0.1)',
              }}
            >
              <div className="text-sm text-muted-foreground">Z-Score</div>
              <div
                className="text-3xl font-bold mt-2"
                style={{
                  color: Math.abs(pair.zScore) >= 2 ? COLORS.strongSignal : COLORS.weakSignal,
                }}
              >
                {pair.zScore >= 0 ? '+' : ''}{pair.zScore.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 第四列：訊號建議 */}
      <Card
        className="border-2"
        style={{
          borderColor: hasStrongSignal ? COLORS.strongSignal : undefined,
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <SignalBadge signal={pair.signalStrength} />
              <span className="font-medium">
                {signalLabel}訊號
              </span>
            </div>

            {pair.signalStrength !== 'none' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">建議：</span>
                <span
                  className="px-2 py-1 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: stockAAction === 'short' ? COLORS.short : COLORS.long }}
                >
                  {ACTION_LABELS[stockAAction]} {pair.stockAName}
                </span>
                <span
                  className="px-2 py-1 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: stockBAction === 'short' ? COLORS.short : COLORS.long }}
                >
                  {ACTION_LABELS[stockBAction]} {pair.stockBName}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
