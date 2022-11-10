const app = require('../app');
const dialogs = require('../dialogs').dialogs;

const { Player, TheRoomEngine, initialPlace, places } = app;

describe('Initial state', () => {
  let theRoomEngine;
  let player;
  beforeEach(() => {
    player = Player(initialPlace, []);
    theRoomEngine = TheRoomEngine(player, places, dialogs);
  })

  test('app should return init message when init function is called', () => {
    expect(app.init()).toBe(dialogs.INIT);
  });

  test('at the start player should be in the initial worldPosition', () => {
    const expectedPosition = initialPlace.id;

    expect(theRoomEngine.getCurrentPlace().id).toBe(expectedPosition);
  })

  test('from the current place player can look around', () => {
    const tableDescription = "una antigua mesa de madera";
    const mirrorDescription = "una antigua mesa de madera";
    const closetDescription = "una antigua mesa de madera";
    const expectedDescription = `a tu alrededor puedes observar: ${tableDescription}, ${mirrorDescription} y ${closetDescription}`;
    expect(theRoomEngine.getCurrentPlace().description).toBe(expectedDescription);
  })

});
