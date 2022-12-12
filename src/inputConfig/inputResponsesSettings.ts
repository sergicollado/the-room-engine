import { ResponseDefinition } from "../domain/responseDefinition";

export interface ResponseSetting{
  text: string, image?:string
}

export interface InputResponsesSettings{
  [ResponseDefinition.SEE_AN_OBJECT_FROM_INVENTORY]: ResponseSetting,
  [ResponseDefinition.READ_AN_OBJECT_FROM_INVENTORY]: ResponseSetting,
  [ResponseDefinition.UNKNOWN_PLACE_TO_GO]: ResponseSetting,
  [ResponseDefinition.GET_OBJECT]: ResponseSetting,
  [ResponseDefinition.CANNOT_SAVE_THIS]: ResponseSetting,
  [ResponseDefinition.CANNOT_SEE_THIS]: ResponseSetting,
  [ResponseDefinition.CANNOT_READ_THIS]: ResponseSetting,
  [ResponseDefinition.OPEN_MESSAGE]: ResponseSetting,
  [ResponseDefinition.NOT_OPENABLE_MESSAGE]: ResponseSetting,
  [ResponseDefinition.ERROR_USING_OBJECT_WITH]: ResponseSetting,
  [ResponseDefinition.HELP_PLAYER_CAN_GO]: ResponseSetting,
  [ResponseDefinition.HELP_PLAYER_CAN_SEE]: ResponseSetting,
  [ResponseDefinition.HELP_PLAYER_CAN_DO]: ResponseSetting,
  [ResponseDefinition.HELP_PLAYER_INVENTORY]: ResponseSetting,
  [ResponseDefinition.OR_CONJUNCTION]: ResponseSetting,
  [ResponseDefinition.AND_CONJUNCTION]: ResponseSetting,
  [ResponseDefinition.RESTART_SESSION]: ResponseSetting,
  [ResponseDefinition.CANNOT_USE_THIS]: ResponseSetting,
  [ResponseDefinition.ALREADY_OPEN_MESSAGE]: ResponseSetting,
}
