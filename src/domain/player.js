const {Inventory} = require("./inventory");
const {Feature} = require("./interactiveObjects");

const Player = (currentPlace, inventoryData = [], dialogs) => {

  let place = currentPlace;
  const inventory = Inventory(inventoryData);

  return {
    see: (idObject) => {
      if (inventory.contains(idObject)) {
        return inventory.get(idObject).getDescription() + dialogs.SEE_AN_OBJECT_FROM_INVENTORY;
      }
      const objectSeen = place.getObject(idObject);
      if(!objectSeen) {
        return dialogs.CANNOT_SEE_THIS;
      }
      return objectSeen.getDescription();
    },

    readObject:(idObject) => {
      if (inventory.contains(idObject)) {
        return inventory.get(idObject).getText() + dialogs.READ_AN_OBJECT_FROM_INVENTORY;
      }

      const toReadObject = place.getObject(idObject);
      if (toReadObject && toReadObject.is(Feature.READABLE)) {
        return place.getObject(idObject).getText();
      }
      return dialogs.CANNOT_READ_THIS;
    },
    getCurrentPlace: () => {
      return place;
    },
    goToPlace: (targetPlace) => {
      place = targetPlace;
    },

    getObject: (idObject) => {
      const toGetObject = place.getObject(idObject);
      if(!toGetObject.is(Feature.PORTABLE)) {
        return dialogs.CANNOT_SAVE_THIS;
      }
      inventory.add(toGetObject);
      return dialogs.GET_OBJECT;
    },

    open: (idObject) => {
      const toOpen = place.getObject(idObject);
      if(toOpen.isNot(Feature.OPENABLE)) {
        return dialogs.NOT_OPENABLE_MESSAGE
      }
      return toOpen.open();
    },

    has: (idObject) => {
      return inventory.contains(idObject);
    },

    use: (interactiveObject) => {
      return {
        with: (interactiveObjectWith) => {
          interactiveObjectWith.useWith(interactiveObject);
        }
      }
    },

  }
}
exports.Player = Player;
