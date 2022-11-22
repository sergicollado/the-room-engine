const { ActionType } = require("./actions");
const {ResponseDefinition} = require("./responseDefinition");
const {Response} = require("./responseController")

exports.StoryPlots = (plotsConfig) => {

  const getInitialPlot = () => {
    return plotsConfig.find(({action}) => action.type === ActionType.START);
  };
  const getTheEndPlot = () => {
    return plotsConfig.find(({action}) => action.type === ActionType.THE_END);
  }

  const getPlots = (plotAction, targetId) => {
    const plot = plotsConfig.filter(({action}) => {
      return action.type === plotAction && action.target === targetId
    })
    return plot;
  }
  const removeUsedPlots = (plotAction, targetId) => {
    plotsConfig = plotsConfig.filter(({action}) => {
      return action.type !== plotAction || action.target !== targetId
    });
  }
  const runTrigger = (trigger ,place, targetId) => {
    if (trigger.type === ActionType.UNHIDE) {
      const targetTrigger = place.getHiddenObject(trigger.target);
      targetTrigger.unhide();
      return ResponseDefinition.PLOT_SUCCESS;
    }

    if (trigger.type === ActionType.THE_END) {
      return ResponseDefinition.THE_END;
    }
    if(trigger.type === ActionType.REMOVE_SIMILAR) {
      removeUsedPlots(trigger.target, targetId);
      return ResponseDefinition.PLOT_SUCCESS;
    }
  }

  const runPlot = ({action, targetId, place}) => {
    const plots = getPlots(action, targetId);
    if(plots.length === 0) {
      return;
    }

    let finalResponse;
    plots.forEach(({ response, trigger }) => {
      finalResponse = response;
      finalResponse.responseDefinition = ResponseDefinition.PLOT_SUCCESS;
      if(trigger) {
        finalResponse.responseDefinition = runTrigger(trigger,place,targetId)
      }
    });
    removeUsedPlots(action, targetId);
    return Response(finalResponse);
  }
  const getPrimitives = () => plotsConfig;
  return {
    runPlot,
    getInitialPlot,
    getTheEndPlot,
    getPrimitives
  }
}
