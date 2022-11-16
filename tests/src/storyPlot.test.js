const { TheRoomEngine, ActionType, Feature } = require("../../src/domain");
const { ResponseDefinition } = require("../../src/domain/responseDefinition");
const {dialogs} = require("./responses");

describe('Story Plots', () => {
  let scene;
  let player;
  beforeEach(() => {
    const firstPlace = {
      id : "firstPlace",
      description : {text: "first place description", image:""},
      objects: [{
        id: "door",
        description: {text:"it's a door", image:""},
        features:[Feature.OPENABLE],
        openMessage: {text:"the door is opened now you can see more things", image:"doorOpenMessageImage"},
        openDescription: {text:"From this door we can now watch a shadow", image:"doorOpenMessageDescriptionImage"}},
        {
          id: "doorWithoutOpenPlot",
          description: {text:"it's a door", image:"doorWithoutOpenPlotImage"},
          features:[Feature.OPENABLE],
          openMessage: {text:"the door is opened now you can see more things", image:"doorWithoutOpenPlotOpenMessageImage"},
          openDescription: {text:"From this door we can now watch a shadow", image:"doorWithoutOpenPlotOpenDescriptionImage"}},
        {
          id: "milk",
          description: {text:"white milk", image:""},
          errorUsing: {text:"it doesn't seem to work", image:"milkErrorUsingImage"},
          useWithActions: [{id:"cacao", action: ActionType.PLOT}],
        },
        {
          id: "cacao",
          description: {text:"cacao", image:""},
          errorUsing:{text:"it doesn't seem to work", image:"cacaoErrorUsingImage"},
          useWithActions: [{id:"milk", action: ActionType.PLOT}],
        }
      ]
    };

    const secondPlace = {
        id : "secondPlace",
        description : {text:"secondPlace description", image:"secondPlaceImage"},
        };

    const thirdPlace = {
      id : "thirdPlace",
      description :{text: "thirdPlace description", image:"thirdPlaceImage"},
      };

    const currentInventory = [];
    const storyPlots = [
      { action: { type: ActionType.START},response: {text: "This is the intro of my story... Once upon a time", image:"actionStartImage"}},
      { action: { type: ActionType.MOVE, target: "secondPlace"},response: {text: "a custom plot after MOVE action", image:"actionMoveImage"}},
      { action: { type: ActionType.OPEN, target: "door"},response: {text: "a custom plot after an OPEN action", image:"actionOpenImage"}},
      { action: { type: ActionType.USE, target: "milk"},response: {text: "milk gets cacao", image:"actionUseMilkImage"}},
      { action: { type: ActionType.THE_END},response: {text: "This is THE END", image:"actionENDImage"}},
    ]

    scene = TheRoomEngine([firstPlace,secondPlace, thirdPlace], dialogs, currentInventory, storyPlots).scene;
    player = scene.player;
  })

  test('the engine should return an story plot after MOVE action', () => {
    const expectedActionMovePlotResponse =  {image: "actionMoveImage", text: "a custom plot after MOVE action"};
    const message = player.moveTo("secondPlace");
    expect(message).toStrictEqual(expectedActionMovePlotResponse);
  })

  test('the engine should return a place description if story it has not an storyPlot associated', () => {
    const expectedMoveResponse = {image: "thirdPlaceImage", text: "thirdPlace description"};
    const message = player.moveTo("thirdPlace");
    expect(message).toStrictEqual(expectedMoveResponse);
  })

  test('the engine should return an story plot after open action', () => {
    const expectedActionMovePlotResponse = {image: "actionOpenImage", text: "a custom plot after an OPEN action", responseDefinition: ResponseDefinition.PLOT_SUCCESS};
    const message = player.open("door");
    expect(message).toStrictEqual(expectedActionMovePlotResponse);
  })

  test('the engine should NOT return the storyPlot because has not an associated storyPlot', () => {
    const expectedActionOpenPlotResponse = {image: "doorWithoutOpenPlotOpenMessageImage", text: "the door is opened now you can see more things", responseDefinition: ResponseDefinition.OPEN_MESSAGE};
    const message = player.open("doorWithoutOpenPlot");
    expect(message.getPrimitives()).toStrictEqual(expectedActionOpenPlotResponse);
  })

  test('the engine should return an story plot after use an object with other one', () => {
    const expectedActionMovePlotMessage = {image: "actionUseMilkImage", text: "milk gets cacao"};
    const message = player.use("milk", "cacao");
    expect(message).toStrictEqual(expectedActionMovePlotMessage);
  })

  test('the engine should return the initial StoryPlot', () => {
    const expectedInitialPlotMessage = {text: "This is the intro of my story... Once upon a time", image:"actionStartImage"};
    const message = scene.getInitialPlot();
    expect(message).toStrictEqual(expectedInitialPlotMessage);
  })

  test('the engine should return the FINISH StoryPlot', () => {
    const expectedInitialPlotMessage = {text: "This is THE END", image:"actionENDImage"};
    const message = scene.getTheEndPlot();
    expect(message).toStrictEqual(expectedInitialPlotMessage);
  })
});
