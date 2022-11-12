const { TheRoomEngine, Feature, ActionType } = require("../../src/domain");
const {dialogs} = require("./dialogs");

const firstPlace = {
  id : "firstPlace",
  description : "first place description",
  smallDescription: "the First place",
  objects: [
    {id: "table", description: "first place description", smallDescription: "a table",},
    {id: "note", description: "a readable an portable note", smallDescription: "a paper note", readableText: "this is a note Text",  features:[Feature.READABLE, Feature.PORTABLE]},
    {id: "door", description: "it's a door", smallDescription: "a little door",features:[Feature.OPENABLE], openMessage: "the door is opened now you can see more things", openDescription: "From this door we can now watch a shadow"},
    {
      id: "doorToUnlock",
      description: "it's a locked door",
      smallDescription: "a locked door",
      features:[Feature.OPENABLE, Feature.LOCKED],
      lockedMessage:"You need a key to open this door",
      openMessage: "the door after was locked  and NOW is open",
      openDescription: "From this door we can now watch a little carrousel",
      useWithActions: [{id:"key", action: ActionType.UNLOCK}]
    },
    {id: "key", smallDescription: "a key", description: "a key", features:[Feature.USABLE, Feature.HIDDEN]}
  ]};

const secondPlace = {
    id : "secondPlace",
    description : "secondPlace description",
    smallDescription: "the Second Place",
    objects: [{
      id: "book",
      description: "book description",
      readableText: "book text content when is read",
      features:[Feature.READABLE]
    }, {
      id: "knife",
      description: "knife description",
      features:[Feature.PORTABLE]
    }]};

const initialPlace = firstPlace;

const places = [
  firstPlace, secondPlace
]
describe('Help', () => {
  const placeOne = {
    id: 'placeOne',
    description: 'placeOne description',
    smallDescription: 'placeOne small description',
    objects: [
      {id: "table", description: "table description", smallDescription: "a table",},
      {id: "door", description: "door description", smallDescription: "a door",},
    ]
  };
  const placeTwo = {
    id: 'placeTwo',
    description: 'placeTwo description',
    smallDescription: 'placeTwo small description',
    objects: [
      {id: "book", description: "book description", smallDescription: "a book",},
      {id: "key", description: "key description", smallDescription: "a key",},
    ]
  };
  const places = [placeOne, placeTwo];

  const currentInventory = [
    {id: "knife", description: "knife description", smallDescription: "a knife",features:[Feature.PORTABLE]},
    {id: "ring", description: "ring description", smallDescription: "a ring", features:[Feature.PORTABLE]},
  ]

  let theRoomEngine;
  beforeEach(() => {
    theRoomEngine = TheRoomEngine(places, dialogs, currentInventory);
  })

  test('Engine should response with current place info, to help player', ()=> {
    const placesToGoMessage = `${dialogs.HELP_PLAYER_CAN_GO} ${placeOne.smallDescription}, ${placeTwo.smallDescription}`;
    const thingsToSee = `${dialogs.HELP_PLAYER_CAN_SEE} a table, a door`;
    const inYourInventory = `${dialogs.HELP_PLAYER_INVENTORY} a knife, a ring`;

    const helpMessage = theRoomEngine.help();

    const expectedHelpMessage = `${placesToGoMessage}, ${thingsToSee}.${dialogs.HELP_PLAYER_CAN_DO}. ${inYourInventory}`;
    expect(helpMessage).toBe(expectedHelpMessage);
  })

  test('Engine should response info about the player has in her inventory', ()=> {
    const expectedHelpMessage = `${dialogs.HELP_PLAYER_INVENTORY} a knife, a ring`;

    const helpMessage = theRoomEngine.inventoryHelp();
    expect(helpMessage).toBe(expectedHelpMessage);
  });
});

describe('Actions in a place', () => {
  let theRoomEngine;
  let player;
  beforeEach(() => {
    theRoomEngine = TheRoomEngine(places, dialogs, []);
    player = theRoomEngine.getPlayer();
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

