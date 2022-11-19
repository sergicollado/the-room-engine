const {Feature} = require("./interactiveObjects");
const {ResponseDefinition} = require("./responseDefinition");
const {Response} = require("./responseController");

const Player = (currentPlace, inventory, responseController) => {

  let place = currentPlace;

  return {
    see: (idObject) => {
      if (inventory.contains(idObject)) {
        if (!idObject) {
          return responseController.getResponse(ResponseDefinition.CANNOT_SEE_THIS);
        }
        const objectDescription = inventory.get(idObject).getDescription();
        return { text: objectDescription.text + responseController.getResponse(ResponseDefinition.SEE_AN_OBJECT_FROM_INVENTORY).getText(),
          image: objectDescription.image };
      }
      const objectSeen = place.getObject(idObject);
      if(!objectSeen) {
        return responseController.getResponse(ResponseDefinition.CANNOT_SEE_THIS);
      }
      return objectSeen.getDescription();
    },

    readObject:(idObject) => {
      if (inventory.contains(idObject)) {
        const responseInventoryFromSetting = responseController.getResponse(ResponseDefinition.READ_AN_OBJECT_FROM_INVENTORY);
        return Response({
          text: inventory.get(idObject).getReadableResponse().text + responseInventoryFromSetting.text,
          image: responseInventoryFromSetting.image,
          responseDefinition: ResponseDefinition.READ_AN_OBJECT_FROM_INVENTORY
        });
      }

      const toReadObject = place.getObject(idObject);
      if (toReadObject && toReadObject.is(Feature.READABLE)) {
        return place.getObject(idObject).getReadableResponse();
      }
      return responseController.getResponse(ResponseDefinition.CANNOT_READ_THIS);
    },
    getCurrentPlace: () => {
      return place;
    },

    goToPlace: (targetPlace) => {
      place = targetPlace;
    },

    addToInventory: (idObject) => {
      const toGetObject = place.getObject(idObject);
      if(!toGetObject.is(Feature.PORTABLE)) {
        return responseController.getResponse(ResponseDefinition.CANNOT_SAVE_THIS);
      }
      inventory.add(toGetObject);
      return responseController.getResponse(ResponseDefinition.GET_OBJECT);
    },

    getObject: (idObject) => {
      const fromInventory = inventory.get(idObject);
      const fromPlace = place.getObject(idObject);
      return fromInventory || fromPlace;
    },

    open: (idObject) => {
      const toOpen = place.getObject(idObject);
      if(toOpen.isNot(Feature.OPENABLE)) {
        return responseController.getResponse(ResponseDefinition.NOT_OPENABLE_MESSAGE)
      }
      return toOpen.open();
    },

    use: (interactiveObject) => {
      return {
        with: (interactiveObjectWith) => {
          return interactiveObjectWith.useWith(interactiveObject);
        }
      }
    },

  }
}
exports.Player = Player;
