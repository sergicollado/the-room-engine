"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const responseDefinition_1 = require("./responseDefinition");
const responseController_1 = require("./responseController");
const Scene = ({ places, responseController, inventory, plotsController, player, continueGame = false }) => {
    const getInitialPlot = () => {
        if (continueGame) {
            const { description } = getCurrentPlace();
            return { text: responseController.getResponse(responseDefinition_1.ResponseDefinition.RESTART_SESSION).text + description.text,
                image: description.image };
        }
        return plotsController.getInitialPlot().response;
    };
    const getTheEndPlot = () => {
        return plotsController.getTheEndPlot().response;
    };
    const see = (idObject) => {
        const message = player.see(idObject);
        const place = player.getCurrentPlace();
        const plotMessage = plotsController.runPlot({ action: "SEE" /* ActionType.SEE */, targetId: idObject, place });
        return plotMessage || message;
    };
    const read = (idObject) => {
        const message = player.readObject(idObject);
        const place = player.getCurrentPlace();
        const plotMessage = plotsController.runPlot({ action: "READ" /* ActionType.READ */, targetId: idObject, place });
        return plotMessage || message;
    };
    const moveTo = (placeId) => {
        const nextPlace = places.find(({ id }) => { return id === placeId; });
        if (!nextPlace) {
            return responseController.getResponse(responseDefinition_1.ResponseDefinition.UNKNOWN_PLACE_TO_GO);
        }
        player.goToPlace(nextPlace);
        const placePlotMessage = plotsController.runPlot({ action: "MOVE" /* ActionType.MOVE */, targetId: placeId });
        return placePlotMessage || nextPlace.description;
    };
    const open = (idObject) => {
        const message = player.open(idObject);
        const place = player.getCurrentPlace();
        let plotMessage;
        if (message.responseDefinition === responseDefinition_1.ResponseDefinition.OPEN_MESSAGE) {
            plotMessage = plotsController.runPlot({ action: "OPEN" /* ActionType.OPEN */, targetId: idObject, place });
        }
        return plotMessage || message;
    };
    const use = (firstElementId, secondElementId) => {
        const place = player.getCurrentPlace();
        const first = player.getObject(firstElementId);
        const second = player.getObject(secondElementId);
        if (!first && !second) {
            return responseController.getResponse(responseDefinition_1.ResponseDefinition.ERROR_USING_OBJECT_WITH);
        }
        const response = player.use(first);
        if (response.responseDefinition === responseDefinition_1.ResponseDefinition.CANNOT_USE_THIS) {
            return response;
        }
        if (response.responseDefinition === responseDefinition_1.ResponseDefinition.USING) {
            const plotMessageFromFirst = plotsController.runPlot({ action: "USE" /* ActionType.USE */, targetId: firstElementId, place });
            return plotMessageFromFirst || response;
        }
        const responseUsingWith = player.use(first).with(second);
        const { responseDefinition } = responseUsingWith || {};
        if (!response || responseDefinition === responseDefinition_1.ResponseDefinition.ERROR_USING_OBJECT_WITH) {
            return responseController.getResponse(responseDefinition_1.ResponseDefinition.ERROR_USING_OBJECT_WITH);
        }
        const plotMessageFromFirst = plotsController.runPlot({ action: "USE" /* ActionType.USE */, targetId: firstElementId, place });
        const plotMessageFromSecond = plotsController.runPlot({ action: "USE" /* ActionType.USE */, targetId: secondElementId, place });
        const plotMessage = plotMessageFromFirst || plotMessageFromSecond;
        return plotMessage || responseUsingWith;
    };
    const getCurrentPlace = () => {
        return player.getCurrentPlace();
    };
    const help = () => {
        const conjunction = responseController.getResponse(responseDefinition_1.ResponseDefinition.OR_CONJUNCTION).getText();
        const toGoDescriptions = places.map(({ smallDescription }) => smallDescription.text).join(` ${conjunction} `);
        const placesToGoMessage = `${responseController.getResponse(responseDefinition_1.ResponseDefinition.HELP_PLAYER_CAN_GO).getText()} ${toGoDescriptions}`;
        const toSeeDescriptions = getCurrentPlace().getObjectsDescription();
        const thingsToSee = `${responseController.getResponse(responseDefinition_1.ResponseDefinition.HELP_PLAYER_CAN_SEE).getText()} ${toSeeDescriptions}`;
        const inYourInventory = inventoryHelp();
        return { text: `${placesToGoMessage}. ${thingsToSee}. ${responseController.getResponse(responseDefinition_1.ResponseDefinition.HELP_PLAYER_CAN_DO).getText()}. ${inYourInventory.text}`, image: getCurrentPlace().image };
    };
    const inventoryHelp = () => {
        const text = inventory.getContentDescription();
        const image = responseController.getResponse(responseDefinition_1.ResponseDefinition.HELP_PLAYER_INVENTORY).image;
        if (!text || text === "") {
            return (0, responseController_1.Response)({ text: "", image, responseDefinition: responseDefinition_1.ResponseDefinition.HELP_PLAYER_INVENTORY });
        }
        const inYourInventory = `${responseController.getResponse(responseDefinition_1.ResponseDefinition.HELP_PLAYER_INVENTORY).getText()} ${text}`;
        return (0, responseController_1.Response)({ text: inYourInventory, image, responseDefinition: responseDefinition_1.ResponseDefinition.HELP_PLAYER_INVENTORY });
    };
    const inventoryContains = (idObject) => {
        return inventory.contains(idObject);
    };
    const addToInventory = (idObject) => {
        return player.addToInventory(idObject);
    };
    const getStoryPlots = () => {
        return plotsController;
    };
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
    };
};
exports.Scene = Scene;
//# sourceMappingURL=scene.js.map