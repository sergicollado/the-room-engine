const { TheRoomEngine, ActionType } = require("../../src/domain");
const {dialogs} = require("./dialogs");

describe('Story Plots', () => {
  let theRoomEngine;
  let player;
  beforeEach(() => {
    const firstPlace = {
      id : "firstPlace",
      description : "first place description",
    };

    const secondPlace = {
        id : "secondPlace",
        description : "secondPlace description",
        };

    const currentInventory = [];
    const storyPlots = [
      { action: { type: ActionType.MOVE, target: "secondPlace"}, message: "a custom plot after move action"},
    ]

    theRoomEngine = TheRoomEngine([firstPlace,secondPlace], dialogs, currentInventory, storyPlots);
    player = theRoomEngine.getPlayer();
  })

  test('the engine should return an story plot after move action', () => {
    const expectedActionMovePlotMessage = "a custom plot after move action";
    const message = theRoomEngine.moveTo("secondPlace");
    expect(message).toBe(expectedActionMovePlotMessage);
  })

});
