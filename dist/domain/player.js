"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const responseDefinition_1 = require("./responseDefinition");
const responseController_1 = require("./responseController");
const interfaceObjectsInterfaces_1 = require("./interactiveObjects/interfaceObjectsInterfaces");
const Player = (currentPlace, inventory, responseController) => {
    let place = currentPlace;
    return {
        see: (idObject) => {
            if (inventory.contains(idObject)) {
                if (!idObject) {
                    return responseController.getResponse(responseDefinition_1.ResponseDefinition.CANNOT_SEE_THIS);
                }
                const objectDescription = inventory.get(idObject).getDescription();
                return { text: objectDescription.text + responseController.getResponse(responseDefinition_1.ResponseDefinition.SEE_AN_OBJECT_FROM_INVENTORY).getText(),
                    image: objectDescription.image };
            }
            const objectSeen = place.getObject(idObject);
            if (!objectSeen) {
                return responseController.getResponse(responseDefinition_1.ResponseDefinition.CANNOT_SEE_THIS);
            }
            return objectSeen.getDescription();
        },
        readObject: (idObject) => {
            if (inventory.contains(idObject)) {
                const responseInventoryFromSetting = responseController.getResponse(responseDefinition_1.ResponseDefinition.READ_AN_OBJECT_FROM_INVENTORY);
                return (0, responseController_1.Response)({
                    text: inventory.get(idObject).getReadableResponse().text + responseInventoryFromSetting.text,
                    image: responseInventoryFromSetting.image,
                    responseDefinition: responseDefinition_1.ResponseDefinition.READ_AN_OBJECT_FROM_INVENTORY
                });
            }
            const toReadObject = place.getObject(idObject);
            if (toReadObject && toReadObject.is(interfaceObjectsInterfaces_1.Feature.READABLE)) {
                return place.getObject(idObject).getReadableResponse();
            }
            return responseController.getResponse(responseDefinition_1.ResponseDefinition.CANNOT_READ_THIS);
        },
        getCurrentPlace: () => {
            return place;
        },
        goToPlace: (targetPlace) => {
            place = targetPlace;
        },
        addToInventory: (idObject) => {
            const toGetObject = place.takeObject(idObject);
            if (!toGetObject) {
                return responseController.getResponse(responseDefinition_1.ResponseDefinition.CANNOT_SAVE_THIS);
            }
            inventory.add(toGetObject);
            return responseController.getResponse(responseDefinition_1.ResponseDefinition.GET_OBJECT);
        },
        getObject: (idObject) => {
            const fromInventory = inventory.get(idObject);
            const fromPlace = place.getObject(idObject);
            return fromInventory || fromPlace;
        },
        open: (idObject) => {
            const toOpen = place.getObject(idObject);
            if (toOpen.isNot(interfaceObjectsInterfaces_1.Feature.OPENABLE)) {
                return responseController.getResponse(responseDefinition_1.ResponseDefinition.NOT_OPENABLE_MESSAGE);
            }
            return toOpen.open();
        },
        use: (interactiveObject) => {
            if (interactiveObject.isNot(interfaceObjectsInterfaces_1.Feature.USABLE) && interactiveObject.isNot(interfaceObjectsInterfaces_1.Feature.USABLE_WITH)) {
                return responseController.getResponse(responseDefinition_1.ResponseDefinition.CANNOT_USE_THIS);
            }
            if (interactiveObject.is(interfaceObjectsInterfaces_1.Feature.USABLE)) {
                return interactiveObject.getWhenUsingMessage();
            }
            return {
                with: (interactiveObjectWith) => {
                    return interactiveObjectWith.useWith(interactiveObject);
                }
            };
        },
    };
};
exports.Player = Player;
//# sourceMappingURL=player.js.map