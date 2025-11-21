import { create } from 'zustand';
import { nanoid } from 'nanoid';
import i18n from '../i18n/config';
import type { Monster, Upgrade, GameState } from '../types';
import { generateMonsterName, generateMonsterImageUrl } from '../utils/monsterUtils';

// Initial upgrades - More affordable for easier start
const initialUpgrades: Upgrade[] = [
  {
    id: 1,
    name: "Sharp Claws",
    type: "click",
    value: 0.2, // Increased from 0.1
    cost: 5, // Reduced from 10
    timesBought: 0,
    baseCost: 5,
  },
  {
    id: 2,
    name: "Power Strike",
    type: "click",
    value: 0.5,
    cost: 25, // Reduced from 50
    timesBought: 0,
    baseCost: 25,
  },
  {
    id: 3,
    name: "Auto Attack",
    type: "dps",
    value: 0.1,
    cost: 10, // Reduced from 25
    timesBought: 0,
    baseCost: 10,
  },
  {
    id: 4,
    name: "Rapid Fire",
    type: "dps",
    value: 0.5,
    cost: 50, // Reduced from 100
    timesBought: 0,
    baseCost: 50,
  },
];

// Monster scaling formulas
// Easier at start, gradually increases difficulty
const calculateMonsterHp = (level: number): number => {
  // Level 1: 5 HP (easy start)
  // Uses a gentler scaling curve: base * (1.15^(level-1))
  // This makes early levels easier and scaling more gradual
  if (level === 1) return 5;
  return 5 * Math.pow(1.15, level - 1);
};

const calculateMonsterReward = (level: number): number => {
  // Level 1: 5 gold (more rewarding)
  // Scales with level to keep rewards meaningful
  if (level === 1) return 5;
  return 5 * Math.pow(1.18, level - 1);
};

// Calculate player stats from upgrades
const calculateClickDamage = (upgrades: Upgrade[]): number => {
  // Increased base damage for easier start
  return upgrades
    .filter((u) => u.type === "click")
    .reduce((sum, u) => sum + u.value * u.timesBought, 0.2); // Base 0.2 (was 0.1)
};

const calculateDps = (upgrades: Upgrade[]): number => {
  return upgrades
    .filter((u) => u.type === "dps")
    .reduce((sum, u) => sum + u.value * u.timesBought, 0); // Base 0
};

// Create initial monster
const createMonster = (level: number = 1): Monster => {
  const maxHp = calculateMonsterHp(level);
  const uniqueId = nanoid();
  const randomName = generateMonsterName((key: string, options?: any) => i18n.t(key, options));
  const imageUrl = generateMonsterImageUrl(uniqueId);
  
  return {
    id: Date.now(),
    name: `${randomName} (Lv.${level})`,
    maxHp,
    currentHp: maxHp,
    reward: calculateMonsterReward(level),
    level,
    imageUrl,
  };
};

export const useGameStore = create<GameState>((set, get) => {
  const initialState: GameState = {
    player: {
      gold: 0,
      clickDamage: 0.2, // Increased from 0.1 for easier start
      dps: 0,
      upgrades: initialUpgrades,
    },
    monster: createMonster(1),
    damageMonster: (amount: number) => {
      const state = get();
      const newHp = Math.max(0, state.monster.currentHp - amount);
      
      set({
        monster: {
          ...state.monster,
          currentHp: newHp,
        },
      });

      // If monster dies, reward gold and spawn new one
      if (newHp <= 0) {
        const reward = state.monster.reward;
        const newLevel = state.monster.level + 1;
        
        set((prevState) => ({
          player: {
            ...prevState.player,
            gold: prevState.player.gold + reward,
          },
          monster: createMonster(newLevel),
        }));
      }
    },
    spawnMonster: () => {
      const state = get();
      const newLevel = state.monster.level + 1;
      set({
        monster: createMonster(newLevel),
      });
    },
    addGold: (amount: number) => {
      set((state) => ({
        player: {
          ...state.player,
          gold: state.player.gold + amount,
        },
      }));
    },
    buyUpgrade: (id: number) => {
      set((state) => {
        const upgrade = state.player.upgrades.find((u) => u.id === id);
        if (!upgrade || state.player.gold < upgrade.cost) {
          return state;
        }

        const updatedUpgrades = state.player.upgrades.map((u) => {
          if (u.id === id) {
            const newTimesBought = u.timesBought + 1;
            const newCost = u.baseCost * Math.pow(1.15, newTimesBought);
            return {
              ...u,
              timesBought: newTimesBought,
              cost: newCost,
            };
          }
          return u;
        });

        const newClickDamage = calculateClickDamage(updatedUpgrades);
        const newDps = calculateDps(updatedUpgrades);

        return {
          player: {
            ...state.player,
            gold: state.player.gold - upgrade.cost,
            clickDamage: newClickDamage,
            dps: newDps,
            upgrades: updatedUpgrades,
          },
        };
      });
    },
    applyDps: () => {
      const state = get();
      if (state.player.dps > 0) {
        state.damageMonster(state.player.dps);
      }
    },
  };

  return initialState;
});

