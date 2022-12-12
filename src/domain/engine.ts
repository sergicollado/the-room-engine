import { Place, PlaceId, PlaceParams } from "./place";
import {Inventory} from "./inventory";
import {StoryPlots} from "./storyPlots";
import { Scene, SceneBuilder } from "./scene";
import {ResponseController} from "./responseController";
import {interactiveObjectMapper} from "../shared/interactiveObjectsMapper";
import {Player} from "./player";
import { InputResponsesSettings } from "../inputConfig/inputResponsesSettings";
import { ConfigPlaces, PlaceList } from "./placeList";


export interface TheRoomEngineParams{
  configPlaces: ConfigPlaces,
  configResponses: InputResponsesSettings,
  inventoryConfig:[],
  storyPlots:[],
  continueGame:boolean
}

export const TheRoomEngine = ({configPlaces, configResponses, inventoryConfig=[], storyPlots=[], continueGame=false}:TheRoomEngineParams) => {
  const places = new PlaceList(configPlaces);
  const inventory = new Inventory(inventoryConfig.map(interactiveObjectMapper));
  const plotsController = new StoryPlots(storyPlots);
  const responseController = new ResponseController(configResponses);

  const buildPlayer = () => {
    return new Player(places.getInitialPlayerPosition(), inventory, responseController);
  }


  const scene = SceneBuilder({places, responseController, inventory, plotsController, player:buildPlayer(), continueGame});

  return {
    scene,
    getPrimitives: () => ({
      places:  places.getPrimitives(),
      inventory: inventory.getPrimitives(),
      currentPlace: scene.getCurrentPlace().id,
      storyPlots: scene.getStoryPlots().getPrimitives()
    })
  }
}

