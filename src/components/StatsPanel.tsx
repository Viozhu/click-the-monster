import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePlayerQuery } from '../api/player';
import { useMonsterQuery } from '../api/monster';

interface StatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsPanel = ({ isOpen, onClose }: StatsPanelProps) => {
  const { t } = useTranslation();
  const { data: player } = usePlayerQuery();
  const { data: monster } = useMonsterQuery();

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
            className="fixed left-0 top-0 h-full w-100 bg-white shadow-2xl z-50 overflow-y-auto lg:fixed lg:top-0 lg:h-full lg:shadow-lg lg:rounded-lg"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span>📊</span>
                  {t('stats.title')}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label={t('stats.close')}
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Gold */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🪙</span>
                    <span className="text-gray-700 font-semibold">{t('stats.gold')}:</span>
                  </div>
                  <span className="text-yellow-600 font-bold text-xl">
                    {player.gold.toFixed(2)}
                  </span>
                </div>
                
                {/* Click Damage */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-2 border-red-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚔️</span>
                    <span className="text-gray-700 font-semibold">{t('stats.clickDamage')}:</span>
                  </div>
                  <span className="text-red-600 font-bold text-xl">
                    {player.clickDamage.toFixed(2)}
                  </span>
                </div>
                
                {/* DPS */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    <span className="text-gray-700 font-semibold">{t('stats.dps')}:</span>
                  </div>
                  <span className="text-blue-600 font-bold text-xl">
                    {player.dps.toFixed(2)}/s
                  </span>
                </div>
                
                {/* Monster Level */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 mt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👹</span>
                    <span className="text-gray-700 font-semibold">{t('stats.monsterLevel')}:</span>
                  </div>
                  <span className="text-purple-600 font-bold text-xl">
                    {monster.level}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

