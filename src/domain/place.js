const {interactiveObjectMapper} = require("../shared/interactiveObjectsMapper");

const Place = ({id, description, smallDescription, objects=[]}) => {
  const interactiveObjects = objects.map(interactiveObjectMapper);

  const getObject = (idObject) =>  {
    return interactiveObjects.find(({id}) => id===idObject);
  };

  const getObjectsDescription = () => {
    return objects.map(({smallDescription}) => `${smallDescription}`).join(", ");
  }
  return {
    id,
    description,
    smallDescription,
    getObject,
    getObjectsDescription,
  }
}

exports.Place = Place;
