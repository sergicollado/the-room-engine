const { TheRoomEngine, Feature, ActionType } = require("../../src/domain");
const { ResponseDefinition } = require("../../src/domain/responseDefinition");
const {responses} = require("./responses");

describe('Hidden Objects behaviour', () => {
  let scene;
  let player;
  let inventory;

  beforeEach(() => {
    const firstPlace = {
      id : "firstPlace",
      description :{text:"first place description", image: "firstPlaceImage"},
      objects: [
        {id: "table", description: {text:"first place description", image: "tableImage"}},
        {id: "coin", description: {text:"this is a hidden Object", image: "coinImage"},features:[Feature.HIDDEN]},
        {id: "door", description: {text:"it's a door", image: "doorImage"}, features:[Feature.OPENABLE], openMessage: {text:"the door is opened now you can see more things", image: "openDoorOpen"}, openDescription: {text:"From this door we can now watch a shadow", image: "openDoorDescriptionImage"}},
        {
          id: "doorToUnlock",
          description: {text:"it's a locked door", image: "toUnlockImage"},
          features:[Feature.OPENABLE, Feature.LOCKED],
          lockedMessage: {text:"You need a key to open this door", image: "toUnlockImage"},
          openMessage:  {text:"the door after was locked  and NOW is open", image: "toUnlockImage"},
          openDescription: {text:"From this door we can now watch a little carrousel", image: "toUnlockImage"},
          unlockMessage: {text:"the key turns, and the door opens slowly, from there you can see a small carousel.", image: "toUnlockImage"},
          errorUsing: {text:"it doesn't seem to work", image: "toUnlockImage"},
          useWithActions: [{id:"key", action: ActionType.UNLOCK}],
        },
        {id: "key", description: {text:"a key", image: "keyImage"}, features:[Feature.USABLE]}
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
      { action: { type: ActionType.OPEN, target: "drawer"}, trigger: { type: ActionType.UNHIDE, target: "coin"},response: {text: "opening this drawer a COIN is showed", image:"drawerImage"}},
    ]
    const currentInventory = [];
    scene = TheRoomEngine([firstPlace,secondPlace], responses, currentInventory, storyPlots).scene;
    player = scene.player;
    inventory = scene.inventory;
  })

  test('the player CANNOT see HIDDEN objects', () => {
    const expectedNotFoundResponse = {responseDefinition: ResponseDefinition.CANNOT_SEE_THIS, text:"message when player cannot see something",image:"cannotSeeImage"};
    const notFoundResponse = player.see("coin");
    expect(notFoundResponse.getPrimitives()).toStrictEqual(expectedNotFoundResponse);
  })

  test('the player can see previously HIDDEN objects after an action allow hem/her to discover them', () => {
    const expectedNotFoundResponse = {responseDefinition: ResponseDefinition.CANNOT_SEE_THIS, text:"message when player cannot see something",image:"cannotSeeImage"};
    const notFoundResponse = player.see("coin");
    expect(notFoundResponse.getPrimitives()).toStrictEqual(expectedNotFoundResponse);
  })

});
