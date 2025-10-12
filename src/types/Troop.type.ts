export interface Troop {
  name: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  type: "Archer" | "Cavalry" | "Infantry" | "Mounted Archer";
  banner: string;
  occupation: "Mercenary" | "Soldier" | "Bandit";
  faction: "Calradic Empire" | "Kingdom of Vlandia" | "Principality of Sturgia" | "Aserai Sultanate" | "High Kingdom of the Battanians" | "Khuzait Khanate";
  culture: "Empire" | "Vlandia" | "Sturgia" | "Aserai" | "Battania" | "Khuzait" | "Darshi" | "Nord";
  used: boolean;
  image: string;
  date: string;
  lastSelection?: string;
}

export interface TroopStatus {
  name: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  type: "Archer" | "Cavalry" | "Infantry" | "Mounted Archer";
  banner: string;
  occupation: "Mercenary" | "Soldier" | "Bandit";
  faction: "Calradic Empire" | "Kingdom of Vlandia" | "Principality of Sturgia" | "Aserai Sultanate" | "High Kingdom of the Battanians" | "Khuzait Khanate";
  culture: "Empire" | "Vlandia" | "Sturgia" | "Aserai" | "Battania" | "Khuzait" | "Darshi" | "Nord";
  used: boolean;
  image: string;
  date: string;
  nameStatus: "Same" | "Wrong" | undefined;
  tierStatus: "Higher" | "Lower" | "Same" | undefined;
  typeStatus: "Same" | "Partial" | "Wrong" | undefined;
  occupationStatus: "Same" | "Wrong" | undefined;
  bannerStatus: "Same" | "Wrong" | undefined;
  factionStatus: "Same" | "Wrong" | undefined;
  cultureStatus: "Same" | "Wrong" | undefined;
}

export interface LastTroop {
  id: number;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  type: "Archer" | "Cavalry" | "Infantry" | "Mounted Archer";
  banner: string;
  occupation: "Mercenary" | "Soldier" | "Bandit";
  faction: "Calradic Empire" | "Kingdom of Vlandia" | "Principality of Sturgia" | "Aserai Sultanate" | "High Kingdom of the Battanians" | "Khuzait Khanate";
  culture: "Empire" | "Vlandia" | "Sturgia" | "Aserai" | "Battania" | "Khuzait" | "Darshi" | "Nord";
  used: boolean;
  image: string;
  date: string;
}
