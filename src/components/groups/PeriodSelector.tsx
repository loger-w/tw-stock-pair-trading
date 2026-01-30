import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppStore } from '@/stores/appStore';
import { ANALYSIS_PERIODS, PERIOD_LABELS } from '@/lib/constants';
import type { AnalysisPeriod } from '@/types';

export const PeriodSelector = () => {
  const analysisPeriod = useAppStore((state) => state.analysisPeriod);
  const setAnalysisPeriod = useAppStore((state) => state.setAnalysisPeriod);

  const handleChange = (value: string) => {
    setAnalysisPeriod(Number(value) as AnalysisPeriod);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">分析期間</Label>
      <RadioGroup
        value={String(analysisPeriod)}
        onValueChange={handleChange}
        className="flex gap-4"
      >
        {ANALYSIS_PERIODS.map((period) => (
          <div key={period} className="flex items-center space-x-2">
            <RadioGroupItem
              value={String(period)}
              id={`period-${period}`}
              aria-label={PERIOD_LABELS[period]}
            />
            <Label
              htmlFor={`period-${period}`}
              className="text-sm cursor-pointer"
            >
              {PERIOD_LABELS[period]}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
