
const TheRoomEngine = (player, places, dialogs) => {
  const moveTo = (placeId) => {
    const nextPlace = places.find(({id}) => { return id===placeId});
    if (!nextPlace) {
      return dialogs.UNKNOWN_PLACE_TO_GO;
    }
    player.goToPlace(nextPlace);
    return nextPlace.initialDescription || nextPlace.description;
  }

  const getCurrentPlace = () => {
    return player.getCurrentPlace();
  }

  return {
    moveTo,
    getCurrentPlace
  }
}

exports.TheRoomEngine = TheRoomEngine;
