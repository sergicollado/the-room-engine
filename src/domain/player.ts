import {ResponseDefinition} from "./responseDefinition";
import {Response, ResponseController} from "./responseController";

import { Inventory } from "./inventory";
import type {Place} from "./place"
import { Feature } from "./interactiveObjects/interfaceObjectsInterfaces";
import { InteractiveObject, InteractiveObjectId } from "./interactiveObjects/interactiveObjects";

export class Player {
  place: Place;
  inventory: Inventory;
  responseController: ResponseController;

  constructor(currentPlace: Place, inventory: Inventory, responseController: ResponseController) {
    this.place = currentPlace;
    this.inventory = inventory;
    this.responseController = responseController;
  }

  see(idObject: InteractiveObjectId) {
      if (this.inventory.contains(idObject)) {
        if (!idObject) {
          return this.responseController.getResponse(ResponseDefinition.CANNOT_SEE_THIS);
        }
        const objectDescription = this.inventory.get(idObject).getDescription();
        return { text: objectDescription.text + this.responseController.getResponse(ResponseDefinition.SEE_AN_OBJECT_FROM_INVENTORY).getText(),
          image: objectDescription.image };
      }
      const objectSeen = this.place.getObject(idObject);
      if(!objectSeen) {
        return this.responseController.getResponse(ResponseDefinition.CANNOT_SEE_THIS);
      }
      return objectSeen.getDescription();
    }

    readObject(idObject:InteractiveObjectId) {
      if (this.inventory.contains(idObject)) {
        const responseInventoryFromSetting = this.responseController.getResponse(ResponseDefinition.READ_AN_OBJECT_FROM_INVENTORY);
        return Response({
          text: this.inventory.get(idObject).getReadableResponse().text + responseInventoryFromSetting.text,
          image: responseInventoryFromSetting.image,
          responseDefinition: ResponseDefinition.READ_AN_OBJECT_FROM_INVENTORY
        });
      }

      const toReadObject = this.place.getObject(idObject);
      if (toReadObject && toReadObject.is(Feature.READABLE)) {
        return this.place.getObject(idObject).getReadableResponse();
      }
      return this.responseController.getResponse(ResponseDefinition.CANNOT_READ_THIS);
    }

    getCurrentPlace() {
      return this.place;
    }

    goToPlace (targetPlace:Place) {
      this.place = targetPlace;
    }

    addToInventory (idObject:InteractiveObjectId) {
      const toGetObject = this.place.takeObject(idObject);
      if(!toGetObject) {
        return this.responseController.getResponse(ResponseDefinition.CANNOT_SAVE_THIS);
      }
      this.inventory.add(toGetObject);
      return this.responseController.getResponse(ResponseDefinition.GET_OBJECT);
    }

    getObject (idObject:InteractiveObjectId) {
      const fromInventory = this.inventory.get(idObject);
      const fromPlace = this.place.getObject(idObject);
      return fromInventory || fromPlace;
    }

    open(idObject:InteractiveObjectId) {
      const toOpen = this.place.getObject(idObject);
      if(toOpen.isNot(Feature.OPENABLE)) {
        return this.responseController.getResponse(ResponseDefinition.NOT_OPENABLE_MESSAGE)
      }
      return toOpen.open();
    }

    use(interactiveObject:InteractiveObject) {
      if(interactiveObject.isNot(Feature.USABLE) && interactiveObject.isNot(Feature.USABLE_WITH)) {
        return this.responseController.getResponse(ResponseDefinition.CANNOT_USE_THIS);
      }
      if(interactiveObject.is(Feature.USABLE)){
        return interactiveObject.getWhenUsingMessage();
      }

      return {
        with: (interactiveObjectWith:InteractiveObject) => {
          return interactiveObjectWith.useWith(interactiveObject);
        },
      }
    }


}
