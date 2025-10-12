import { Troop, TroopStatus } from "../types/Troop.type";

export interface CheckTroopDto {
  correct: boolean;
  currentSelection: Troop;
  troopStatus: TroopStatus;
}
