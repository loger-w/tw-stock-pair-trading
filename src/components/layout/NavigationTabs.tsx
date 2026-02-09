import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface TabItem {
  path: string;
  label: string;
  ariaLabel: string;
}

const TABS: TabItem[] = [
  { path: '/pairs', label: '雙刀戰法', ariaLabel: '切換至雙刀戰法頁面' },
  { path: '/disposal', label: '處置系統', ariaLabel: '切換至處置系統頁面' },
];

export const NavigationTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    index: number
  ) => {
    if (e.key === 'ArrowRight' && index < TABS.length - 1) {
      e.preventDefault();
      const nextTab = document.querySelector(
        `[data-tab-index="${index + 1}"]`
      ) as HTMLElement;
      nextTab?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevTab = document.querySelector(
        `[data-tab-index="${index - 1}"]`
      ) as HTMLElement;
      prevTab?.focus();
    }
  };

  return (
    <nav
      className="flex border-b border-border"
      role="tablist"
      aria-label="主要導航"
    >
      {TABS.map((tab, index) => {
        const isActive = currentPath === tab.path;

        return (
          <Link
            key={tab.path}
            to={tab.path}
            role="tab"
            tabIndex={0}
            aria-selected={isActive}
            aria-label={tab.ariaLabel}
            data-tab-index={index}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium text-center transition-colors',
              'hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive
                ? 'border-b-2 border-primary text-primary bg-accent/50'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};
