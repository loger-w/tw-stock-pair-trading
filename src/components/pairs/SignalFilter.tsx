import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/stores/appStore';

export const SignalFilter = () => {
  const showStrongSignalsOnly = useAppStore(
    (state) => state.showStrongSignalsOnly
  );
  const setShowStrongSignalsOnly = useAppStore(
    (state) => state.setShowStrongSignalsOnly
  );

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="strong-signals"
        checked={showStrongSignalsOnly}
        onCheckedChange={(checked) =>
          setShowStrongSignalsOnly(checked === true)
        }
        aria-label="只顯示強烈訊號"
      />
      <Label
        htmlFor="strong-signals"
        className="text-sm cursor-pointer select-none"
      >
        只顯示強烈訊號
      </Label>
    </div>
  );
};
