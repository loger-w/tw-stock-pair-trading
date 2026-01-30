import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InfoCards } from './InfoCards';
import { PriceRatioChart } from './PriceRatioChart';
import { DualPriceChart } from './DualPriceChart';
import { PositionCalculator } from '@/components/calculator/PositionCalculator';
import type { PairAnalysis } from '@/types';

interface PairDetailProps {
  pair: PairAnalysis;
}

export const PairDetail = ({ pair }: PairDetailProps) => {
  return (
    <Card className="mt-2 border-t-0 rounded-t-none">
      <CardContent className="p-4 space-y-6">
        {/* 基礎資訊卡片 */}
        <InfoCards pair={pair} />

        <Separator />

        {/* 圖表區域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PriceRatioChart pair={pair} />
          <DualPriceChart pair={pair} />
        </div>

        <Separator />

        {/* 部位計算機 */}
        <PositionCalculator pair={pair} />
      </CardContent>
    </Card>
  );
};
