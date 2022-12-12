const { TheRoomEngine, Feature, ActionType } = require("../../src/domain");
const { ResponseDefinition } = require("../../src/domain/responseDefinition");
const {responses: configResponses} = require("./responses");

describe('Hidden Objects behaviour', () => {
  let scene;
  let player;

  beforeEach(() => {
    const firstPlace = {
      id : "firstPlace",
      description :{text:"first place description", image: "firstPlaceImage"},
      objects: [
        {id: "drawer", description: {text:"a  drawer", image: "drawerImage"},features:[Feature.OPENABLE], openMessage: {text:"the drawer is opened now you can see more things",image:""}, openDescription:{text: "within the drawer we can see now a COIN", image:""}},
        {id: "coin", description: {text:"this is a hidden Object", image: "coinImage"},features:[Feature.HIDDEN]},
        {id: "newspaper", description: {text:"this is a hidden newspaper", image: "newspaperImage"},features:[Feature.READABLE, Feature.HIDDEN], readableText:{text:"some newspaper news", image:"newspaperNewsImage"}},
        {id: "door", description: {text:"it's a door", image: "doorImage"}, features:[Feature.OPENABLE], openMessage: {text:"the door is opened now you can see more things", image: "openDoorOpen"}, openDescription: {text:"From this door we can now watch a shadow", image: "openDoorDescriptionImage"}},
        {id: "key", description: {text:"a key", image: "keyImage"}, features:[Feature.USABLE_WITH]}
      ]};

    const secondPlace ={
        id : "secondPlace",
        description : {text:"secondPlace description", image: "secondPlaceImage"},
        objects: [{
          id: "book",
          description: {text:"book description", image: "bookImage"},
          readableText: {text:"book text content when is read", image: "bookImage"},
          features:[Feature.READABLE]
        }, {
          id: "knife",
          description: {text:"knife description", image: "knifeImage"},
          features:[Feature.PORTABLE]
        }]};

    const storyPlots = [
      { action: { type: ActionType.OPEN, target: "drawer"}, trigger: { type: ActionType.UNHIDE, target: "coin"},response: {text: "opening this drawer and a newspaper is shown", image:"drawerImage"}},
      { action: { type: ActionType.OPEN, target: "drawer"}, trigger: { type: ActionType.UNHIDE, target: "newspaper"},response: {text: "opening this drawer and a newspaper is shown", image:"drawerImage"}},
    ]

    scene = TheRoomEngine({configPlaces:{placeList:[firstPlace,secondPlace]}, configResponses, storyPlots}).scene;
    player = scene.player;
  })

  test('the player CANNOT see HIDDEN objects', () => {
    const expectedNotFoundResponse = {responseDefinition: ResponseDefinition.CANNOT_SEE_THIS, text:"message when player cannot see something",image:"cannotSeeImage"};
    const notFoundResponse = player.see("coin");
    expect(notFoundResponse.getPrimitives()).toStrictEqual(expectedNotFoundResponse);
  })

  test('the player can see previously HIDDEN objects after an action allow hem/her to discover them', () => {
    const expectedPlotResponse = {responseDefinition: ResponseDefinition.PLOT_SUCCESS, text:"opening this drawer and a newspaper is shown",image:"drawerImage"};
    const plotOpenResponse = player.open("drawer");
    expect(plotOpenResponse.getPrimitives()).toStrictEqual(expectedPlotResponse);

    const expectedCoinResponse = {text:"this is a hidden Object", image: "coinImage", responseDefinition: ResponseDefinition.SEE_AND_OBJECT};
    const coinResponse = player.see("coin");
    expect(coinResponse.getPrimitives()).toStrictEqual(expectedCoinResponse );
  })

  test('the player can see must than one previously HIDDEN objects after an action allow hem/her to discover them', () => {
    const expectedPlotResponse = {responseDefinition: ResponseDefinition.PLOT_SUCCESS, text:"opening this drawer and a newspaper is shown",image:"drawerImage"};
    const plotOpenResponse = player.open("drawer");
    expect(plotOpenResponse.getPrimitives()).toStrictEqual(expectedPlotResponse);

    const expectedCoinResponse = {text:"this is a hidden Object", image: "coinImage", responseDefinition: ResponseDefinition.SEE_AND_OBJECT};
    const coinResponse = player.see("coin");
    expect(coinResponse.getPrimitives()).toStrictEqual(expectedCoinResponse );

    const expectedNewspaperResponse = {responseDefinition: ResponseDefinition.SEE_AND_OBJECT, text:"this is a hidden newspaper",image:"newspaperImage"};
    const newspaperResponse = player.see("newspaper");
    expect(newspaperResponse.getPrimitives()).toStrictEqual(expectedNewspaperResponse );
  })

  test('the player can read previously HIDDEN objects after an action allow hem/her to discover them', () => {
    player.open("drawer");

    const expectedNewspaperResponse = {responseDefinition: ResponseDefinition.READ_AND_OBJECT, text:"some newspaper news", image:"newspaperNewsImage"};
    const newspaperResponse = player.read("newspaper");
    expect(newspaperResponse.getPrimitives()).toStrictEqual(expectedNewspaperResponse );
  })
});
