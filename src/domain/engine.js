
TheRoomEngine = (player, places, dialogs) => {
  moveTo = (placeId) => {
    const nextPlace = places.find(({id}) => { return id===placeId});
    if (!nextPlace) {
      return dialogs.UNKNOWN_PLACE_TO_GO;
    }
    player.goToPlace(nextPlace);
    return nextPlace.initialDescription || description;
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
