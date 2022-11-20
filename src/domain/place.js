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

  const replaceConditionalSentence = (sentence) => {
    const dependantContentMatches = sentence.matchAll(/<if=(.*?)>(.*?)<\/if>/g);
    if(dependantContentMatches.length === 0) {
      return sentence;
    }

    let responseText = sentence;
    for (const match of dependantContentMatches) {
      const [toReplace, idObject, contentDescription] = match;
      const object = getObject(idObject);

      let replacement = object? contentDescription : "";
      responseText = responseText.replace(toReplace, replacement);
    }
    return responseText;
  }

  const getDescription = () => {
    const replacedText = replaceConditionalSentence(description.text)

    return {...description,text:replacedText};
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
