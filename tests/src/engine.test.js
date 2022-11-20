const { TheRoomEngine, Feature, ActionType } = require("../../src/domain");
const {responses:configResponses} = require("./responses");

const firstPlace = {
  id : "firstPlace",
  description : "first place description",
  smallDescription: {text:"the First place",image:""},
  objects: [
    {id: "table", description: {text:"first place description", image:""}, smallDescription: {text:"a table",image:""}},
    {id: "note", description: {text:"a readable an portable note",image:""}, smallDescription: {text:"a paper note",image:""}, readableText: {text:"this is a note Text",image:""},  features:[Feature.READABLE, Feature.PORTABLE]},
    {id: "door", description: {text:"it's a door",image:""}, smallDescription: {text:"a little door",image:""},features:[Feature.OPENABLE], openMessage: {text:"the door is opened now you can see more things",image:""}, openDescription: {text:"From this door we can now watch a shadow",image:""}},
    {
      id: "doorToUnlock",
      description: {text:"it's a locked door",image:""},
      smallDescription: {text:"a locked door",image:""},
      features:[Feature.OPENABLE, Feature.LOCKED],
      lockedMessage: {text:"You need a key to open this door",image:""},
      openMessage: {text:"the door after was locked  and NOW is open",image:""},
      openDescription: {text:"From this door we can now watch a little carrousel",image:""},
      useWithActions: [{id:"key", action: ActionType.UNLOCK}]
    },
    {id: "key", smallDescription: {text:"a key",image:""}, description: {text:"a key",image:""}, features:[Feature.HIDDEN]},
    {id: "pool", description: {text:"door description",image:""}, smallDescription: {text:"a pool",image:""},
    features: [Feature.USABLE], whenUsingMessage:{text:"I don't feel like swimming in the pool right now."}
  },
  ]};

const secondPlace = {
    id : "secondPlace",
    description : {text:"secondPlace description",image:""},
    smallDescription: {text:"the Second Place",image:""},
    objects: [{
      id: "book",
      description: {text:"book description",image:""},
      readableText: {text:"book text content when is read",image:""},
      features:[Feature.READABLE]
    }, {
      id: "knife",
      description: {text:"knife description",image:""},
      features:[Feature.PORTABLE]
    }]};

const initialPlace = "firstPlace";

const placeList = [
  firstPlace, secondPlace
]
describe('Help', () => {
  const placeOne = {
    id: 'placeOne',
    description: {text:'placeOne description',image:""},
    smallDescription: {text:'placeOne small description',image:""},
    objects: [
      {id: "table", description: {text:"table description",image:""}, smallDescription: {text:"a table",image:""}},
      {id: "door", description: {text:"door description",image:""}, smallDescription: {text:"a door",image:""}},
    ]
  };
  const placeTwo = {
    id: 'placeTwo',
    description: 'placeTwo description',
    smallDescription: {text:'placeTwo small description',image:""},
    objects: [
      {id: "book", description: {text:"book description",image:""}, smallDescription: {text:"a book",image:""}},
      {id: "key", description: {text:"key description",image:""}, smallDescription: {text:"a key",image:""}},
    ]
  };
  const placeList = [placeOne, placeTwo];

  const inventoryConfig = [
    {id: "knife", description: {text:"knife description",image:""}, smallDescription: {text:"a knife",image:""},features:[Feature.PORTABLE]},
    {id: "ring", description: {text:"ring description",image:""}, smallDescription: {text:"a ring",image:""}, features:[Feature.PORTABLE]},
  ]

  let scene;
  beforeEach(() => {
    scene = TheRoomEngine({configPlaces:{placeList}, configResponses, inventoryConfig}).scene;
  })

  test('Engine should response with current place info, to help player', ()=> {
    const placesToGoMessage = `${configResponses.HELP_PLAYER_CAN_GO.text} ${placeOne.smallDescription.text} or ${placeTwo.smallDescription.text}`;
    const thingsToSee = `${configResponses.HELP_PLAYER_CAN_SEE.text} a table, a door`;
    const inYourInventory = `${configResponses.HELP_PLAYER_INVENTORY.text} a knife, a ring`;

    const helpMessage = scene.help().text;

    const expectedHelpMessage = `${placesToGoMessage}. ${thingsToSee}. ${configResponses.HELP_PLAYER_CAN_DO.text}. ${inYourInventory}`;
    expect(helpMessage).toBe(expectedHelpMessage);
  })

  test('Engine should response info about what player has in inventory', ()=> {
    const expectedHelpMessage = `${configResponses.HELP_PLAYER_INVENTORY.text} a knife, a ring`;

    const helpMessage = scene.inventoryHelp().text;
    expect(helpMessage).toBe(expectedHelpMessage);
  });
});

