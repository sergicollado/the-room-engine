const {interactiveObjectMapper} = require("../shared/interactiveObjectsMapper");
const {replaceConditionalSentence} = require("../shared/replaceConditionalSentence");
const { Feature } = require("./interactiveObjects");

const Place = ({id, description, smallDescription, objects=[]}) => {
  const getObject = (idObject) =>  {
    return interactiveObjects.find(({id , isNot}) => (id===idObject && isNot(Feature.HIDDEN)));
  };

  const takeObject = (idObject) =>  {
    const toTake = getObject(idObject);
    if (!toTake || toTake.isNot(Feature.PORTABLE)) {
      return;
    }
    removeObject(idObject);
    return toTake;
  };

  const sentenceReplacer = (sentence) =>  replaceConditionalSentence(sentence,getObject);
  let interactiveObjects = objects.map((element) => interactiveObjectMapper({...element, sentenceReplacer}));

  const getHiddenObject = (idObject) =>  {
    return interactiveObjects.find(({id , is}) => (id===idObject && is(Feature.HIDDEN)));
  };

  const getObjectsDescription = () => {
    return interactiveObjects.filter(({isNot}) => (isNot(Feature.HIDDEN)))
    .map(({smallDescription}) => `${smallDescription.text}`).join(", ");
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
    const replacedText = replaceConditionalSentence(description.text, getObject)

    return {...description,text:replacedText};
  }

  return {
    id,
    description,
    smallDescription,
    getObject,
    takeObject,
    getHiddenObject,
    getObjectsDescription,
    removeObject,
    getPrimitives,
    getDescription,
  }
}

exports.Place = Place;
