import { useEffect } from 'react';
import { useGameStore } from '../state/gameStore';

export const useDps = () => {
  const applyDps = useGameStore((state) => state.applyDps);
  const dps = useGameStore((state) => state.player.dps);

  useEffect(() => {
    if (dps <= 0) return;

    const interval = setInterval(() => {
      applyDps();
    }, 1000);

    return () => clearInterval(interval);
  }, [dps, applyDps]);
};

