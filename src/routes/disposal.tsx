import { createFileRoute } from '@tanstack/react-router';
import { DisposalOverview } from '@/components/disposal/DisposalOverview';

export const Route = createFileRoute('/disposal')({
  component: DisposalPage,
});

function DisposalPage() {
  return <DisposalOverview />;
}
