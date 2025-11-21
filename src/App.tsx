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
      className="min-h-screen pb-20 relative"
      style={backgroundStyle}
    >
      {/* Language Selector */}
      <LanguageSelector />

      {/* Floating Stats Icon Button - Left */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsStatsOpen(!isStatsOpen)}
        className={`fixed left-2 lg:left-4 top-1/2 -translate-y-1/2 z-30 p-3 lg:p-4 rounded-full shadow-2xl transition-all ${
          isStatsOpen
            ? 'bg-blue-600 text-white'
            : 'bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white'
        }`}
        aria-label={t('common.toggleStats')}
      >
        <svg
          className="w-6 h-6 lg:w-8 lg:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </motion.button>

      {/* Floating Cart Icon Button - Right */}
      <div className="fixed right-2 lg:right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsShopOpen(!isShopOpen)}
          className={`p-3 lg:p-4 rounded-full shadow-2xl transition-all relative flex items-center justify-center ${
            isShopOpen
              ? 'bg-green-600 text-white'
              : 'bg-white/90 backdrop-blur-sm text-green-600 hover:bg-white'
          }`}
          aria-label={t('common.toggleShop')}
        >
          <svg
            className="w-6 h-6 lg:w-8 lg:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          
          {/* Notification Badge */}
          {hasAffordableUpgrades && !isShopOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/2 -translate-y-1/2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                !
              </motion.span>
            </motion.div>
          )}
        </motion.button>
      </div>

      

      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
          {/* Left Sidebar - Stats */}
          <div className="w-full lg:w-80">
            <StatsPanel isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
          </div>
          
          {/* Center - Monster */}
          <div className="flex items-center justify-center h-screen">
          <div className="flex-1 flex justify-center">
            <MonsterPanel />
          </div>
          </div>
          {/* Right Sidebar - Shop */}
          <div className="w-full lg:w-80">
            <UpgradeShop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
          </div>
        </div>
      </div>
      
      {/* Bottom Upgrades Bar */}
      <UpgradesBar />
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

