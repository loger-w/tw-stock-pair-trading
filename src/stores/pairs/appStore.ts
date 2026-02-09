import { create } from 'zustand';
import type { AnalysisPeriod } from '@/types/pairs';
import { DEFAULT_ANALYSIS_PERIOD } from '@/lib/pairs/constants';

interface AppState {
  // Selected group
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;

  // Analysis period
  analysisPeriod: AnalysisPeriod;
  setAnalysisPeriod: (period: AnalysisPeriod) => void;

  // Signal filter
  showStrongSignalsOnly: boolean;
  setShowStrongSignalsOnly: (show: boolean) => void;

  // Expanded pair (accordion)
  expandedPairId: string | null;
  setExpandedPairId: (id: string | null) => void;

  // Reset state when group changes
  resetGroupState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  selectedGroupId: null,
  analysisPeriod: DEFAULT_ANALYSIS_PERIOD,
  showStrongSignalsOnly: false,
  expandedPairId: null,

  // Actions
  setSelectedGroupId: (id) =>
    set({
      selectedGroupId: id,
      expandedPairId: null, // Reset expanded pair when group changes
    }),

  setAnalysisPeriod: (period) =>
    set({
      analysisPeriod: period,
      expandedPairId: null, // Reset expanded pair when period changes
    }),

  setShowStrongSignalsOnly: (show) => set({ showStrongSignalsOnly: show }),

  setExpandedPairId: (id) => set({ expandedPairId: id }),

  resetGroupState: () =>
    set({
      expandedPairId: null,
      showStrongSignalsOnly: false,
    }),
}));
