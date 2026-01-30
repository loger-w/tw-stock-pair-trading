import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MinCapitalMode } from './MinCapitalMode';
import { CustomCapitalMode } from './CustomCapitalMode';
import type { PairAnalysis } from '@/types';

interface PositionCalculatorProps {
  pair: PairAnalysis;
}

export const PositionCalculator = ({ pair }: PositionCalculatorProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">部位計算機</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <MinCapitalMode pair={pair} />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
            或自訂資金
          </span>
        </div>

        <CustomCapitalMode pair={pair} />
      </CardContent>
    </Card>
  );
};
