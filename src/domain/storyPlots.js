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
        if (trigger.type === ActionType.UNHIDE) {
          const targetTrigger = place.getHiddenObject(trigger.target);
          targetTrigger.unhide();
        }
        if (trigger.type === ActionType.THE_END) {
          finalResponse.responseDefinition = ResponseDefinition.THE_END;
        }
      }
    });

    return Response(finalResponse);
  }

  return {
    runPlot,
    getInitialPlot,
    getTheEndPlot
  }
}
