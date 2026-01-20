import { useState } from 'react';
import { motion } from 'framer-motion';
import { GLSLHills } from '@/components/ui/glsl-hills';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen = ({ onStart }: SplashScreenProps) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    // Small delay for smoother transition
    setTimeout(() => {
      onStart();
    }, 300);
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 via-blue-500 to-cyan-500">
      {/* Colorful gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/30 via-blue-400/30 to-cyan-400/30 z-[2]"></div>
      
      <GLSLHills />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 pointer-events-auto z-10 text-center absolute"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-bold text-5xl md:text-7xl whitespace-pre-wrap drop-shadow-2xl"
        >
          <span 
            className="italic text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-gradient"
            style={{
              backgroundImage: 'linear-gradient(90deg, #fbbf24, #f472b6, #a78bfa, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Click The Monster
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base md:text-lg text-white font-medium max-w-md mx-auto drop-shadow-xl bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          ✨ Defeat monsters, earn gold, and upgrade your power! ✨
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.button
            onClick={handleStart}
            disabled={isStarting}
            whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-10 py-4 font-bold text-lg rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
              backgroundSize: '300% 300%',
              animation: 'gradient 3s ease infinite',
              color: 'white',
            }}
          >
            <span className="relative z-10 drop-shadow-md">
              {isStarting ? 'Starting... 🎮' : 'Start Game 🎯'}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Add CSS animation */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};
