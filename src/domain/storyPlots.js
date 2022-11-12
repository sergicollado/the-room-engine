const { ActionType } = require("./actions");

exports.StoryPlots = (plotsConfig) => {
  const getMovePlotMessage = (placeId)=> {
    const placePlot = plotsConfig.find(({action}) => action.type === ActionType.MOVE && action.target === placeId);
    if (placePlot) {
      return placePlot.message;
    }
  }

  return {
    getMovePlotMessage
  }
}