describe('Actions in a place', () => {
  let scene;
  let player;
  let inventory;
  beforeEach(() => {
    scene = TheRoomEngine({configPlaces:{placeList}, configResponses}).scene;
    player = scene.player;
    inventory = scene.inventory;
  })
  test('the player can see an object', () => {
    const expectedObjectDescription = "first place description";
    const objectSeen = player.see("table").text;
    expect(objectSeen).toBe(expectedObjectDescription);
  })

  test('the player CANNOT see an object', () => {
    const expectedCannotSeeMessage = configResponses.CANNOT_SEE_THIS.text;
    const objectSeen = player.see("unknownObject").text;
    expect(objectSeen).toBe(expectedCannotSeeMessage);
  })

  test('the player can move to another place', () => {
    const expectedPosition = "secondPlace";
    player.moveTo(expectedPosition);
    expect(scene.getCurrentPlace().id).toBe(expectedPosition);
  })

  test('the engine return a message when player CANNOT move', () => {
    const anUnknownPlace = "any unknown place";

    const message = player.moveTo(anUnknownPlace).getText();

    const expectedPosition = initialPlace;
    expect(scene.getCurrentPlace().id).toBe(expectedPosition);
    const expectedMessage = configResponses.UNKNOWN_PLACE_TO_GO.text;
    expect(message).toBe(expectedMessage)
  })

  test('the player can read a readable object', () => {
    const expectedObjectText = "book text content when is read";
    player.moveTo("secondPlace");
    const objectText = player.read("book").text;
    expect(objectText).toBe(expectedObjectText);
  })

  test('the player CANNOT read a not readable object', () => {
    const expectedObjectText = configResponses.CANNOT_READ_THIS.text;
    player.moveTo("secondPlace");
    const objectText = player.read("knife").text;
    expect(objectText).toBe(expectedObjectText);
  })

  test('the player can save to inventory a portable object', () => {
    player.moveTo("secondPlace");

    const expectedGetTheObjectMessage = configResponses.GET_OBJECT.text;
    const addToInventoryMessage = inventory.add("knife").text;
    expect(addToInventoryMessage).toBe(expectedGetTheObjectMessage);
    expect(inventory.has("knife")).toBe(true);
  })

  test('the player return a non portable message if it try to get a noPortable object', () => {
    player.moveTo("secondPlace");

    const expectedGetTheObjectMessage = configResponses.CANNOT_SAVE_THIS.text;
    const addToInventoryMessage = inventory.add("book").text;
    expect(addToInventoryMessage).toBe(expectedGetTheObjectMessage);
    expect(inventory.has("book")).toBe(false);
  })

  test('the player can see a previously saved object even in other place', () => {
    player.moveTo("secondPlace");
    inventory.add("knife");
    player.moveTo("firstPlace");

    const expectedObjectDescription = "knife description"+configResponses.SEE_AN_OBJECT_FROM_INVENTORY.text;
    const objectSeen = player.see("knife").text;
    expect(objectSeen).toBe(expectedObjectDescription);
  })

  test('the player can read a previously saved object even in other place if is readable', () => {
    const expectedObjectText = "this is a note Text";
    inventory.add("note");
    player.moveTo("secondPlace");

    const expectedObjectTextFromInventory = expectedObjectText+configResponses.READ_AN_OBJECT_FROM_INVENTORY.text;
    const text = player.read("note").text;
    expect(text).toBe(expectedObjectTextFromInventory);
  })

  test('the player can use a usable object', () => {
    const expectedText = "I don't feel like swimming in the pool right now.";
    const response = player.use("pool");
    expect(response.text).toBe(expectedText);
  })

});

