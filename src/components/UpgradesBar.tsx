import { useTranslation } from 'react-i18next';
import { useUpgradesQuery } from '../api/upgrades';
import { usePlayerQuery } from '../api/player';
import { motion } from 'framer-motion';

interface UpgradesBarProps {
  isStatsOpen: boolean;
  setIsStatsOpen: (open: boolean) => void;
  isShopOpen: boolean;
  setIsShopOpen: (open: boolean) => void;
  hasAffordableUpgrades: boolean;
}

export const UpgradesBar = ({ 
  isStatsOpen, 
  setIsStatsOpen, 
  isShopOpen, 
  setIsShopOpen,
  hasAffordableUpgrades 
}: UpgradesBarProps) => {
  const { t } = useTranslation();
  const { data: upgrades } = useUpgradesQuery();
  const { data: player } = usePlayerQuery();

  // Filter to only show upgrades that have been purchased
  const purchasedUpgrades = upgrades.filter((upgrade) => upgrade.timesBought > 0);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30"
    >
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4 md:justify-between">
          {/* Left Section: Stats Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsStatsOpen(!isStatsOpen)}
            className={`flex-shrink-0 p-2 sm:p-2.5 rounded-full shadow-md transition-all ${
              isStatsOpen
                ? 'bg-blue-600 text-white'
                : 'bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50'
            }`}
            aria-label={t('common.toggleStats')}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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

          {/* Middle Section: Gold + Upgrades */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 md:flex-initial md:flex-shrink-0">
            {/* Gold Display - Full width on mobile */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 shadow-md border-2 border-yellow-600 flex-1 md:flex-initial md:flex-shrink-0"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <circle cx="12" cy="12" r="8" fill="#FCD34D" />
                <path d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#F59E0B" />
                <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#92400E" fontWeight="bold">$</text>
              </svg>
              <span className="text-sm sm:text-base md:text-lg font-bold text-yellow-900 whitespace-nowrap">
                {player.gold.toFixed(2)}
              </span>
            </motion.div>

            {/* Upgrades Section - Hidden on mobile, shown on desktop */}
            {purchasedUpgrades.length > 0 && (
              <div className="hidden md:flex items-center gap-2 lg:gap-4 overflow-x-auto scrollbar-hide">
                <div className="h-6 lg:h-8 w-px bg-gray-300 flex-shrink-0" />
                <span className="text-xs lg:text-sm font-semibold text-gray-700 whitespace-nowrap flex-shrink-0">
                  {t('upgrades.yourUpgrades')}
                </span>
                {purchasedUpgrades.map((upgrade) => {
                  // Get translation key for upgrade name based on ID
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
                  
                  return (
                    <motion.div
                      key={upgrade.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 lg:gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 whitespace-nowrap flex-shrink-0"
                    >
                      <span className="text-xs lg:text-sm font-semibold text-gray-800">
                        {upgradeName}
                      </span>
                    <span className="text-[10px] lg:text-xs bg-blue-500 text-white rounded-full px-1.5 lg:px-2 py-0.5 font-bold">
                      ×{upgrade.timesBought}
                    </span>
                    <span className="text-xs text-gray-600">
                      {upgrade.type === 'click' ? '⚔️' : '⚡'}
                    </span>
                  </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Section: Cart Button - Pushed to right end on desktop */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsShopOpen(!isShopOpen)}
            className={`flex-shrink-0 p-2 sm:p-2.5 rounded-full shadow-md transition-all relative md:ml-auto ${
              isShopOpen
                ? 'bg-green-600 text-white'
                : 'bg-white border-2 border-green-200 text-green-600 hover:bg-green-50'
            }`}
            aria-label={t('common.toggleShop')}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-lg border-2 border-white -translate-y-1 translate-x-1"
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
      </div>
    </motion.div>
  );
};

