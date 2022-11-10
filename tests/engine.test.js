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

const firstPlace = Place({
  id : "firstPlace",
  description : "first place description",
  objects: [
    {id: "table", description: "first place description"},
    {id: "note", description: "a readable an portable note", readableText: "this is a note Text",  features:[Feature.READABLE, Feature.PORTABLE]},
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

const initialPlace = firstPlace;

const places = [
  firstPlace, secondPlace
]

describe('Actions in a place', () => {
  let theRoomEngine;
  let player;
  beforeEach(() => {
    player = Player(initialPlace, [], dialogs);
    theRoomEngine = TheRoomEngine(player, places, dialogs);
  })
  test('the player can see an object', () => {
    const expectedObjectDescription = "first place description";
    const objectSeen = player.see("table");
    expect(objectSeen).toBe(expectedObjectDescription);
  })

  test('the player CANNOT see an object', () => {
    const expectedCannotSeeMessage = dialogs.CANNOT_SEE_THIS;
    const objectSeen = player.see("unknownObject");
    expect(objectSeen).toBe(expectedCannotSeeMessage);
  })

  test('the player can move to another place', () => {
    const expectedPosition = "secondPlace";
    theRoomEngine.moveTo(expectedPosition);
    expect(theRoomEngine.getCurrentPlace().id).toBe(expectedPosition);
  })

  test('the engine return a message when player CANNOT move', () => {
    const anUnknownPlace = "any unknown place";

    const message = theRoomEngine.moveTo(anUnknownPlace);

    const expectedPosition = initialPlace;
    expect(theRoomEngine.getCurrentPlace().id).toBe(expectedPosition.id);
    const expectedMessage = dialogs.UNKNOWN_PLACE_TO_GO;
    expect(message).toBe(expectedMessage)
  })

  test('the player can read a readable object', () => {
    const expectedObjectText = "book text content when is read";
    theRoomEngine.moveTo("secondPlace");
    const objectText = player.readObject("book");
    expect(objectText).toBe(expectedObjectText);
  })

  test('the player CANNOT read a not readable object', () => {
    const expectedObjectText = dialogs.CANNOT_READ_THIS;
    theRoomEngine.moveTo("secondPlace");
    const objectText = player.readObject("knife");
    expect(objectText).toBe(expectedObjectText);
  })

  test('the player can save to inventory a portable object', () => {
    theRoomEngine.moveTo("secondPlace");

    const expectedGetTheObjectMessage = dialogs.GET_OBJECT;
    const getObjectMessage = player.getObject("knife");
    expect(getObjectMessage).toBe(expectedGetTheObjectMessage);
    expect(player.has("knife")).toBe(true);
  })

  test('the player return a non portable message if it try to get a noPortable object', () => {
    theRoomEngine.moveTo("secondPlace");

    const expectedGetTheObjectMessage = dialogs.CANNOT_SAVE_THIS;
    const getObjectMessage = player.getObject("book");
    expect(getObjectMessage).toBe(expectedGetTheObjectMessage);
    expect(player.has("book")).toBe(false);
  })

  test('the player can see a previously saved object even in other place', () => {
    theRoomEngine.moveTo("secondPlace");
    player.getObject("knife");
    theRoomEngine.moveTo("firstPlace");

    const expectedObjectDescription = "knife description"+dialogs.SEE_AN_OBJECT_FROM_INVENTORY;
    const objectSeen = player.see("knife");
    expect(objectSeen).toBe(expectedObjectDescription);
  })

  test('the player can read a previously saved object even in other place if is readable', () => {
    const expectedObjectText = "this is a note Text";
    player.getObject("note");
    theRoomEngine.moveTo("secondPlace");

    const expectedObjectTextFromInventory = expectedObjectText+dialogs.READ_AN_OBJECT_FROM_INVENTORY;
    const text = player.readObject("note");
    expect(text).toBe(expectedObjectTextFromInventory);
  })
});

