import { useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateCustomPosition, formatCurrency } from '@/lib/pairs/calculations';
import { getTradingAction } from '@/lib/pairs/signals';
import { ACTION_LABELS, COLORS } from '@/lib/pairs/constants';
import type { PairAnalysis } from '@/types/pairs';

interface CustomCapitalModeProps {
  pair: PairAnalysis;
}

export const CustomCapitalMode = ({ pair }: CustomCapitalModeProps) => {
  const [capitalInput, setCapitalInput] = useState('1000000');
  const { stockAAction, stockBAction } = getTradingAction(pair.arbitrageSpace);

  const capital = useMemo(() => {
    const parsed = parseInt(capitalInput.replace(/,/g, ''), 10);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [capitalInput]);

  const position = useMemo(
    () =>
      calculateCustomPosition(
        pair.stockACurrentPrice,
        pair.stockBCurrentPrice,
        capital,
        stockAAction,
        stockBAction
      ),
    [pair.stockACurrentPrice, pair.stockBCurrentPrice, capital, stockAAction, stockBAction]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCapitalInput(value);
  }, []);

  const formattedInput = useMemo(() => {
    if (!capitalInput) return '';
    const num = parseInt(capitalInput, 10);
    if (isNaN(num)) return capitalInput;
    return formatCurrency(num);
  }, [capitalInput]);

  const isValidCapital = capital > 0 && position.stockAShares > 0 && position.stockBShares > 0;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">自訂資金模式</h4>

      <div className="space-y-2">
        <Label htmlFor="capital-input">投入總資金</Label>
        <div className="flex items-center gap-2">
          <Input
            id="capital-input"
            type="text"
            value={formattedInput}
            onChange={handleInputChange}
            placeholder="輸入金額"
            className="text-right font-mono"
            aria-label="投入總資金"
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">元</span>
        </div>
      </div>

      {isValidCapital ? (
        <>
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

          <div className="p-3 bg-muted/50 rounded-lg space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">實際使用資金</span>
              <span className="font-medium">{formatCurrency(position.totalCapital)} 元</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">部位價值差異</span>
              <span className="font-medium">
                {formatCurrency(position.valueDifference)} 元
                （{(position.valueDifferencePercent * 100).toFixed(1)}%）
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">剩餘資金</span>
              <span className="font-medium">{formatCurrency(capital - position.totalCapital)} 元</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {capital === 0 ? (
            '請輸入投入資金'
          ) : (
            <span>
              資金不足，至少需要{' '}
              <span className="font-medium">
                {formatCurrency(
                  Math.min(pair.stockACurrentPrice, pair.stockBCurrentPrice) * 1000
                )}
              </span>{' '}
              元
            </span>
          )}
        </div>
      )}
    </div>
  );
};
