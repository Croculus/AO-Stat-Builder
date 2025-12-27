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


 //this is an index signiture, essentially it lets us define as many properties as we want (i.e key in this case),
//as long as the names of those properties match the type defined initally
export interface MagicsDatabase {
  [magic: string]: MagicData; 
  // for example, we can define each magic as a property, and map it name to it's data
}

export interface FightStyleData {
  name: string;
  //need to add more
}

export interface FightStyleDatabase {
  [fstyle: string]: FightStyleData;
}

export interface BuildConfig { //the actual properties of a corresponing build
  tabs: string[]; //tabs a given stat build has
  color: string; // color of tab
  imbues: boolean; // passing imbuement boolean
}

export interface BuildsDatabase {
  [build: string]: BuildConfig; // lets us store the properties of as many builds as we want (e.g. warrior, savant)
}

export interface TableItem {
  name: string;
  index: number;
  type: "magic" | "fstyle";
}

export interface TableSelection {
  [tableId: string]: string | null; 
}
