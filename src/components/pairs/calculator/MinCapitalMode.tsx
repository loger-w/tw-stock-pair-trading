import { useMemo } from 'react';
import { calculateMinPosition, formatCurrency } from '@/lib/pairs/calculations';
import { getTradingAction } from '@/lib/pairs/signals';
import { ACTION_LABELS, COLORS } from '@/lib/pairs/constants';
import type { PairAnalysis } from '@/types/pairs';

interface MinCapitalModeProps {
  pair: PairAnalysis;
}

export const MinCapitalMode = ({ pair }: MinCapitalModeProps) => {
  const { stockAAction, stockBAction } = getTradingAction(pair.arbitrageSpace);

  const position = useMemo(
    () =>
      calculateMinPosition(
        pair.stockACurrentPrice,
        pair.stockBCurrentPrice,
        stockAAction,
        stockBAction
      ),
    [pair.stockACurrentPrice, pair.stockBCurrentPrice, stockAAction, stockBAction]
  );

  const formatCapitalInWan = (value: number) => {
    const wan = value / 10000;
    return wan >= 100 ? `${Math.round(wan)} 萬` : `${wan.toFixed(1)} 萬`;
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">最小資金需求</h4>

      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <div className="text-sm text-muted-foreground">最小交易資金</div>
        <div className="text-2xl font-bold mt-1" style={{ color: COLORS.primary }}>
          約 {formatCapitalInWan(position.totalCapital)} 元
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          （{formatCurrency(position.totalCapital)} 元）
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Stock A */}
        <div
          className="p-3 rounded-lg border"
          style={{
            borderColor: stockAAction === 'short' ? COLORS.short : COLORS.long,
            backgroundColor: stockAAction === 'short' ? 'rgba(22, 163, 74, 0.05)' : 'rgba(220, 38, 38, 0.05)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2 py-0.5 rounded text-white text-xs font-medium"
              style={{
                backgroundColor: stockAAction === 'short' ? COLORS.short : COLORS.long,
              }}
            >
              {ACTION_LABELS[stockAAction]}
            </span>
            <span className="text-sm font-medium">{pair.stockA} {pair.stockAName}</span>
          </div>
          <div className="text-lg font-semibold">
            {position.stockAShares} 張
          </div>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(position.stockACost)} 元
          </div>
        </div>

        {/* Stock B */}
        <div
          className="p-3 rounded-lg border"
          style={{
            borderColor: stockBAction === 'short' ? COLORS.short : COLORS.long,
            backgroundColor: stockBAction === 'short' ? 'rgba(22, 163, 74, 0.05)' : 'rgba(220, 38, 38, 0.05)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2 py-0.5 rounded text-white text-xs font-medium"
              style={{
                backgroundColor: stockBAction === 'short' ? COLORS.short : COLORS.long,
              }}
            >
              {ACTION_LABELS[stockBAction]}
            </span>
            <span className="text-sm font-medium">{pair.stockB} {pair.stockBName}</span>
          </div>
          <div className="text-lg font-semibold">
            {position.stockBShares} 張
          </div>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(position.stockBCost)} 元
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        部位價值差異：{formatCurrency(position.valueDifference)} 元
        （{(position.valueDifferencePercent * 100).toFixed(1)}%）
      </div>
    </div>
  );
};
