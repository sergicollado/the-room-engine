const { Feature, ActionType, TheRoomEngine } = require("../../src/domain");

describe('Inventory', () => {
  it('should return the primitives', () => {
    const inventoryConfig = [
      {id: "knife", description: {text:"knife description",image:""}, smallDescription: {text:"a knife",image:""},features:[Feature.PORTABLE]},
      {id: "ring", description: {text:"ring description",image:""}, smallDescription: {text:"a ring",image:""}, features:[Feature.PORTABLE]},
    ];
    const { description, smallDescription} = ["a description", "anSmallDescription"];
    const engine = TheRoomEngine({configPlaces:{placeList:[{id:"aPlace",description, smallDescription}]}, configResponses:{}, inventoryConfig});
    const {inventory: inventoryPrimitives} = engine.getPrimitives();

    const messages  ={
      errorUsing: undefined,
      lockedMessage: undefined,
      openDescription: undefined,
      openMessage: undefined,
      readableText: undefined,
      unlockMessage: undefined,
    }
   const expectedInventory = [
      {...inventoryConfig[0], messages, useWithActions:[]},
      {...inventoryConfig[1], messages, useWithActions:[]}];

    expect(inventoryPrimitives).toStrictEqual(expectedInventory);
  });
});

describe('Primitives from Places', () => {
  it('should return Places primitives', () => {
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
        }]}

    const engine = TheRoomEngine({configPlaces:{placeList:[firstPlace,secondPlace]}, configResponses:{}});
    const {places: placesPrimitives} = engine.getPrimitives();


    const primitiveFirst = {id:placesPrimitives[0].id, description:placesPrimitives[0].description} ;
    expect(primitiveFirst).toEqual({id:firstPlace.id, description:firstPlace.description});
    const expectedFirstPlaceObjectsLength = 4;
    expect(placesPrimitives[0].objects.length).toEqual(expectedFirstPlaceObjectsLength);

    const primitivesSecondPlace = {id:placesPrimitives[1].id, description:placesPrimitives[1].description} ;
    expect(primitivesSecondPlace).toEqual({id:secondPlace.id, description:secondPlace.description});
    const expectedSecondPlaceObjectsLength = 2;
    expect(placesPrimitives[1].objects.length).toEqual(expectedSecondPlaceObjectsLength);
  })
})

describe('Player current place', () => {
  it('should return the player current place ID', () => {
    const { description, smallDescription} = ["a description", "anSmallDescription"];
    const placeList = [
      {id:"aPlace",description, smallDescription}, {id:"anotherPlace",description, smallDescription}
    ];

    const {scene, getPrimitives} = TheRoomEngine({configPlaces:{placeList}, configResponses:{}});
    const {player} = scene;
    player.moveTo("anotherPlace");

    const {currentPlace} = getPrimitives();

    const expectedPlace = "anotherPlace";
    expect(currentPlace).toStrictEqual(expectedPlace);
  });
});
