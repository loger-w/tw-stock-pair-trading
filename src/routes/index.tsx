import { createFileRoute } from '@tanstack/react-router';
import { PairsOverview } from '@/components/pairs/PairsOverview';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return <PairsOverview />;
}
