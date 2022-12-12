import { InteractiveObjectConfig } from "../../inputConfig/interactiveObjectType";
import { ResponseConfig } from "../../inputConfig/responseConfig";
import { Feature } from "./interfaceObjectsInterfaces";

import { ActionType } from "../actions";
import { ResponseDefinition } from "../responseDefinition";
import { Response, ResponseReturn } from "../responseController";
import { ResponseSetting } from "../../inputConfig/inputResponsesSettings";
import { logger } from "../../shared/logger";

export type InteractiveObjectId = string;

export class InteractiveObject {
  config: InteractiveObjectConfig;
  features: Feature[];
  messages;
  sentenceReplacer: (sentence: string) => string;
  id: InteractiveObjectId;
  smallDescription: ResponseConfig;

  constructor( config: InteractiveObjectConfig) {
    this.id = config.id;
    this.config = config;
    this.features = config.features || [];
    this.messages = config.messages;
    this.sentenceReplacer = config.sentenceReplacer;
    this.smallDescription = config.smallDescription;
  }

  getPrimitives (): InteractiveObjectConfig {
    return this.config;
  };

  is (feature: Feature): boolean {
    return this.features.includes(feature) ;
  }

  isNot (feature: Feature): boolean {
    return !this.is(feature) ;
  };

  lockedMessagegetOpenMessage(): ResponseConfig {
    if(!this.messages?.openMessage) {
      logger.warning("🚀 ~ Getting Open message but is Undefined, file: interactiveObjects.ts:43 ~ InteractiveObject ~ getOpenMessage ~ getOpenMessage")
      return { text: "openMessage MESSAGE NOT DEFINED"};
    }
      return this.messages.openMessage;
  };

  unlock (): void {
    this.removeFeature(Feature.LOCKED);
    this.features.push(Feature.OPEN);
  };
  unhide (): void {
    this.removeFeature(Feature.HIDDEN);
  };

  getTryToOpenButLockedMessage(): ResponseConfig {
    if(!this.messages?.lockedMessage) {
      logger.warning("🚀 ~ Trying to get Open but locked message but is Undefined, file: interactiveObjects.ts:60 ~ InteractiveObject ~ getTryToOpenButLockedMessage")
      return { text: "TryToOpenButLocked MESSAGE NOT DEFINED"};
    }
    return this.messages.lockedMessage;
  };

  removeFeature (featureToRemove:Feature) {
    this.features = this.features.filter((feature:Feature) => feature!==featureToRemove );
  };

  getDescriptionWhenOpening(): ResponseConfig {
    if(!this.messages?.openDescription) {
      logger.warning("🚀 ~ Trying to get openDescription but is Undefined, file: interactiveObjects.ts:72 ~ InteractiveObject ~ getDescriptionWhenOpening")
      return { text: "getDescriptionWhenOpening MESSAGE NOT DEFINED"};
    }
    return this.messages.openDescription;
  };

  getDescription (): ResponseReturn {
    if(this.is(Feature.OPENABLE) && this.is(Feature.OPEN)) {
      return Response({...this.getDescriptionWhenOpening(),responseDefinition: ResponseDefinition.SEE_AND_OBJECT});
    }
    const {description} = this.config;
    const replacedText = this.sentenceReplacer(description.text);
    return Response({text:replacedText,image:description.image,responseDefinition: ResponseDefinition.SEE_AND_OBJECT});
  };

  getReadableResponse (): ResponseReturn {
    const replacedText = this.sentenceReplacer(this.messages.readableText.text);
    return Response({text:replacedText, image:this.messages.readableText.image, responseDefinition: ResponseDefinition.READ_AND_OBJECT});
  }

  open(): ResponseReturn {
    if(this.is(Feature.LOCKED)) {
      return Response({...this.getTryToOpenButLockedMessage(), responseDefinition: ResponseDefinition.IS_LOCKED});
    }
    if(this.is(Feature.OPEN)) {
      return Response({...this.getDescription(), responseDefinition: ResponseDefinition.ALREADY_OPEN_MESSAGE});
    }
    this.features.push(Feature.OPEN);
    return Response({...this.getOpenMessage(), responseDefinition: ResponseDefinition.OPEN_MESSAGE});
  }

  getMessages() {
    return this.messages;
  }


  getWhenUsingMessage() {
    return Response({...this.messages.whenUsingMessage, responseDefinition: ResponseDefinition.USING});
  }

  addFeature (featureToAdd: Feature) {
    this.features.push(featureToAdd);
  }

  useWith (interactiveObject: {id:InteractiveObjectId}): ResponseReturn | undefined  {
    const {useWithActions} = this.config || [];
    const {id, action} = useWithActions.find(({id}) => interactiveObject.id===id) || {};

    if(!id) {
      return;
    }

    if(action === ActionType.UNLOCK) {
      this.unlock();
      return Response({...this.messages.unlockMessage, responseDefinition: ResponseDefinition.UNLOCK});
    }

    if(action === ActionType.PLOT) {
      return Response({responseDefinition: ResponseDefinition.PLOT_SUCCESS});
    }
  }
}

