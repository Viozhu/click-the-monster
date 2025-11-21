import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUpgradesQuery } from '../api/upgrades';
import { useBuyUpgradeMutation } from '../api/upgrades';
import { usePlayerQuery } from '../api/player';

interface UpgradeShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeShop = ({ isOpen, onClose }: UpgradeShopProps) => {
  const { t } = useTranslation();
  const { data: upgrades } = useUpgradesQuery();
  const { data: player } = usePlayerQuery();
  const buyMutation = useBuyUpgradeMutation();

  const handleBuy = (id: number, cost: number) => {
    if (player.gold >= cost) {
      buyMutation.mutate(id);
    }
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-100 bg-white shadow-2xl z-50 overflow-y-auto lg:fixed lg:top-0 lg:h-full lg:shadow-lg lg:rounded-lg"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span>🛒</span>
                  {t('shop.title')}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label={t('shop.close')}
                >
                  ×
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 pt-4">
                <div className="space-y-3">
                  {upgrades.map((upgrade) => {
                    const canAfford = player.gold >= upgrade.cost;
                    const effectText = upgrade.type === 'click' 
                      ? `+${upgrade.value.toFixed(1)} ${t('shop.clickDamage')}`
                      : `+${upgrade.value.toFixed(1)} ${t('shop.dps')}`;
                    
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
                    
                    // Get icon based on upgrade ID
                    const getUpgradeIcon = (id: number, type: string) => {
                      if (id === 1) return '⚔️'; // Sharp Claws
                      if (id === 2) return '💥'; // Power Strike
                      if (id === 3) return '⚡'; // Auto Attack
                      if (id === 4) return '🔥'; // Rapid Fire
                      return type === 'click' ? '⚔️' : '⚡';
                    };
                    
                    const upgradeName = t(getUpgradeNameKey(upgrade.id));
                    const upgradeIcon = getUpgradeIcon(upgrade.id, upgrade.type);
                    
                    return (
                      <motion.div
                        key={upgrade.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`border-2 rounded-lg p-4 transition-all ${
                          canAfford 
                            ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white hover:shadow-md' 
                            : 'border-gray-200 bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-3xl">{upgradeIcon}</div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                {upgradeName}
                                {upgrade.timesBought > 0 && (
                                  <span className="text-xs bg-green-500 text-white rounded-full px-2 py-0.5 font-bold">
                                    ×{upgrade.timesBought}
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                {upgrade.type === 'click' ? '⚔️' : '⚡'}
                                {effectText}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-1">
                            <span className="text-xl">🪙</span>
                            <p className="text-yellow-600 font-bold text-lg">
                              {upgrade.cost.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleBuy(upgrade.id, upgrade.cost)}
                          disabled={!canAfford}
                          className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            canAfford
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? (
                            <>
                              <span>✅</span>
                              {t('shop.buyNow')}
                            </>
                          ) : (
                            <>
                              <span>🔒</span>
                              {t('shop.notEnoughGold')}
                            </>
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

