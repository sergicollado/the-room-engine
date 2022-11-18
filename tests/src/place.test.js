const { Place } = require("../../src/domain");

describe('place', () => {
  it('should remove an interactive object from a place', () => {
    const place = Place({
      id:"aPlace",
      description:"aDescription",
      smallDescription:"smallDescription",
      objects:[{id:"toRemove"}, {id:"toKeep"}]
    });

    place.removeObject("toRemove");

    expect(place.getObject("toRemove")).toBe(undefined);
    const expectedToKeep = "toKeep";
    expect(place.getObject("toKeep").id).toBe(expectedToKeep);
  });

});
