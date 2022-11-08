
class TheRoomEngine {
  constructor(player, places, dialogs) {
    this.player = player;
    this.places = places;
    this.dialogs = dialogs;
  }
  moveTo(placeId) {
    const nextPlace = this.places.find(({id}) => { return id===placeId});
    if (!nextPlace) {
      return this.dialogs.UNKNOWN_PLACE_TO_GO;
    }
    this.player.goToPlace(nextPlace);
    return nextPlace.initialDescription || description;
  }
  getCurrentPlace() {
    return this.player.getCurrentPlace();
  }
}

exports.TheRoomEngine = TheRoomEngine;
