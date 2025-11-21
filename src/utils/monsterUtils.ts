/**
 * Generates a random monster name
 * @param t - Translation function from react-i18next or i18next
 */
export const generateMonsterName = (t: (key: string, options?: any) => any): string => {
  let prefixes = t('monsterNames.prefixes', { returnObjects: true });
  let suffixes = t('monsterNames.suffixes', { returnObjects: true });
  
  // Handle case where translation might return a string instead of array
  if (typeof prefixes === 'string') {
    try {
      prefixes = JSON.parse(prefixes);
    } catch {
      // Fallback to English if parsing fails
      prefixes = ['Dark', 'Shadow', 'Blood', 'Fire', 'Ice', 'Thunder', 'Venom', 'Chaos'];
    }
  }
  
  if (typeof suffixes === 'string') {
    try {
      suffixes = JSON.parse(suffixes);
    } catch {
      // Fallback to English if parsing fails
      suffixes = ['Beast', 'Fiend', 'Demon', 'Terror', 'Horror', 'Monster', 'Creature'];
    }
  }
  
  // Ensure we have arrays
  if (!Array.isArray(prefixes)) prefixes = [];
  if (!Array.isArray(suffixes)) suffixes = [];
  
  // Fallback if arrays are empty
  if (prefixes.length === 0) prefixes = ['Dark', 'Shadow', 'Blood'];
  if (suffixes.length === 0) suffixes = ['Beast', 'Fiend', 'Demon'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix} ${suffix}`;
};

/**
 * Generates a Robohash image URL for a monster
 * @param id - Unique identifier for the monster (will be used as seed)
 * @returns Robohash image URL
 */
export const generateMonsterImageUrl = (id: string): string => {
  // Random set between 1 and 3
  const randomSet = Math.floor(Math.random() * 2) + 1;
  // Use the provided id (nanoid) as the seed for consistent but unique images
  return `https://robohash.org/${id}?set=set${randomSet}&size=300x300`;
};

/**
 * Generates a random phrase when monster is attacked
 * Mix of funny and pain-related phrases
 * @param t - Translation function from react-i18next or i18next
 */
export const generateAttackPhrase = (t: (key: string, options?: any) => any): string => {
  // 50% chance of funny, 50% chance of pain
  const isFunny = Math.random() > 0.5;
  const phraseType = isFunny ? 'funny' : 'pain';
  const phrases = t(`attackPhrases.${phraseType}`, { returnObjects: true }) as string[];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

