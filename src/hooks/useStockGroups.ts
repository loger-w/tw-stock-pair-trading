import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addStockToGroup,
  removeStockFromGroup,
  generateId,
} from '@/services/db';
import type { StockGroup } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';

/**
 * Hook to get all stock groups
 */
export const useStockGroups = () => {
  return useQuery({
    queryKey: QUERY_KEYS.groups,
    queryFn: getAllGroups,
  });
};

/**
 * Hook to get a single group by ID
 */
export const useStockGroup = (groupId: string | null) => {
  return useQuery({
    queryKey: groupId ? QUERY_KEYS.group(groupId) : ['groups', null],
    queryFn: () => (groupId ? getGroup(groupId) : null),
    enabled: !!groupId,
  });
};

/**
 * Hook to create a new group
 */
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const newGroup: StockGroup = {
        id: generateId(),
        name,
        stockIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await createGroup(newGroup);
      return newGroup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups });
    },
  });
};

/**
 * Hook to update a group
 */
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (group: StockGroup) => {
      const updated = { ...group, updatedAt: Date.now() };
      await updateGroup(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.group(updated.id) });
    },
  });
};

/**
 * Hook to delete a group
 */
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups });
    },
  });
};

/**
 * Hook to add a stock to a group
 */
export const useAddStockToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      stockId,
    }: {
      groupId: string;
      stockId: string;
    }) => {
      return addStockToGroup(groupId, stockId);
    },
    onSuccess: (result) => {
      if (result) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.group(result.id) });
      }
    },
  });
};

/**
 * Hook to remove a stock from a group
 */
export const useRemoveStockFromGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      stockId,
    }: {
      groupId: string;
      stockId: string;
    }) => {
      return removeStockFromGroup(groupId, stockId);
    },
    onSuccess: (result) => {
      if (result) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.group(result.id) });
      }
    },
  });
};
