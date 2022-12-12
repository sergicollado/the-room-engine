import { rootLogger } from "ts-jest";
import { InputResponsesSettings } from "../inputConfig/inputResponsesSettings";
import { logger } from "../shared/logger";
import {ResponseDefinition} from "./responseDefinition";

export interface ResponseInput{
  text?: string, image?:string, responseDefinition:ResponseDefinition
}
export interface ResponseReturn{
  getText:() => string,
  getImage:() => string,
  responseDefinition:ResponseDefinition,
  text:string,
  image:string,
  getPrimitives: () => ResponseInput
};

export const Response = ({text="", image="", responseDefinition}:ResponseInput):
  ResponseReturn => {
  return {
    getText: () => text,
    getImage: () => image,
    responseDefinition,
    text,
    image,
    getPrimitives: ():ResponseInput => ({text,image,responseDefinition})
  }
}

export class ResponseController{
    data: InputResponsesSettings;
    constructor(responsesConfig:InputResponsesSettings){
      this.data = responsesConfig;
    }
    getResponse (responseDefinition: ResponseDefinition) {
      const {[responseDefinition]:definition} = this.data;
      if(!definition) {
        logger.warning(`ResponseController: NOT FOUND DEFINITION: ${responseDefinition}`);
        return Response({responseDefinition:ResponseDefinition.DEFINITION_NOT_FOUND});
      }

      return Response({...definition, responseDefinition})
    }

}
