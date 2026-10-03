/**
 * Device-Based Seeded Pseudo-Random Number Generator (PRNG) & Fisher-Yates Shuffler
 * Provides 100% deterministic, zero-lag, ultra-fast randomization per device & topic.
 */

/**
 * Mulberry32 is an ultra-fast 32-bit generator with high randomness quality and low state.
 */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 32-bit FNV-1a hash algorithm for strings
 */
export function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Derives a deterministic seed for a specific topic/sub-filter using the device's base seed.
 */
export function deriveTopicSeed(baseSeed: number, topicId: string): number {
  if (!topicId || topicId === 'all') return baseSeed >>> 0;
  const topicHash = hashString(topicId);
  return (baseSeed ^ topicHash) >>> 0;
}

/**
 * Generates an initial or reshuffled random 31-bit seed
 */
export function generateRandomSeed(): number {
  return Math.floor(Math.random() * 2147483647) + 1;
}

/**
 * Deterministic Fisher-Yates shuffle using a seeded Mulberry32 PRNG.
 * Returns a new shuffled array without mutating the original input.
 */
export function seededShuffle<T>(array: readonly T[] | T[], seed: number): T[] {
  if (!array || array.length <= 1) return [...array];
  const copy = [...array];
  const prng = mulberry32(seed);

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
}
