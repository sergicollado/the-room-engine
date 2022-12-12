import { InteractiveObjectConfig } from "../inputConfig/interactiveObjectType";
import { InteractiveObject, InteractiveObjectId } from "./interactiveObjects/interactiveObjects";

export class Inventory{
  data: InteractiveObject[];

  constructor(data:InteractiveObject[]) {
    this.data = data;
  }
  contains(idObject: InteractiveObjectId) {
    return this.data.some(({id}) => id===idObject)
  }

  add(inventoryObject:InteractiveObject) {
    this.data.push(inventoryObject);
  }

  get (idObject:InteractiveObjectId) {
    return this.data.find(({id}) => id===idObject)
  }

  getContentDescription () {
    return this.data.map(({smallDescription}) => smallDescription.text).join(", ") ;
  }

  getPrimitives ():InteractiveObjectConfig[] {
    return this.data.map((element) => element.getPrimitives()));
  }
};

exports.Inventory = Inventory;
