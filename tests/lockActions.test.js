const { Player, TheRoomEngine, Place, Feature, ActionType } = require("../src/domain");


const dialogs = {
  SEE_AN_OBJECT_FROM_INVENTORY: "...see an object from inventory",
  READ_AN_OBJECT_FROM_INVENTORY: "...read from the inventory",
  UNKNOWN_PLACE_TO_GO: "Unknown place to go message",
  GET_OBJECT: "message when player get a portable object and save to inventory",
  CANNOT_SAVE_THIS: "message when player not able to get an object",
  CANNOT_SEE_THIS: "message when player cannot see something",
  CANNOT_READ_THIS: "message when player is trying to read something not readable",
  OPEN_MESSAGE: "message something is open",
  NOT_OPENABLE_MESSAGE: "message when something are not openable",
}

describe('Actions requirements and locks', () => {
  let theRoomEngine;
  let player;
  beforeEach(() => {
    const firstPlace = Place({
      id : "firstPlace",
      description : "first place description",
      objects: [
        {id: "table", description: "first place description"},
        {id: "door", description: "it's a door", features:[Feature.OPENABLE], openMessage: "the door is opened now you can see more things", openDescription: "From this door we can now watch a shadow"},
        {
          id: "doorToUnlock",
          description: "it's a locked door",
          features:[Feature.OPENABLE, Feature.LOCKED],
          lockedMessage:"You need a key to open this door",
          openMessage: "the door after was locked  and NOW is open",
          openDescription: "From this door we can now watch a little carrousel",
          useWithActions: [{id:"key", action: ActionType.UNLOCK}]
        },
        {id: "key", description: "a key", features:[Feature.USABLE]}
      ]});

    const secondPlace = Place({
        id : "secondPlace",
        description : "secondPlace description",
        objects: [{
          id: "book",
          description: "book description",
          readableText: "book text content when is read",
          features:[Feature.READABLE]
        }, {
          id: "knife",
          description: "knife description",
          features:[Feature.PORTABLE]
        }]});

    player = Player(firstPlace, [], dialogs);
    theRoomEngine = TheRoomEngine(player, [firstPlace,secondPlace], dialogs);
  })

  test('the player can open openable things', () => {
    const expectedObjectDescription = "the door is opened now you can see more things";
    const openDoorMessage = player.open("door");
    expect(openDoorMessage).toBe(expectedObjectDescription);
  })

  test('when player try to open not openable things return suitable message', () => {
    const expectedObjectDescription = "message when something are not openable";
    const somethingNotOpenableMessage = player.open("table");
    expect(somethingNotOpenableMessage).toBe(expectedObjectDescription);
  })

  test('the player see new descriptions when something is open', () => {
    const expectedObjectDescription = "From this door we can now watch a shadow";
    player.open("door");
    const openDoorMessage = player.see("door");
    expect(openDoorMessage).toBe(expectedObjectDescription);
  })

  test('player CANNOT open an openable object when is LOCKED', () => {
    const expectedLockedMessage = "You need a key to open this door";
    const doorToUnlockMessage = player.open("doorToUnlock");
    expect(doorToUnlockMessage).toBe(expectedLockedMessage);

    const doorToUnlock = theRoomEngine.getCurrentPlace().getObject("doorToUnlock");
    expect(doorToUnlock.is(Feature.LOCKED)).toBe(true);
  })

  test('player can use things to open an OPENABLE and LOCKED object', () => {
    const key = theRoomEngine.getCurrentPlace().getObject("key");

    const doorToUnlock = theRoomEngine.getCurrentPlace().getObject("doorToUnlock");
    player.use(key).with(doorToUnlock);

    expect(doorToUnlock.isNot(Feature.LOCKED)).toBe(true);
  })

  test('LOCKED objects CANNOT be opened with any object', () => {
    const table = theRoomEngine.getCurrentPlace().getObject("table");

    const doorToUnlock = theRoomEngine.getCurrentPlace().getObject("doorToUnlock");
    player.use(table).with(doorToUnlock);

    expect(doorToUnlock.is(Feature.LOCKED)).toBe(true);
  })
});
