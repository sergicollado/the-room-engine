const {Inventory} = require("./inventory");
const {Feature} = require("./interactiveObjects");

class Player {

  constructor( currentPlace, inventoryData = [], dialogs ) {
    this.place = currentPlace,
    this.inventory = new Inventory(inventoryData);
    this.dialogs = dialogs;
  }

  see(idObject) {
    if (this.inventory.contains(idObject)) {
      return this.inventory.get(idObject).getDescription() + this.dialogs.SEE_AN_OBJECT_FROM_INVENTORY;
    }
    const objectSeen = this.place.getObject(idObject);
    if(!objectSeen) {
      return this.dialogs.CANNOT_SEE_THIS;
    }
    return objectSeen.getDescription();
  }

  readObject(idObject) {
    if (this.inventory.contains(idObject)) {
      return this.inventory.get(idObject).getText() + this.dialogs.READ_AN_OBJECT_FROM_INVENTORY;
    }

    const toReadObject = this.place.getObject(idObject);
    if (toReadObject && toReadObject.is(Feature.READABLE)) {
      return this.place.getObject(idObject).getText();
    }
    return this.dialogs.CANNOT_READ_THIS;
  }
  getCurrentPlace = () => {
    return this.place;
  }
  goToPlace(place) {
    this.place = place;
  }

  getObject(idObject) {
    const toGetObject = this.place.getObject(idObject);
    if(!toGetObject.is(Feature.PORTABLE)) {
      return this.dialogs.CANNOT_SAVE_THIS;
    }
    this.inventory.add(toGetObject);
    return this.dialogs.GET_OBJECT;
  }

  open(idObject) {
    const toOpen = this.place.getObject(idObject);
    if(!toOpen.is(Feature.OPENABLE)) {
      return this.dialogs.NOT_OPENABLE_MESSAGE
    }
    toOpen.open();
    return toOpen.getOpenMessage();
  }

  has(idObject) {
    return this.inventory.contains(idObject);
  }
}
exports.Player = Player;
