// Monster
export interface Monster {
  id: number;
  name: string;
  maxHp: number;
  currentHp: number;
  reward: number;
  level: number;
  imageUrl: string;
}

// Upgrade
export interface Upgrade {
  id: number;
  name: string;
  type: "click" | "dps";
  value: number;
  cost: number;
  timesBought: number;
  baseCost: number;
}

// Player
export interface Player {
  gold: number;
  clickDamage: number;
  dps: number;
  upgrades: Upgrade[];
}

// Game State
export interface GameState {
  player: Player;
  monster: Monster;
  damageMonster: (amount: number) => void;
  spawnMonster: () => void;
  addGold: (amount: number) => void;
  buyUpgrade: (id: number) => void;
  applyDps: () => void;
}

