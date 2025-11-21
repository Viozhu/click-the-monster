import { useTranslation } from 'react-i18next';
import { useUpgradesQuery } from '../api/upgrades';
import { usePlayerQuery } from '../api/player';
import { motion } from 'framer-motion';

export const UpgradesBar = () => {
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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 overflow-x-auto">
          {/* Gold Display with Coin Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg px-4 py-2 shadow-md border-2 border-yellow-600 whitespace-nowrap"
          >
            <svg
              className="w-7 h-7 text-yellow-800"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <circle cx="12" cy="12" r="8" fill="#FCD34D" />
              <path d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#F59E0B" />
              <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#92400E" fontWeight="bold">$</text>
            </svg>
            <span className="text-lg font-bold text-yellow-900">
              {player.gold.toFixed(2)}
            </span>
          </motion.div>

          {/* Upgrades Section */}
          {purchasedUpgrades.length > 0 && (
            <>
              <div className="h-8 w-px bg-gray-300" />
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
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
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-3 py-2 whitespace-nowrap"
                  >
                    <span className="text-sm font-semibold text-gray-800">
                      {upgradeName}
                    </span>
                  <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-0.5 font-bold">
                    ×{upgrade.timesBought}
                  </span>
                  <span className="text-xs text-gray-600">
                    {upgrade.type === 'click' ? '⚔️' : '⚡'}
                  </span>
                </motion.div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

