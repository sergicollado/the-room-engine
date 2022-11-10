const {interactiveObjectMapper} = require("../shared/interactiveObjectsMapper");

const Place = (id, description, objects=[]) => {
  const interactiveObjects = objects.map(interactiveObjectMapper);

  const getObject = (idObject) =>  {
    return interactiveObjects.find(({id}) => id===idObject);
  };

  return {
    id,
    description,
    getObject,
  }
}

exports.Place = Place;
