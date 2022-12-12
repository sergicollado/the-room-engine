"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryPlots = void 0;
const responseDefinition_1 = require("./responseDefinition");
const responseController_1 = require("./responseController");
;
const StoryPlots = (plotsConfig) => {
    const getInitialPlot = () => {
        return plotsConfig.find(({ action }) => action.type === "START" /* ActionType.START */);
    };
    const getTheEndPlot = () => {
        return plotsConfig.find(({ action }) => action.type === "END" /* ActionType.THE_END */);
    };
    const getPlots = (plotAction, targetId) => {
        const plot = plotsConfig.filter(({ action }) => {
            return action.type === plotAction && action.target === targetId;
        });
        return plot;
    };
    const removeUsedPlots = (plotAction, targetId) => {
        plotsConfig = plotsConfig.filter(({ action }) => {
            return action.type !== plotAction || action.target !== targetId;
        });
    };
    const runTrigger = (trigger, place, targetId) => {
        if (trigger.type === "UNHIDE" /* ActionType.UNHIDE */) {
            const targetTrigger = place.getHiddenObject(trigger.target);
            targetTrigger.unhide();
            return responseDefinition_1.ResponseDefinition.PLOT_SUCCESS;
        }
        if (trigger.type === "END" /* ActionType.THE_END */) {
            return responseDefinition_1.ResponseDefinition.THE_END;
        }
        if (trigger.type === "REMOVE_SIMILAR" /* ActionType.REMOVE_SIMILAR */) {
            removeUsedPlots(trigger.target, targetId);
            return responseDefinition_1.ResponseDefinition.PLOT_SUCCESS;
        }
    };
    const runPlot = ({ action, targetId, place }) => {
        const plots = getPlots(action, targetId);
        if (plots.length === 0) {
            return;
        }
        let finalResponse;
        plots.forEach(({ response, trigger }) => {
            finalResponse = response;
            finalResponse.responseDefinition = responseDefinition_1.ResponseDefinition.PLOT_SUCCESS;
            if (trigger) {
                finalResponse.responseDefinition = runTrigger(trigger, place, targetId);
            }
        });
        removeUsedPlots(action, targetId);
        return (0, responseController_1.Response)(finalResponse);
    };
    const getPrimitives = () => plotsConfig;
    return {
        runPlot,
        getInitialPlot,
        getTheEndPlot,
        getPrimitives
    };
};
exports.StoryPlots = StoryPlots;
//# sourceMappingURL=storyPlots.js.map