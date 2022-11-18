const { Place } = require("./place");
const {Inventory} = require("./inventory");
const {StoryPlots} = require("./storyPlots");
const { Scene } = require("./scene");
const {ResponseController} = require("./responseController");
const {interactiveObjectMapper} = require("../shared/interactiveObjectsMapper");

const TheRoomEngine = (configPlaces, configResponses, currentInventoryConfig=[], storyPlots=[]) => {
  const places = configPlaces.map((config) => Place(config));
  const inventory = Inventory(currentInventoryConfig.map(interactiveObjectMapper));
  const plotsController = StoryPlots(storyPlots);
  const responseController = ResponseController(configResponses);

  const scene = Scene(places, responseController, inventory, plotsController);
  return {
    scene,
    getPrimitives: () => ({
      places: places.map((place) => place.getPrimitives()),
      inventory: inventory.getPrimitives(),
      currentPlace: scene.getCurrentPlace().id
    })
  }
}

exports.TheRoomEngine = TheRoomEngine;
