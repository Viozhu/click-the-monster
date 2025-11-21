import { useQuery } from '@tanstack/react-query';
import { useGameStore } from '../state/gameStore';
import { queryKeys } from './queryKeys';

export const usePlayerQuery = () => {
  const player = useGameStore((state) => state.player);
  
  return useQuery({
    queryKey: queryKeys.player,
    queryFn: () => player,
    initialData: player,
    refetchInterval: 100, // Update frequently for real-time feel
  });
};

