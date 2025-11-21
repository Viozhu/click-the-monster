import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMonsterQuery, useDamageMonsterMutation } from '../api/monster';
import { useGameStore } from '../state/gameStore';
import { useState, useEffect, useRef } from 'react';
import { generateAttackPhrase } from '../utils/monsterUtils';

export const MonsterPanel = () => {
  const { t } = useTranslation();
  const { data: monster } = useMonsterQuery();
  const damageMutation = useDamageMonsterMutation();
  const clickDamage = useGameStore((state) => state.player.clickDamage);
  const [damageNumbers, setDamageNumbers] = useState<Array<{ id: number; value: number }>>([]);
  const [speechBubbles, setSpeechBubbles] = useState<Array<{ id: number; text: string; offsetX: number }>>([]);
  const [showSpawnEffect, setShowSpawnEffect] = useState(false);
  const [goldRewards, setGoldRewards] = useState<Array<{ id: number; amount: number }>>([]);
  const previousMonsterIdRef = useRef(monster.id);
  const previousHpRef = useRef(monster.currentHp);
  const previousMonsterRewardRef = useRef(monster.reward);
  const isInitialMount = useRef(true);
  const lastClickTimeRef = useRef<number>(Date.now());
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect new monster spawn and show gold reward
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousMonsterIdRef.current = monster.id;
      previousHpRef.current = monster.currentHp;
      previousMonsterRewardRef.current = monster.reward;
      return;
    }

    // When a new monster spawns (monster ID changes), it means the previous one died
    if (monster.id !== previousMonsterIdRef.current) {
      // Show spawn effect
      setShowSpawnEffect(true);
      const spawnTimer = setTimeout(() => setShowSpawnEffect(false), 1500);
      
      // Use the reward from the previous monster (the one that just died)
      const reward = previousMonsterRewardRef.current;
      if (reward > 0) {
        // Show gold notification when new monster appears
        const rewardId = Date.now();
        setGoldRewards((prev) => [...prev, { id: rewardId, amount: reward }]);
        
        // Remove after animation
        setTimeout(() => {
          setGoldRewards((prev) => prev.filter((r) => r.id !== rewardId));
        }, 2500);
      }
      
      // Update refs after showing notification
      previousMonsterIdRef.current = monster.id;
      previousMonsterRewardRef.current = monster.reward;
      
      // Cleanup timer on unmount or when monster changes again
      return () => {
        clearTimeout(spawnTimer);
      };
    }
    
    // Update HP ref
    previousHpRef.current = monster.currentHp;
  }, [monster.id, monster.reward, monster.currentHp]);

  // Set up initial idle timer
  useEffect(() => {
    if (!isInitialMount.current) {
      idleTimerRef.current = setTimeout(() => {
        showIdleProvocation();
      }, 3000);
    }
    
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [monster.id]);

  const handleClick = () => {
    damageMutation.mutate();
    
    // Update last click time
    lastClickTimeRef.current = Date.now();
    
    // Clear any existing idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    
    // Show floating damage number
    const id = Date.now();
    setDamageNumbers((prev) => [...prev, { id, value: clickDamage }]);
    
    // Remove after animation
    setTimeout(() => {
      setDamageNumbers((prev) => prev.filter((n) => n.id !== id));
    }, 1000);

    // Show random speech bubble only sometimes (10% chance)
    if (Math.random() < 0.1) {
      const bubbleId = Date.now() + Math.random();
      const phrase = generateAttackPhrase(t);
      const offsetX = (Math.random() - 0.5) * 100; // Random offset between -50 and 50
      setSpeechBubbles((prev) => [...prev, { id: bubbleId, text: phrase, offsetX }]);
      
      // Remove speech bubble after animation
      setTimeout(() => {
        setSpeechBubbles((prev) => prev.filter((b) => b.id !== bubbleId));
      }, 3000);
    }
    
    // Set up new idle timer (3 seconds of inactivity)
    idleTimerRef.current = setTimeout(() => {
      showIdleProvocation();
    }, 3000);
  };

  const showIdleProvocation = () => {
    const provocationPhrases = t('monster.idleProvocations', { returnObjects: true }) as string[];
    if (provocationPhrases && Array.isArray(provocationPhrases) && provocationPhrases.length > 0) {
      const bubbleId = Date.now() + Math.random();
      const phrase = provocationPhrases[Math.floor(Math.random() * provocationPhrases.length)];
      const offsetX = (Math.random() - 0.5) * 100;
      setSpeechBubbles((prev) => [...prev, { id: bubbleId, text: phrase, offsetX }]);
      
      // Remove speech bubble after animation
      setTimeout(() => {
        setSpeechBubbles((prev) => prev.filter((b) => b.id !== bubbleId));
      }, 4000);
    }
  };

  const hpPercentage = (monster.currentHp / monster.maxHp) * 100;

  return (
    <>
      {/* Gold Reward Notification - Outside container for better visibility */}
      <AnimatePresence>
        {goldRewards.map((reward) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 1, 0], 
              scale: [0.5, 1.1, 1, 1, 0.95],
              y: [-150, -150, -150, -180]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 2.5,
              times: [0, 0.2, 0.5, 0.8, 1],
              ease: "easeOut"
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              zIndex: 9999,
              willChange: 'transform, opacity'
            }}
          >
            <div 
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-full px-4 py-2 flex items-center gap-2"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 215, 0, 0.6), inset 0 1px 5px rgba(255, 255, 255, 0.3)',
                border: '2px solid #f59e0b',
                backdropFilter: 'blur(8px)',
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-xl"
                style={{ filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))' }}
              >
                🪙
              </motion.span>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-semibold text-yellow-900 uppercase tracking-wide" style={{ textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.2)' }}>
                  {t('monster.goldEarned')}
                </span>
                <span 
                  className="text-lg font-bold text-yellow-900"
                  style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}
                >
                  +{reward.amount.toFixed(2)}
                </span>
              </div>
              <motion.span
                animate={{ rotate: [0, 360], scale: [1, 1.05, 1] }}
                transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }}
                className="text-xl"
                style={{ filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))' }}
              >
                💰
              </motion.span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex flex-col items-center justify-center p-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="cursor-pointer select-none relative"
        >
          <div className="relative">
          {/* Spawn Effect - Glow Ring */}
          {showSpawnEffect && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-red-500 to-orange-500 blur-xl pointer-events-none z-0"
              style={{ 
                width: '256px',
                height: '256px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}

          {/* Spawn Effect - Flash */}
          {showSpawnEffect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-full bg-white pointer-events-none z-5"
              style={{ 
                width: '256px',
                height: '256px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                mixBlendMode: 'overlay'
              }}
            />
          )}

          {/* "NEW MONSTER!" Text */}
          {showSpawnEffect && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: [-20, -60, -60, -80], scale: [0.5, 1.2, 1, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none z-30"
            >
              <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 text-white px-8 py-2 rounded-full font-bold text-xl shadow-2xl border-2 border-white whitespace-nowrap min-w-fit">
                {t('monster.newMonster')}
              </div>
            </motion.div>
          )}

          {/* Monster Image from Robohash */}
          <motion.div
            key={monster.id}
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotate: 0
            }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-red-900 bg-gray-200 relative z-10"
            style={{
              filter: showSpawnEffect ? 'drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))' : 'none',
              transition: 'filter 0.3s ease-out'
            }}
          >
            <img
              src={monster.imageUrl}
              alt={monster.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to emoji if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800"><div class="text-white text-6xl">👹</div></div>';
                }
              }}
            />
          </motion.div>
          
          {/* Floating damage numbers */}
          {damageNumbers.map((damage) => (
            <motion.div
              key={damage.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
              animate={{ 
                opacity: [1, 1, 0], 
                y: -80, 
                x: Math.random() * 60 - 30,
                scale: [0.5, 1.3, 1.2]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
              style={{
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 10px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 0, 0, 0.3)',
                filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))',
              }}
            >
              <span 
                className="text-4xl font-extrabold text-red-500"
                style={{
                  WebkitTextStroke: '2px rgba(255, 255, 255, 0.9)',
                  paintOrder: 'stroke fill',
                }}
              >
                -{damage.value.toFixed(1)}
              </span>
            </motion.div>
          ))}

          {/* Comic-style speech bubbles */}
          <AnimatePresence>
            {speechBubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: -80,
                  x: bubble.offsetX
                }}
                exit={{ opacity: 0, scale: 0.5, y: -100 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  duration: 0.3
                }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none z-20"
                style={{ 
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                }}
              >
                {/* Speech bubble */}
                <div className="relative bg-white rounded-2xl px-4 py-2 border-2 border-black shadow-lg max-w-xs">
                  <p className="text-sm font-bold text-gray-900 text-center whitespace-nowrap">
                    {bubble.text}
                  </p>
                  {/* Speech bubble tail */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '12px solid transparent',
                      borderRight: '12px solid transparent',
                      borderTop: '16px solid white',
                      filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.3))'
                    }}
                  />
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '14px solid transparent',
                      borderRight: '14px solid transparent',
                      borderTop: '18px solid black',
                      marginTop: '-1px',
                      zIndex: -1
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Monster Info */}
      <div className="mt-6 text-center">
        <motion.h2
          key={monster.id}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl font-bold mb-3 px-4 py-2 rounded-lg inline-block"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(255, 255, 255, 0.6)',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)',
            color: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.7)',
          }}
        >
          {monster.name}
        </motion.h2>
        
        {/* HP Bar */}
        <div className="w-80 bg-gray-200 rounded-full h-8 mb-2 overflow-hidden relative">
          <motion.div
            initial={{ width: `${hpPercentage}%` }}
            animate={{ width: `${hpPercentage}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-red-500 to-red-600"
          />
          {/* HP Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {t('monster.hp')}: {monster.currentHp.toFixed(1)} / {monster.maxHp.toFixed(1)}
            </span>
          </div>
        </div>
        
      </div>
    </div>
    </>
  );
};

