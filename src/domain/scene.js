const {ResponseDefinition} = require("./responseDefinition");
const {Response} = require("./responseController");
const { ActionType } = require("./actions");

const Scene = ({places, responseController, inventory, plotsController, player, continueGame=false}) => {

  const getInitialPlot = () => {
    if(continueGame) {
      const {description} = getCurrentPlace();
      return {text: responseController.getResponse(ResponseDefinition.RESTART_SESSION).text + description.text,
        image: description.image }
    }
    return  plotsController.getInitialPlot().response;
  }
  const getTheEndPlot = () => {
    return  plotsController.getTheEndPlot().response;
  }

  const see = (idObject) => {
    const message =  player.see(idObject);
    const place = player.getCurrentPlace();
    const plotMessage = plotsController.runPlot({action: ActionType.SEE, targetId: idObject, place});

    return plotMessage || message;
  }

  const read = (idObject) => {
    const message = player.readObject(idObject);
    const place = player.getCurrentPlace();
    const plotMessage = plotsController.runPlot({action: ActionType.READ, targetId: idObject, place});

    return plotMessage || message;
  }

  const moveTo = (placeId) => {
    const nextPlace = places.find(({id}) => { return id===placeId});
    if (!nextPlace) {
      return responseController.getResponse(ResponseDefinition.UNKNOWN_PLACE_TO_GO);
    }
    player.goToPlace(nextPlace);
    const placePlotMessage =  plotsController.runPlot({action: ActionType.MOVE, targetId:placeId});

    return placePlotMessage || nextPlace.description;
  }

  const open = (idObject) => {
    const message = player.open(idObject);
    const place = player.getCurrentPlace();
    let plotMessage;
    if (message.responseDefinition === ResponseDefinition.OPEN_MESSAGE) {
      plotMessage = plotsController.runPlot({action: ActionType.OPEN, targetId: idObject, place});

    }
    return plotMessage || message;

  }

  const use = (firstElementId, secondElementId) => {
    const place = player.getCurrentPlace();
    const first = player.getObject(firstElementId);
    const second = player.getObject(secondElementId);
    if (!first && !second) {
      return responseController.getResponse(ResponseDefinition.ERROR_USING_OBJECT_WITH);
    }
    const response = player.use(first);
    if (response.responseDefinition === ResponseDefinition.CANNOT_USE_THIS) {
      return response;
    }

    if (response.responseDefinition === ResponseDefinition.USING) {
      const plotMessageFromFirst = plotsController.runPlot({action: ActionType.USE, targetId:firstElementId, place});
      return plotMessageFromFirst || response;
    }

    const responseUsingWith = player.use(first).with(second);

    const {responseDefinition} = responseUsingWith || {};
    if (!response || responseDefinition === ResponseDefinition.ERROR_USING_OBJECT_WITH) {
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
    const conjunction = responseController.getResponse(ResponseDefinition.OR_CONJUNCTION).getText()
    const toGoDescriptions = places.map(({smallDescription}) => smallDescription.text).join(` ${conjunction} `);
    const placesToGoMessage = `${responseController.getResponse(ResponseDefinition.HELP_PLAYER_CAN_GO).getText()} ${toGoDescriptions}`;

    const toSeeDescriptions = getCurrentPlace().getObjectsDescription();
    const thingsToSee = `${responseController.getResponse(ResponseDefinition.HELP_PLAYER_CAN_SEE).getText()} ${toSeeDescriptions}`;

    const inYourInventory = inventoryHelp();
    return { text:`${placesToGoMessage}. ${thingsToSee}. ${responseController.getResponse(ResponseDefinition.HELP_PLAYER_CAN_DO).getText()}. ${inYourInventory.text}`, image: getCurrentPlace().image};
  }

  const inventoryHelp = () => {
    const text = inventory.getContentDescription();
    const image = responseController.getResponse(ResponseDefinition.HELP_PLAYER_INVENTORY).image;
    if(!text || text ==="") {
      return Response({text: "", image}, ResponseDefinition.HELP_PLAYER_INVENTORY );
    }

    const inYourInventory = `${responseController.getResponse(ResponseDefinition.HELP_PLAYER_INVENTORY).getText()} ${text}`;
    return Response({text: inYourInventory, image}, ResponseDefinition.HELP_PLAYER_INVENTORY );
  }

  const inventoryContains = (idObject) => {
    return inventory.contains(idObject);
  };

  const addToInventory = (idObject) => {
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
    getTheEndPlot,
    getStoryPlots
  }
}

exports.Scene = Scene;
