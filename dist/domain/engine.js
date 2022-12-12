"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheRoomEngine = void 0;
const place_1 = require("./place");
const inventory_1 = require("./inventory");
const storyPlots_1 = require("./storyPlots");
const scene_1 = require("./scene");
const responseController_1 = require("./responseController");
const interactiveObjectsMapper_1 = require("../shared/interactiveObjectsMapper");
const player_1 = require("./player");
const TheRoomEngine = ({ configPlaces, configResponses, inventoryConfig = [], storyPlots = [], continueGame = false }) => {
    const { currentPlace, placeList } = configPlaces;
    const places = placeList.map((config) => (0, place_1.Place)(config));
    const inventory = (0, inventory_1.Inventory)(inventoryConfig.map(interactiveObjectsMapper_1.interactiveObjectMapper));
    const plotsController = (0, storyPlots_1.StoryPlots)(storyPlots);
    const responseController = (0, responseController_1.ResponseController)(configResponses);
    const buildPlayer = () => {
        let playerPlacePosition = places[0];
        if (currentPlace) {
            playerPlacePosition = places.find(({ id }) => currentPlace === id) || places[0];
        }
        return (0, player_1.Player)(playerPlacePosition, inventory, responseController);
    };
    const scene = (0, scene_1.Scene)({ places, responseController, inventory, plotsController, player: buildPlayer(), continueGame });
    return {
        scene,
        getPrimitives: () => ({
            places: places.map((place) => place.getPrimitives()),
            inventory: inventory.getPrimitives(),
            currentPlace: scene.getCurrentPlace().id,
            storyPlots: scene.getStoryPlots().getPrimitives()
        })
    };
};
exports.TheRoomEngine = TheRoomEngine;
//# sourceMappingURL=engine.js.map