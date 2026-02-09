import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GROUP_CONSTRAINTS } from '@/lib/pairs/constants';

interface CalculateButtonProps {
  stockCount: number;
  isCalculating: boolean;
  onClick: () => void;
}

export const CalculateButton = ({
  stockCount,
  isCalculating,
  onClick,
}: CalculateButtonProps) => {
  const isDisabled = stockCount < GROUP_CONSTRAINTS.minStocks || isCalculating;

  const getTooltip = () => {
    if (stockCount < GROUP_CONSTRAINTS.minStocks) {
      return `需 ${GROUP_CONSTRAINTS.minStocks} 檔以上股票`;
    }
    return '';
  };

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      className="min-w-[100px]"
      style={{
        backgroundColor: isDisabled ? undefined : 'var(--pairs-primary)',
      }}
      title={getTooltip()}
    >
      <Calculator className="mr-2 h-4 w-4" />
      {isCalculating ? '計算中...' : '計算'}
    </Button>
  );
};
