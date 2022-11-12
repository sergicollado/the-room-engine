const { Place } = require("./place");
const { Player } = require("./player");
const {Inventory} = require("./inventory");
const { ActionType } = require("./actions");
const {StoryPlots} = require("./storyPlots");

const TheRoomEngine = (configPlaces, dialogs, currentInventory=[], storyPlots=[]) => {
  const places = configPlaces.map((config) => Place(config));
  const inventory = Inventory(currentInventory);
  const player = Player(places[0], inventory, dialogs )
  const plotsController = StoryPlots(storyPlots);

  const getPlayer = () => {
    return player;
  }

  const moveTo = (placeId) => {
    const nextPlace = places.find(({id}) => { return id===placeId});
    if (!nextPlace) {
      return dialogs.UNKNOWN_PLACE_TO_GO;
    }
    player.goToPlace(nextPlace);
    const placePlotMessage = plotsController.getMovePlotMessage(placeId);

    return placePlotMessage || nextPlace.description;
  }

  const getCurrentPlace = () => {
    return player.getCurrentPlace();
  }

  const help = () => {
    const toGoDescriptions = places.map(({smallDescription}) => smallDescription).join(", ");
    const placesToGoMessage = `${dialogs.HELP_PLAYER_CAN_GO} ${toGoDescriptions}`;

    const toSeeDescriptions = getCurrentPlace().getObjectsDescription();
    const thingsToSee = `${dialogs.HELP_PLAYER_CAN_SEE} ${toSeeDescriptions}`;

    const inYourInventory = inventoryHelp();
    return `${placesToGoMessage}, ${thingsToSee}.${dialogs.HELP_PLAYER_CAN_DO}. ${inYourInventory}`;
  }

  const inventoryHelp = () => {
    const inventoryDescriptions = inventory.getContentDescription();
    const inYourInventory = `${dialogs.HELP_PLAYER_INVENTORY} ${inventoryDescriptions}`;
    return inYourInventory;
  }

  return {
    getPlayer,
    moveTo,
    getCurrentPlace,
    help,
    inventoryHelp
  }
}

exports.TheRoomEngine = TheRoomEngine;
