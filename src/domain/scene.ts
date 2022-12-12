import {ResponseDefinition} from "./responseDefinition";
import {Response, ResponseController, ResponseReturn} from "./responseController";
import { ActionType } from "./actions";
import { PlaceList } from "./placeList";
import { StoryPlots } from "./storyPlots";
import { Inventory } from "./inventory";
import { Player } from "./player";
import { InteractiveObjectId } from "./interactiveObjects/interactiveObjects";
import { Place, PlaceId } from "./place";

interface SceneParameters {
  places: PlaceList,
  responseController: ResponseController,
  inventory: Inventory,
  plotsController: StoryPlots,
  player: Player,
  continueGame:boolean
};

export interface ScenePlayer{
  moveTo: (place:PlaceId) => any,
  open:(idObject: InteractiveObjectId) => any,
  use:(firstElementId: InteractiveObjectId, secondElementId:InteractiveObjectId) => any,
  see:(idObject: InteractiveObjectId) => any,
  read:(idObject: InteractiveObjectId) => any,
};

export interface SceneInventory {
  add:(idObject: InteractiveObjectId) => ResponseReturn,
  has:(idObject: InteractiveObjectId) => boolean
};

export interface Scene {
  player: ScenePlayer,
  inventory: SceneInventory,
  getCurrentPlace: () => Place,
  help: () => any,
  inventoryHelp: ()=> any,
  getInitialPlot: () => any,
  getStoryPlots: () => any
}

export const SceneBuilder = ({places, responseController, inventory, plotsController, player, continueGame=false}:SceneParameters): Scene => {

  const getInitialPlot = ()=> {
    if(continueGame) {
      const {description} = getCurrentPlace();
      const {text} = responseController.getResponse(ResponseDefinition.RESTART_SESSION) || {};
      return {text: text + description.text,
        image: description.image }
    }
    const {response} = plotsController.getInitialPlot() || {};
    return  response;
  }

  const see = (idObject: InteractiveObjectId){
    const message =  player.see(idObject);
    const place = player.getCurrentPlace();
    const plotMessage = plotsController.runPlot({action: ActionType.SEE, targetId: idObject, place});

    return plotMessage || message;
  }

  const read = (idObject: InteractiveObjectId){
    const message = player.readObject(idObject);
    const place = player.getCurrentPlace();
    const plotMessage = plotsController.runPlot({action: ActionType.READ, targetId: idObject, place});

    return plotMessage || message;
  }

  const moveTo = (placeId:PlaceId) => {
    const nextPlace = places.find(placeId);
    if (!nextPlace) {
      return responseController.getResponse(ResponseDefinition.UNKNOWN_PLACE_TO_GO);
    }
    player.goToPlace(nextPlace);
    const placePlotMessage =  plotsController.runPlot({action: ActionType.MOVE, targetId:placeId});

    return placePlotMessage || nextPlace.description;
  }

  const open = (idObject: InteractiveObjectId) {
    const message = player.open(idObject);
    const place = player.getCurrentPlace();
    let plotMessage;
    if (message.responseDefinition === ResponseDefinition.OPEN_MESSAGE) {
      plotMessage = plotsController.runPlot({action: ActionType.OPEN, targetId: idObject, place});

    }
    return plotMessage || message;

  }

  const use = (firstElementId: InteractiveObjectId, secondElementId:InteractiveObjectId) => {
    const place = player.getCurrentPlace();
    const first = player.getObject(firstElementId);
    const second = player.getObject(secondElementId);
    if (!first && !second) {
      return responseController.getResponse(ResponseDefinition.ERROR_USING_OBJECT_WITH);
    }

    const response = player.use(first);
    const {responseDefinition, with:useObjectWith} = response || {};

    if (responseDefinition === ResponseDefinition.CANNOT_USE_THIS) {
      return response;
    }

    if (responseDefinition === ResponseDefinition.USING) {
      const plotMessageFromFirst = plotsController.runPlot({action: ActionType.USE, targetId:firstElementId, place});
      return plotMessageFromFirst || response;
    }

    const responseUsingWith = useObjectWith(second);

    const {responseDefinition: useObjectWithDefinition} = responseUsingWith || {};
    if (!response || useObjectWithDefinition === ResponseDefinition.ERROR_USING_OBJECT_WITH) {
      return responseController.getResponse(ResponseDefinition.ERROR_USING_OBJECT_WITH);
    }

    const plotMessageFromFirst = plotsController.runPlot({action: ActionType.USE, targetId:firstElementId, place});
    const plotMessageFromSecond = plotsController.runPlot({action: ActionType.USE, targetId:secondElementId, place});
    const plotMessage = plotMessageFromFirst || plotMessageFromSecond;

    return plotMessage || responseUsingWith;
  }

  const getCurrentPlace = () => {
    return player.getCurrentPlace();
  }

  const help = () => {
    const conjunction = responseController.getResponse(ResponseDefinition.OR_CONJUNCTION).getText();
    const toGoDescriptions = places.getWhereIsAbleToGoDescriptions(conjunction);
    const placesToGoMessage = `${responseController.getResponse(ResponseDefinition.HELP_PLAYER_CAN_GO).getText()} ${toGoDescriptions}`;

    const toSeeDescriptions = getCurrentPlace().getObjectsDescription();
    const thingsToSee = `${responseController.getResponse(ResponseDefinition.HELP_PLAYER_CAN_SEE).getText()} ${toSeeDescriptions}`;

    const inYourInventory = inventoryHelp();
    return Response({ text:`${placesToGoMessage}. ${thingsToSee}. ${responseController.getResponse(ResponseDefinition.HELP_PLAYER_CAN_DO).getText()}. ${inYourInventory.text}`, image: getCurrentPlace().description.image, responseDefinition:ResponseDefinition.ON_HELP});
  }

  const inventoryHelp = () => {
    const text = inventory.getContentDescription();
    const image = responseController.getResponse(ResponseDefinition.HELP_PLAYER_INVENTORY).image;
    if(!text || text ==="") {
      return Response({text: "", image, responseDefinition: ResponseDefinition.HELP_PLAYER_INVENTORY });
    }

    const inYourInventory = `${responseController.getResponse(ResponseDefinition.HELP_PLAYER_INVENTORY).getText()} ${text}`;
    return Response({text: inYourInventory, image,responseDefinition: ResponseDefinition.HELP_PLAYER_INVENTORY} );
  }

  const inventoryContains = (idObject: InteractiveObjectId){
    return inventory.contains(idObject);
  };

  const addToInventory = (idObject: InteractiveObjectId){
    return player.addToInventory(idObject);
  }
  const getStoryPlots = () => {
    return plotsController;
  }
  return {
    player: {
      moveTo,
      open,
      use,
      see,
      read,
    },
    inventory: {
      add: addToInventory,
      has: inventoryContains
    },
    getCurrentPlace,
    help,
    inventoryHelp,
    getInitialPlot,
    getStoryPlots
  }
}

