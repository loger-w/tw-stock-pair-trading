import { useQuery } from '@tanstack/react-query';
import { DISPOSAL_QUERY_KEYS } from '@/lib/disposal/constants';
import { fetchDisposalData } from '@/services/disposal/api';

/**
 * 取得處置系統資料的 Hook
 */
export const useDisposalData = () => {
  return useQuery({
    queryKey: DISPOSAL_QUERY_KEYS.all,
    queryFn: fetchDisposalData,
    staleTime: 5 * 60 * 1000, // 5 分鐘
    refetchOnWindowFocus: false,
  });
};
