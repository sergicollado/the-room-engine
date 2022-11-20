const { ActionType } = require("./actions");

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
    const plots = getPlots(action, targetId) || {};

    let finalResponse;
    plots.forEach(({ response, trigger }) => {
      finalResponse = response;
      if(trigger) {
        if (trigger.type === ActionType.UNHIDE) {
          const targetTrigger = place.getHiddenObject(trigger.target);
          targetTrigger.unhide();
        }
      }
    });

    return finalResponse;
  }

  return {
    runPlot,
    getInitialPlot,
    getTheEndPlot
  }
}
