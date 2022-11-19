const { TheRoomEngine, Feature, ActionType } = require("../../src/domain");
const { ResponseDefinition } = require("../../src/domain/responseDefinition");
const {responses:configResponses} = require("./responses");

describe('Actions requirements and locks', () => {
  let scene;
  let player;

  beforeEach(() => {
    const firstPlace = {
      id : "firstPlace",
      description :{text:"first place description", image: "firstPlaceImage"},
      objects: [
        {id: "table", description: {text:"first place description", image: "tableImage"}},
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

    scene = TheRoomEngine({configPlaces:{placeList:[firstPlace,secondPlace]}, configResponses}).scene;
    player = scene.player;
    inventory = scene.inventory;
  })

  test('the player can open openable things', () => {
    const expectedObjectDescription = {image: "openDoorOpen", text: "the door is opened now you can see more things", responseDefinition: ResponseDefinition.OPEN_MESSAGE};
    const openDoorMessage = player.open("door");
    expect(openDoorMessage.getPrimitives()).toStrictEqual(expectedObjectDescription);
  })

  test('when player try to open not openable things return suitable message', () => {
    const expectedObjectDescription = "message when something are not openable";
    const somethingNotOpenableMessage = player.open("table");
    expect(somethingNotOpenableMessage.text).toBe(expectedObjectDescription);
    expect(somethingNotOpenableMessage.responseDefinition).toBe(ResponseDefinition.NOT_OPENABLE_MESSAGE);
  })

  test('the player see new descriptions when something is open', () => {
    const expectedObjectDescription = {image: "openDoorDescriptionImage", text: "From this door we can now watch a shadow", responseDefinition: ResponseDefinition.SEE_AND_OBJECT};
    player.open("door");
    const openDoorMessage = player.see("door");
    expect(openDoorMessage.getPrimitives()).toStrictEqual(expectedObjectDescription);
  })

  test('player CANNOT open an openable object when is LOCKED', () => {
    const expectedLockedMessage = {image: "toUnlockImage", text: "You need a key to open this door", responseDefinition:ResponseDefinition.IS_LOCKED};
    const doorToUnlockMessage = player.open("doorToUnlock");
    expect(doorToUnlockMessage.getPrimitives()).toStrictEqual(expectedLockedMessage);

    const doorToUnlock = scene.getCurrentPlace().getObject("doorToUnlock");
    expect(doorToUnlock.is(Feature.LOCKED)).toBe(true);
  })

  test('player can use things to open an OPENABLE and LOCKED object', () => {
    const doorToUnlock = scene.getCurrentPlace().getObject("doorToUnlock");
    const response = player.use("key","doorToUnlock");

    const expectMessage =  {
      image: "toUnlockImage",
      responseDefinition: ResponseDefinition.UNLOCK,
      text: "the key turns, and the door opens slowly, from there you can see a small carousel."
    };
    expect({text:response.text, image: response.image, responseDefinition: response.responseDefinition}).toStrictEqual(expectMessage);
    expect(doorToUnlock.isNot(Feature.LOCKED)).toBe(true);
  })

  test('LOCKED objects CANNOT be opened with any object', () => {
    const doorToUnlock = scene.getCurrentPlace().getObject("doorToUnlock");

    const response = player.use("table","doorToUnlock");

    expect(doorToUnlock.is(Feature.LOCKED)).toBe(true);

    const expectMessage = { image: "errorUsingImage", responseDefinition: "ERROR_USING_OBJECT_WITH", text: "it doesn't seem to work"};
    expect(response.getPrimitives()).toStrictEqual(expectMessage);
  })
});
