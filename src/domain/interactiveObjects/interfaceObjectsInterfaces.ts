import { ActionType } from "../actions";

export interface UseWithAction{
  id: string,
  action: ActionType
}

export enum Feature {
  READABLE= "READABLE",
  PORTABLE= "PORTABLE",
  OPENABLE= "OPENABLE",
  OPEN= "OPEN",
  LOCKED= "LOCKED",
  HIDDEN= "HIDDEN",
  USABLE= "USABLE",
  USABLE_WITH= "USABLE_WITH"
}

