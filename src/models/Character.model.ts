import { generateUUID } from "~/lib/utilities/GenerateUUID";

export enum TokenPair {
  Accurate_Misfire = "AccurateMisfire",
  Dodge_OffGuard = "DodgeOff-Guard",
  Empowered_Weakened = "EmpoweredWeakened",
  Fleet_Immobilized = "FleetImmobilized",
  Fortified_Vulnerable = "FortifiedVulnerable",
  Overwatch_Jammed = "OverwatchJammed",
  Regen_Burn = "RegenBurn",
}

type TokenPairs = {
  [value in TokenPair]: number;
};

export type TokensModel = TokenPairs & { stunned: number };
export interface Character {
  id: string;
  tokens: TokensModel;
  isSynced?: boolean;
  lastModified?: number;
  schemaVersion: number;
}

export function buildCharacter(id?: string): Character {
  return {
    id: id ?? generateUUID(),
    tokens: {
      [TokenPair.Accurate_Misfire]: 0,
      [TokenPair.Dodge_OffGuard]: 0,
      [TokenPair.Empowered_Weakened]: 0,
      [TokenPair.Fleet_Immobilized]: 0,
      [TokenPair.Fortified_Vulnerable]: 0,
      [TokenPair.Overwatch_Jammed]: 0,
      [TokenPair.Regen_Burn]: 0,
      stunned: 0,
    },
    lastModified: Date.now(),
    schemaVersion: 1,
  };
}

export function mockCharacter(): Character {
  return {
    id: generateUUID(),
    tokens: {
      [TokenPair.Accurate_Misfire]: 1,
      [TokenPair.Dodge_OffGuard]: -3,
      [TokenPair.Empowered_Weakened]: 2,
      [TokenPair.Fleet_Immobilized]: 0,
      [TokenPair.Fortified_Vulnerable]: -2,
      [TokenPair.Overwatch_Jammed]: 3,
      [TokenPair.Regen_Burn]: -1,
      stunned: 3,
    },
    schemaVersion: 1,
  };
}
