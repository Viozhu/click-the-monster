import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', abbr: 'En' },
    { code: 'es', name: 'Español', abbr: 'Es' },
    { code: 'ko', name: '한국어', abbr: 'Kr' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex items-center gap-1.5 sm:gap-2">
      {/* GitHub Icon */}
      <motion.a
        href="https://github.com/Viozhu"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/90 backdrop-blur-sm p-2 sm:p-2.5 rounded-lg shadow-lg border-2 border-gray-200 hover:bg-white transition-all flex items-center justify-center"
        aria-label="GitHub Profile"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.532 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      </motion.a>

      {/* Language Selector */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg border-2 border-gray-200 hover:bg-white transition-all"
        >
          <span className="font-semibold text-gray-700 text-sm sm:text-base">
            {currentLanguage.abbr}
          </span>
          <svg
            className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden z-50 min-w-[140px] sm:min-w-[150px]"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 transition-colors ${
                    i18n.language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="font-medium text-sm sm:text-base">{lang.abbr}</span>
                  <span className="font-medium text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">{lang.name}</span>
                  {i18n.language === lang.code && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

