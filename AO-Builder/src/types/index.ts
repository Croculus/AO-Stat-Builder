export interface StatMap {
  vitality: number;
  magic: number;
  weapons: number;
  strength: number;
}

export interface MagicVariant {
  name: string;
  color: string;
}

export interface MagicData {
  name: string;
  damage: number;
  speed: number;
  size: number;
  effect: string;
  variants: MagicVariant[];
  syngergies: Record<string, [number, ...string[]]>;
}

export interface MagicsDatabase {
  [key: string]: MagicData;
}

export interface FightStyleData {
  name: string;
}

export interface FightStyleDatabase {
  [key: string]: FightStyleData;
}

export interface BuildConfig {
  tabs: string[];
  color: string;
  imbues: boolean;
}

export interface BuildsDatabase {
  [key: string]: BuildConfig;
}

export interface TableItem {
  name: string;
  index: number;
  type: "magic" | "fstyle";
}

export interface TableSelection {
  [tableId: string]: string | null;
}
