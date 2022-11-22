const { TheRoomEngine, ActionType, Feature } = require("../../src/domain");
const { ResponseDefinition } = require("../../src/domain/responseDefinition");
const {dialogs:configResponses} = require("./responses");

describe('Story Plots', () => {
  let scene;
  let player;
  let engine;
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
          features:[Feature.USABLE_WITH],
          useWithActions: [{id:"cacao", action: ActionType.PLOT}],
        },
        {
          id: "cacao",
          description: {text:"cacao", image:""},
          errorUsing:{text:"it doesn't seem to work", image:"cacaoErrorUsingImage"},
          features:[Feature.USABLE_WITH],
          useWithActions: [{id:"milk", action: ActionType.PLOT}],
        },{
          id: "switch",
          description: {text:"white milk", image:""},
          features:[Feature.USABLE],
          whenUsingMessage: {text:"I lit up the light.", image:"lightImage"}
        },{
          id: "book",
          features:[Feature.READABLE],
          description: {text:"a book", image:""},
          smallDescription: {text:"a book", image:""},
        },
        {
          id: "photo",
          description: {text:"a photo", image:""},
          smallDescription: {text:"a photo", image:""},
          features: [Feature.HIDDEN]
        },
        {
          id: "manual",
          description: {text:"a manual", image:""},
          smallDescription: {text:"a manual", image:""},
          features: [Feature.HIDDEN]
        },
        {
          id: "notebook",
          description: {text:"a notebook", image:""},
          smallDescription: {text:"a photo", image:""},
          features: [Feature.READABLE]
        },
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

    const inventoryConfig = [];
    const storyPlots = [
      { action: { type: ActionType.START},response: {text: "This is the intro of my story... Once upon a time", image:"actionStartImage"}},
      { action: { type: ActionType.MOVE, target: "secondPlace"},response: {text: "a custom plot after MOVE action", image:"actionMoveImage"}},
      { action: { type: ActionType.OPEN, target: "door"},response: {text: "a custom plot after an OPEN action", image:"actionOpenImage"}},
      { action: { type: ActionType.USE, target: "milk"},response: {text: "milk gets cacao", image:"actionUseMilkImage"}},
      { action: { type: ActionType.SEE, target: "book"},trigger: { type: ActionType.UNHIDE, target: "photo"}, response: {text: "the book has been seen and the photo is shown", image:"bookImage"}},
      { action: { type: ActionType.THE_END},response: {text: "This is THE END", image:"actionENDImage"}},
      { action: { type: ActionType.READ, target: "book"},trigger: { type: ActionType.THE_END}, response: {text: "this is the END", image:"endImage"}},
      { action: { type: ActionType.SEE, target: "notebook"},trigger: {type: ActionType.UNHIDE, target: "photo"}, response: {text: "Manual is now visible", image:"manualImage"}},
      { action: { type: ActionType.SEE, target: "notebook"},trigger: {type: ActionType.REMOVE_SIMILAR, target: ActionType.READ}, response: {text: "Manual is now visible", image:"manualImage"}},
      { action: { type: ActionType.READ, target: "notebook"},trigger: {type: ActionType.UNHIDE, target: "photo"}, response: {text: "Manual is now visible", image:"manualImage"}},
      { action: { type: ActionType.READ, target: "notebook"},trigger: {type: ActionType.REMOVE_SIMILAR, target: ActionType.SEE}, response: {text: "Manual is now visible", image:"manualImage"}},
    ]

    engine = TheRoomEngine({configPlaces:{placeList:[firstPlace,secondPlace, thirdPlace]}, configResponses, inventoryConfig, storyPlots});
    scene = engine.scene;
    player = scene.player;
  })

  test('the engine should return an story plot after MOVE action', () => {
    const expectedActionMovePlotResponse =  {image: "actionMoveImage", text: "a custom plot after MOVE action","responseDefinition": "PLOT_SUCCESS"};
    const message = player.moveTo("secondPlace");
    expect(message.getPrimitives()).toStrictEqual(expectedActionMovePlotResponse);
  })

  test('the engine should return an story plot after SEE action', () => {
    const expectedActionMovePlotResponse =  {image: "bookImage", text: "the book has been seen and the photo is shown",responseDefinition:"PLOT_SUCCESS"};
    const message = player.see("book");
    expect(message.getPrimitives()).toStrictEqual(expectedActionMovePlotResponse);

    const expectedUnhideMessage = {
      image: "",
      responseDefinition: "SEE_AND_OBJECT",
      text: "a photo"};
    const unhiddenPhotoMessage = player.see("photo");
    expect(unhiddenPhotoMessage.getPrimitives()).toStrictEqual(expectedUnhideMessage);
  })

  test('the engine should return a place description if story it has not an storyPlot associated', () => {
    const expectedMoveResponse = {image: "thirdPlaceImage", text: "thirdPlace description"};
    const message = player.moveTo("thirdPlace");
    expect(message).toStrictEqual(expectedMoveResponse);
  })

  test('the engine should return an story plot after OPEN action', () => {
    const expectedActionMovePlotResponse = {image: "actionOpenImage", text: "a custom plot after an OPEN action", responseDefinition: ResponseDefinition.PLOT_SUCCESS};
    const message = player.open("door");
    expect(message.getPrimitives()).toStrictEqual(expectedActionMovePlotResponse);
  })

  test('the engine should return an story plot after READ action', () => {
    const expectedActionReadPlotResponse = {image: "endImage", text: "this is the END", responseDefinition: ResponseDefinition.THE_END};
    const message = player.read("book");
    expect(message.getPrimitives()).toStrictEqual(expectedActionReadPlotResponse);
  })

  test('the engine should NOT return the storyPlot because has not an associated storyPlot', () => {
    const expectedActionOpenPlotResponse = {image: "doorWithoutOpenPlotOpenMessageImage", text: "the door is opened now you can see more things", responseDefinition: ResponseDefinition.OPEN_MESSAGE};
    const message = player.open("doorWithoutOpenPlot");
    expect(message.getPrimitives()).toStrictEqual(expectedActionOpenPlotResponse);
  })

  test('the engine should return an story plot after use an object with other one', () => {
    const expectedActionMovePlotMessage = {image: "actionUseMilkImage", text: "milk gets cacao", responseDefinition: ResponseDefinition.PLOT_SUCCESS};
    const message = player.use("milk", "cacao");
    expect(message.getPrimitives()).toStrictEqual(expectedActionMovePlotMessage);
  })

  test('the engine should return the initial StoryPlot', () => {
    const expectedInitialPlotMessage = {text: "This is the intro of my story... Once upon a time", image:"actionStartImage"};
    const message = scene.getInitialPlot();
    expect(message).toStrictEqual(expectedInitialPlotMessage);
  })

  test('the engine should return the continue sentence when the game already started', () => {
    const aPlaceWhereRestart = {
      id : "aPlaceWhereRestart",
      description : {text:"aPlaceWhereRestart description", image:"aPlaceWhereRestart Image"},
      };

    const responses = {
      [ResponseDefinition.RESTART_SESSION]: { text: "This is the intro of my story..."}
    }
    const scene = TheRoomEngine({configPlaces:{placeList:[aPlaceWhereRestart]}, configResponses:responses, continueGame:true}).scene;
    const expectedInitialPlotMessage = {text: "This is the intro of my story...aPlaceWhereRestart description", image:"aPlaceWhereRestart Image"};

    const message = scene.getInitialPlot();
    expect(message).toStrictEqual(expectedInitialPlotMessage);
  })

  test('the engine should return the FINISH StoryPlot', () => {
    const expectedInitialPlotMessage = {text: "This is THE END", image:"actionENDImage"};
    const message = scene.getTheEndPlot();
    expect(message).toStrictEqual(expectedInitialPlotMessage);
  })

  test('the engine should return whenUsingMessage', () => {
    const expectedWhenUsingMessage = {text:"I lit up the light.", image:"lightImage", responseDefinition: ResponseDefinition.USING};
    const message = player.use("switch");
    expect(message.getPrimitives()).toStrictEqual(expectedWhenUsingMessage);
  })

  test('the engine should remove other related plots', () => {
    const expectedActionReadPlotResponse =  {text: "Manual is now visible", image:"manualImage","responseDefinition": "PLOT_SUCCESS"};
    const message = player.read("notebook");
    expect(message.getPrimitives()).toStrictEqual(expectedActionReadPlotResponse);
    expect(engine.getPrimitives().storyPlots.find(({action}) => action.type === ActionType.SEE && action.target ==="notebook")).toBe(undefined);
  })
});
