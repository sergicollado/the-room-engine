const {interactiveObjectMapper} = require("../shared/interactiveObjectsMapper");
const { Feature } = require("./interactiveObjects");

const Place = ({id, description, smallDescription, objects=[]}) => {
  const interactiveObjects = objects.map(interactiveObjectMapper);

  const getObject = (idObject) =>  {
    return interactiveObjects.find(({id , isNot}) => (id===idObject && isNot(Feature.HIDDEN)));
  };

  const getObjectsDescription = () => {
    return objects.map(({smallDescription}) => `${smallDescription.text}`).join(", ");
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
