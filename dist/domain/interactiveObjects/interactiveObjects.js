"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveObject = void 0;
const interfaceObjectsInterfaces_1 = require("./interfaceObjectsInterfaces");
const { ActionType } = require("../actions");
const { ResponseDefinition } = require("../responseDefinition");
const { Response } = require("../responseController");
const InteractiveObject = (config) => {
    let { features } = config;
    const { id, description, smallDescription, useWithActions, sentenceReplacer, messages } = config;
    const { openMessage, openDescription, readableText, lockedMessage, unlockMessage, whenUsingMessage, errorUsing } = messages;
    const getPrimitives = () => {
        return config;
    };
    const is = (feature) => {
        return features.includes(feature);
    };
    const isNot = (feature) => {
        return !is(feature);
    };
    const getOpenMessage = () => {
        return openMessage;
    };
    const unlock = () => {
        removeFeature(interfaceObjectsInterfaces_1.Feature.LOCKED);
        features.push(interfaceObjectsInterfaces_1.Feature.OPEN);
    };
    const unhide = () => {
        removeFeature(interfaceObjectsInterfaces_1.Feature.HIDDEN);
    };
    const getTryToOpenButLockedMessage = () => {
        return lockedMessage;
    };
    const removeFeature = (featureToRemove) => {
        features = features.filter((feature) => feature !== featureToRemove);
    };
    const getDescription = () => {
        if (is(interfaceObjectsInterfaces_1.Feature.OPENABLE) && is(interfaceObjectsInterfaces_1.Feature.OPEN)) {
            return Response(Object.assign(Object.assign({}, openDescription), { responseDefinition: ResponseDefinition.SEE_AND_OBJECT }));
        }
        const replacedText = sentenceReplacer(description.text);
        return Response({ text: replacedText, image: description.image, responseDefinition: ResponseDefinition.SEE_AND_OBJECT });
    };
    const getReadableResponse = () => {
        const { text, image } = readableText || {};
        let replacedText;
        if (text) {
            replacedText = sentenceReplacer(readableText.text);
        }
        return Response({ text: replacedText, image: image, responseDefinition: ResponseDefinition.READ_AND_OBJECT });
    };
    return {
        id,
        description,
        smallDescription,
        getOpenMessage,
        unlock,
        unhide,
        is,
        isNot,
        getTryToOpenButLockedMessage,
        removeFeature,
        getPrimitives,
        getDescription,
        getReadableResponse,
        open: () => {
            if (is(interfaceObjectsInterfaces_1.Feature.LOCKED)) {
                return Response(Object.assign(Object.assign({}, getTryToOpenButLockedMessage()), { responseDefinition: ResponseDefinition.IS_LOCKED }));
            }
            if (is(interfaceObjectsInterfaces_1.Feature.OPEN)) {
                return Response(Object.assign(Object.assign({}, getDescription()), { responseDefinition: ResponseDefinition.ALREADY_OPEN_MESSAGE }));
            }
            features.push(interfaceObjectsInterfaces_1.Feature.OPEN);
            return Response(Object.assign(Object.assign({}, getOpenMessage()), { responseDefinition: ResponseDefinition.OPEN_MESSAGE }));
        },
        getMessages: () => {
            return messages;
        },
        getWhenUsingMessage: () => {
            return Response(Object.assign(Object.assign({}, whenUsingMessage), { responseDefinition: ResponseDefinition.USING }));
        },
        addFeature: (featureToAdd) => {
            features.push(featureToAdd);
        },
        useWith: (interactiveObject) => {
            const { id, action } = useWithActions.find(({ id }) => interactiveObject.id === id) || {};
            if (!id) {
                return;
            }
            if (action === ActionType.UNLOCK) {
                unlock();
                return Response(Object.assign(Object.assign({}, unlockMessage), { responseDefinition: ResponseDefinition.UNLOCK }));
            }
            if (action === ActionType.PLOT) {
                return { responseDefinition: ResponseDefinition.PLOT_SUCCESS };
            }
        }
    };
};
exports.InteractiveObject = InteractiveObject;
//# sourceMappingURL=interactiveObjects.js.map