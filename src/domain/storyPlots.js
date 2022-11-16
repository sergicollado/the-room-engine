const { ActionType } = require("./actions");

exports.StoryPlots = (plotsConfig) => {

  const getInitialPlot = () => {
    return plotsConfig.find(({action}) => action.type === ActionType.START);
  };
  const getTheEndPlot = () => {
    return plotsConfig.find(({action}) => action.type === ActionType.THE_END);
  }

  const getPlot = (plotAction, targetId) => {
    const plot = plotsConfig.find(({action}) => {
      return action.type === plotAction && action.target === targetId
    })
    return plot;
  }

  const runPlot = ({action, targetId, place}) => {
    const { response, trigger } = getPlot(action, targetId) || {};
    if(trigger) {
      if (trigger.type === ActionType.UNHIDE) {
        const targetTrigger = place.getHiddenObject(trigger.target);
        targetTrigger.unhide();
      }
    }
    return response;
  }

  return {
    runPlot,
    getInitialPlot,
    getTheEndPlot
  }
}
