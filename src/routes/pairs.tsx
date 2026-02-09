import { createFileRoute } from '@tanstack/react-router';
import { PairsOverview } from '@/components/pairs/PairsOverview';

export const Route = createFileRoute('/pairs')({
  component: PairsPage,
});

function PairsPage() {
  return <PairsOverview />;
}
