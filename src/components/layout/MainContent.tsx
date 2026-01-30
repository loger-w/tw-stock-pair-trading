import type { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MainContentProps {
  children: ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  return (
    <main className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6">{children}</div>
      </ScrollArea>
    </main>
  );
};
