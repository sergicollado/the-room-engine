const {interactiveObjectMapper} = require("../shared/interactiveObjectsMapper");
const { Feature } = require("./interactiveObjects");

const Place = ({id, description, smallDescription, objects=[]}) => {
  let interactiveObjects = objects.map(interactiveObjectMapper);

  const getObject = (idObject) =>  {
    return interactiveObjects.find(({id , isNot}) => (id===idObject && isNot(Feature.HIDDEN)));
  };
  const getHiddenObject = (idObject) =>  {
    return interactiveObjects.find(({id , is}) => (id===idObject && is(Feature.HIDDEN)));
  };

  const getObjectsDescription = () => {
    return objects.map(({smallDescription}) => `${smallDescription.text}`).join(", ");
  }

  const removeObject = (idObject) => {
    interactiveObjects = interactiveObjects.filter(({id}) => {
      return id!==idObject
    })
  }
  const getPrimitives = () => {
    const primitiveObjects = interactiveObjects.map(obj => obj.getPrimitives());
    return {id, description, smallDescription, objects:primitiveObjects};
  }

  return {
    id,
    description,
    smallDescription,
    getObject,
    getHiddenObject,
    getObjectsDescription,
    removeObject,
    getPrimitives
  }
}

exports.Place = Place;
