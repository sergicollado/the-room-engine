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

  const getDescription = () => {
    const dependantContentMatches = description.text.matchAll(/<if=(.*?)>(.*?)<\/if>/g);
    if(dependantContentMatches.length === 0) {
      return description;
    }

    let responseText = description.text;
    for (const match of dependantContentMatches) {
      const [toReplace, idObject, contentDescription] = match;
      const object = getObject(idObject);
      if(!object){
        responseText = responseText.replace(toReplace,"");
      }else{
        responseText = responseText.replace(toReplace,contentDescription);
      }
    }

    return {...description,text:responseText};
  }

  return {
    id,
    description,
    smallDescription,
    getObject,
    getHiddenObject,
    getObjectsDescription,
    removeObject,
    getPrimitives,
    getDescription
  }
}

exports.Place = Place;
