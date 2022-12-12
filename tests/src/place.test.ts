import { Place, Feature } from "../../src/domain";

describe('place', () => {
  it('should remove an interactive object from a place', () => {
    const place = Place({
      id:"aPlace",
      description: {text:"aDescription"},
      smallDescription:{text:"smallDescription"},
      objects:[{id:"toRemove"}, {id:"toKeep"}]
    });

    place.removeObject("toRemove");

    expect(place.getObject("toRemove")).toBe(undefined);
    const expectedToKeep = "toKeep";
    expect(place.getObject("toKeep").id).toBe(expectedToKeep);
  });

  it('should remove an interactive object from a place when this object is taken', () => {
    const place = Place({
      id:"aPlace",
      description:{text:"aDescription"},
      smallDescription:{text:"smallDescription"},
      objects:[{id:"toRemove", features:[Feature.PORTABLE]}, {id:"toKeep"}]
    });

    const takenObject = place.takeObject("toRemove");

    expect(place.getObject("toRemove")).toBe(undefined);
    expect(takenObject.getPrimitives().id).toBe("toRemove");
  });
});
