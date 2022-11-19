const { Place } = require("./place");
const {Inventory} = require("./inventory");
const {StoryPlots} = require("./storyPlots");
const { Scene } = require("./scene");
const {ResponseController} = require("./responseController");
const {interactiveObjectMapper} = require("../shared/interactiveObjectsMapper");
const {Player} = require("./player");

const TheRoomEngine = ({configPlaces, configResponses, inventoryConfig=[], storyPlots=[]}) => {
  const {currentPlace, placeList} = configPlaces;
  const places = placeList.map((config) => Place(config));
  const inventory = Inventory(inventoryConfig.map(interactiveObjectMapper));
  const plotsController = StoryPlots(storyPlots);
  const responseController = ResponseController(configResponses);

  const buildPlayer = () => {
    let playerPlacePosition = places[0];
    if(currentPlace) {
      playerPlacePosition = places.find(({id}) => currentPlace === id) || places[0];
    }
    return Player(playerPlacePosition, inventory, responseController);
  }


  const scene = Scene({places, responseController, inventory, plotsController, player:buildPlayer()});

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
