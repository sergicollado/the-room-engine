const { Place } = require("./place");
const {Inventory} = require("./inventory");
const {StoryPlots} = require("./storyPlots");
const { Scene } = require("./scene");
const {ResponseController} = require("./responseController");

const TheRoomEngine = (configPlaces, configResponses, currentInventoryConfig=[], storyPlots=[]) => {
  const places = configPlaces.map((config) => Place(config));
  const inventory = Inventory(currentInventoryConfig);
  const plotsController = StoryPlots(storyPlots);
  const responseController = ResponseController(configResponses);

  return {
    scene: Scene(places, responseController, inventory, plotsController)
  }
}

exports.TheRoomEngine = TheRoomEngine;
