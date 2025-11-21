import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useGameStore } from '../state/gameStore';
import { queryKeys } from './queryKeys';

export const useMonsterQuery = () => {
  const monster = useGameStore((state) => state.monster);
  
  return useQuery({
    queryKey: queryKeys.monster,
    queryFn: () => monster,
    initialData: monster,
    refetchInterval: 100, // Update frequently for real-time feel
  });
};

export const useDamageMonsterMutation = () => {
  const queryClient = useQueryClient();
  const damageMonster = useGameStore((state) => state.damageMonster);
  const clickDamage = useGameStore((state) => state.player.clickDamage);

  return useMutation({
    mutationFn: async () => {
      damageMonster(clickDamage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monster });
      queryClient.invalidateQueries({ queryKey: queryKeys.player });
    },
  });
};

export const useSpawnMonsterMutation = () => {
  const queryClient = useQueryClient();
  const spawnMonster = useGameStore((state) => state.spawnMonster);

  return useMutation({
    mutationFn: async () => {
      spawnMonster();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monster });
    },
  });
};

