import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useGameStore } from '../state/gameStore';
import { queryKeys } from './queryKeys';

export const useUpgradesQuery = () => {
  const upgrades = useGameStore((state) => state.player.upgrades);
  
  return useQuery({
    queryKey: queryKeys.upgrades,
    queryFn: () => upgrades,
    initialData: upgrades,
    refetchInterval: 100,
  });
};

export const useBuyUpgradeMutation = () => {
  const queryClient = useQueryClient();
  const buyUpgrade = useGameStore((state) => state.buyUpgrade);

  return useMutation({
    mutationFn: async (id: number) => {
      buyUpgrade(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.player });
      queryClient.invalidateQueries({ queryKey: queryKeys.upgrades });
    },
  });
};

