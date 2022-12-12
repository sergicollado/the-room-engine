import { Feature, UseWithAction } from "../domain/interactiveObjects/interfaceObjectsInterfaces";
import { ResponseConfig } from "./responseConfig";

export interface InteractiveObjectConfig {
  id: string,
  description: ResponseConfig,
  smallDescription: ResponseConfig,
  features:Feature[],
  messages?: {
    openMessage: ResponseConfig,
    openDescription:ResponseConfig,
    readableText: ResponseConfig,
    lockedMessage: ResponseConfig,
    unlockMessage: ResponseConfig,
    whenUsingMessage: ResponseConfig,
    errorUsing: ResponseConfig,
  },
  useWithActions:UseWithAction[],
  sentenceReplacer:  (sentence:string) => string,
}
