import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUpgradesQuery } from '../api/upgrades';

interface PurchasedUpgradesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PurchasedUpgradesPanel = ({ isOpen, onClose }: PurchasedUpgradesPanelProps) => {
  const { t } = useTranslation();
  const { data: upgrades } = useUpgradesQuery();

  // Filter to only show upgrades that have been purchased
  const purchasedUpgrades = upgrades?.filter((upgrade) => upgrade.timesBought > 0) || [];

  const getUpgradeNameKey = (id: number): string => {
    const nameMap: Record<number, string> = {
      1: 'upgrades.sharpClaws',
      2: 'upgrades.powerStrike',
      3: 'upgrades.autoAttack',
      4: 'upgrades.rapidFire',
    };
    return nameMap[id] || `upgrade.${id}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto lg:max-w-none lg:w-80 lg:rounded-lg"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">⚡</span>
                  {t('upgrades.title')}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl lg:hidden"
                  aria-label={t('upgrades.close')}
                >
                  ×
                </button>
              </div>
              
              {purchasedUpgrades.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">{t('upgrades.noUpgrades')}</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {purchasedUpgrades.map((upgrade) => {
                    const upgradeName = t(getUpgradeNameKey(upgrade.id));
                    const upgradeIcon = upgrade.type === 'click' ? '⚔️' : '⚡';
                    
                    return (
                      <motion.div
                        key={upgrade.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="text-2xl sm:text-3xl flex-shrink-0">{upgradeIcon}</span>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-gray-800 font-semibold text-sm sm:text-base truncate">
                              {upgradeName}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-600">
                              {upgrade.type === 'click' ? t('shop.clickDamage') : t('shop.dps')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-lg sm:text-xl font-bold text-blue-600 bg-blue-100 rounded-full px-3 py-1">
                            ×{upgrade.timesBought}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

