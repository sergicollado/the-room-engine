const { TheRoomEngine, Feature, ActionType } = require("../../src/domain");
const {responses: configResponses} = require("./responses");

describe('Describe variable objects in descriptions', () => {
  let scene;

  beforeEach(() => {
    const firstPlace = {
      id : "firstPlace",
      description :{text:"first place description, contains a drawer,<if=pick> a pick,</if><if=coin> a coin,</if> a door<if=key> and a key</if>", image: "firstPlaceImage"},
      objects: [
        {id: "drawer", description: {text:"a  drawer", image: "drawerImage"},features:[Feature.OPENABLE], openMessage: {text:"the drawer is opened now you can see more things",image:""}, openDescription:{text: "within the drawer we can see now a COIN", image:""}},
        {id: "coin", description: {text:"this is a hidden Object", image: "coinImage"},features:[Feature.HIDDEN]},
        {id: "door", description: {text:"it's a door", image: "doorImage"}, features:[Feature.OPENABLE], openMessage: {text:"the door is opened now you can see more things", image: "openDoorOpen"}, openDescription: {text:"From this door we can now watch a shadow", image: "openDoorDescriptionImage"}},
        {id: "pick", description: {text:"this is a pick", image: "pickImage"}},
        {id: "notebook", description:{text: "this notebook, <if=pen>with a pen next to it</if>", image:"notebookImage"}},
        {id: "pen", description: {text:"ti's a pen",image: "aPenImage"}}
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

    scene = TheRoomEngine({configPlaces:{placeList:[firstPlace,secondPlace]}, configResponses, storyPlots}).scene;
  })

  test('a place should not return a description object when does not exists in a place', () => {
    const expectedDescription = {text:"first place description, contains a drawer, a pick, a door",image:"firstPlaceImage"};
    const place = scene.getCurrentPlace();
    const description = place.getDescription();
    expect(description).toStrictEqual(expectedDescription);
  })

  test('a place should return a description object when exists in a place', () => {
    const expectedDescription = {text:"first place description, contains a drawer, a pick, a door",image:"firstPlaceImage"};
    const place = scene.getCurrentPlace();
    const description = place.getDescription();
    expect(description).toStrictEqual(expectedDescription);
  })

  test('a place should return a description object when exists in a place', () => {
    const expectedDescription = {text:"first place description, contains a drawer, a pick, a door",image:"firstPlaceImage"};
    const place = scene.getCurrentPlace();
    const description = place.getDescription();
    expect(description).toStrictEqual(expectedDescription);
  })


  test('an object should return a related object description when the object exists', () => {
    const expectedDescription = "this notebook, with a pen next to it";
    const object = scene.getCurrentPlace().getObject("notebook");

    const descriptionText = object.getDescription().text;
    expect(descriptionText).toBe(expectedDescription);
  })
});
