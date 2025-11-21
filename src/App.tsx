import { useState, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MonsterPanel } from './components/MonsterPanel';
import { StatsPanel } from './components/StatsPanel';
import { UpgradeShop } from './components/UpgradeShop';
import { UpgradesBar } from './components/UpgradesBar';
import { LanguageSelector } from './components/LanguageSelector';
import { useDps } from './hooks/useDps';
import { usePlayerQuery } from './api/player';
import { useUpgradesQuery } from './api/upgrades';
import { useMonsterQuery } from './api/monster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
});

const GameContent = () => {
  const { t } = useTranslation();
  useDps();
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const { data: player } = usePlayerQuery();
  const { data: upgrades } = useUpgradesQuery();
  const { data: monster } = useMonsterQuery();
  
  // Filter purchased upgrades for floating buttons
  const purchasedUpgrades = upgrades?.filter((upgrade) => upgrade.timesBought > 0) || [];

  // Check if there are affordable upgrades
  const hasAffordableUpgrades = useMemo(() => {
    if (!player || !upgrades) return false;
    return upgrades.some(upgrade => player.gold >= upgrade.cost);
  }, [player, upgrades]);

  // Color palettes for different level ranges
  const colorPalettes = [
    ['#667eea', '#764ba2'], // Purple - Levels 1-4
    ['#f093fb', '#f5576c'], // Pink to Red - Levels 5-9
    ['#4facfe', '#00f2fe'], // Blue - Levels 10-14
    ['#43e97b', '#38f9d7'], // Green to Cyan - Levels 15-19
    ['#fa709a', '#fee140'], // Pink to Yellow - Levels 20-24
    ['#30cfd0', '#330867'], // Cyan to Dark Purple - Levels 25-29
    ['#a8edea', '#fed6e3'], // Light Cyan to Pink - Levels 30-34
    ['#ff9a9e', '#fecfef'], // Pink - Levels 35-39
    ['#ffecd2', '#fcb69f'], // Orange - Levels 40-44
    ['#ff6e7f', '#bfe9ff'], // Pink to Blue - Levels 45-49
    ['#2c3e50', '#34495e'], // Dark Blue Gray - Levels 50-54
    ['#1a1a2e', '#16213e'], // Dark Navy - Levels 55-59
    ['#0f0c29', '#302b63'], // Deep Purple - Levels 60-64
    ['#232526', '#414345'], // Dark Gray - Levels 65-69
    ['#1e3c72', '#2a5298'], // Dark Blue - Levels 70+
  ];

  // Change background every 5 levels
  useEffect(() => {
    if (!monster) return;
    
    // Calculate which palette to use based on level
    // Every 5 levels, change the background
    // Level 1-4: palette 0, Level 5-9: palette 1, Level 10-14: palette 2, etc.
    const paletteIndex = Math.floor((monster.level - 1) / 5);
    const selectedPalette = colorPalettes[Math.min(paletteIndex, colorPalettes.length - 1)];
    
    setGradientColors(selectedPalette);
  }, [monster?.level]);

  const backgroundStyle = gradientColors.length > 0
    ? {
        background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
        backgroundSize: '200% 200%',
        animation: 'gradientShift 15s ease infinite',
      }
    : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };

  return (
    <div 
      className="min-h-screen pb-20 md:pb-24 relative overflow-x-hidden"
      style={backgroundStyle}
    >
      {/* Language Selector */}
      <LanguageSelector />

      {/* Floating Upgrade Buttons - Mobile Only */}
      {purchasedUpgrades.length > 0 && (
        <div className="md:hidden fixed right-2 bottom-20 z-30 flex flex-col gap-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {purchasedUpgrades.map((upgrade) => {
            const getUpgradeNameKey = (id: number): string => {
              const nameMap: Record<number, string> = {
                1: 'upgrades.sharpClaws',
                2: 'upgrades.powerStrike',
                3: 'upgrades.autoAttack',
                4: 'upgrades.rapidFire',
              };
              return nameMap[id] || `upgrade.${id}`;
            };
            
            const upgradeName = t(getUpgradeNameKey(upgrade.id));
            const upgradeIcon = upgrade.type === 'click' ? '⚔️' : '⚡';
            
            return (
              <motion.div
                key={upgrade.id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2 min-w-[120px]"
              >
                <span className="text-lg">{upgradeIcon}</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-gray-800 truncate">
                    {upgradeName}
                  </span>
                  <span className="text-[10px] bg-blue-500 text-white rounded-full px-1.5 py-0.5 font-bold inline-block w-fit">
                    ×{upgrade.timesBought}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="container mx-auto px-2 sm:px-4 pb-8 pt-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center lg:items-start justify-center min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-140px)]">
          {/* Center - Monster */}
          <div className="flex items-center justify-center w-full flex-1 min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
            <div className="flex-1 flex justify-center">
              <MonsterPanel />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Panel (overlay on mobile, sidebar on desktop) */}
      <StatsPanel isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
      
      {/* Shop Panel (overlay on mobile, sidebar on desktop) */}
      <UpgradeShop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
      
      {/* Bottom Upgrades Bar */}
      <UpgradesBar 
        isStatsOpen={isStatsOpen}
        setIsStatsOpen={setIsStatsOpen}
        isShopOpen={isShopOpen}
        setIsShopOpen={setIsShopOpen}
        hasAffordableUpgrades={hasAffordableUpgrades}
      />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameContent />
    </QueryClientProvider>
  );
}

export default App;

