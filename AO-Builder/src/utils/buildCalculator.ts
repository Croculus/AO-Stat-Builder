import type { StatMap, BuildsDatabase } from '../types';

export const calculateBuild = (stats: StatMap, builds: BuildsDatabase): string => {
  const statPoints = 136 * 2; // maxLevel * 2

  // Single stat dominance (60% threshold)
  if (stats.vitality > statPoints * 0.6) return 'Warden';
  if (stats.magic > statPoints * 0.6) return 'Mage';
  if (stats.weapons > statPoints * 0.6) return 'Warrior';
  if (stats.strength > statPoints * 0.6) return 'Bezerker';

  // Dual stat combinations (40% threshold each)
  if (stats.vitality >= statPoints * 0.4 && stats.magic >= statPoints * 0.4) return 'Paladin';
  if (stats.vitality >= statPoints * 0.4 && stats.weapons >= statPoints * 0.4) return 'Knight';
  if (stats.vitality >= statPoints * 0.4 && stats.strength >= statPoints * 0.4) return 'Juggernaut';
  if (stats.magic >= statPoints * 0.4 && stats.weapons >= statPoints * 0.4) return 'Conjurer';
  if (stats.magic >= statPoints * 0.4 && stats.strength >= statPoints * 0.4) return 'Warlock';
  if (stats.weapons >= statPoints * 0.4 && stats.strength >= statPoints * 0.4) return 'Warlord';

  // Default
  return 'Savant';
};
