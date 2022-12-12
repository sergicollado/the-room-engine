import { ResponseConfig } from "../inputConfig/responseConfig";

import {interactiveObjectMapper} from "../shared/interactiveObjectsMapper";
import {replaceConditionalSentence} from "../shared/replaceConditionalSentence";
import { InteractiveObject } from "./interactiveObjects/interactiveObjects";
import { Feature } from "./interactiveObjects/interfaceObjectsInterfaces";


export type PlaceId = string;

export interface PlaceParams {
  id:PlaceId,
  description:ResponseConfig,
  smallDescription:ResponseConfig,
  objects:any[]
}

export class Place{
  id: PlaceId;
  description: ResponseConfig;
  smallDescription: ResponseConfig;
  objects: any[];
  interactiveObjects: any[];

  constructor ({id, description, smallDescription, objects=[]}:PlaceParams) {
    this.id = id;
    this.description = description;
    this.smallDescription = smallDescription;
    this.objects = objects;
    const sentenceReplacer = (sentence:string) => replaceConditionalSentence(sentence,this.getObject);
    this.interactiveObjects = objects.map((element) => interactiveObjectMapper({...element, sentenceReplacer}));
  }

  getObject = (idObject:PlaceId) =>  {
    return this.interactiveObjects.find(({id , isNot}:InteractiveObject) => (id===idObject && isNot(Feature.HIDDEN)));
  };

  takeObject (idObject:PlaceId) {
    const toTake = this.getObject(idObject);
    if (!toTake || toTake.isNot(Feature.PORTABLE)) {
      return;
    }
    this.removeObject(idObject);
    return toTake;
  };

  getHiddenObject (idObject:PlaceId) {
    return this.interactiveObjects.find(({id , is}) => (id===idObject && is(Feature.HIDDEN)));
  };

  getObjectsDescription () {
    return this.interactiveObjects.filter(({isNot}) => (isNot(Feature.HIDDEN)))
    .map(({smallDescription}) => `${smallDescription.text}`).join(", ");
  }

  removeObject (idObject:PlaceId) {
    this.interactiveObjects = this.interactiveObjects.filter(({id}) => {
      return id!==idObject
    })
  }
  getPrimitives() {
    const primitiveObjects = this.interactiveObjects.map(obj => obj.getPrimitives());
    return {id: this.id, description: this.description, smallDescription: this.smallDescription, objects:primitiveObjects};
  }

  getDescription () {
    const replacedText = replaceConditionalSentence(this.description.text, this.getObject)

    return {...this.description,text:replacedText};
  }
}

