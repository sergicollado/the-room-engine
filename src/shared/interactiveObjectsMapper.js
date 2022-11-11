const { InteractiveObject } = require("../domain/interactiveObjects")

const interactiveObjectMapper = ({id,
  description,
  smallDescription,
  features,
  openMessage,
  openDescription,
  readableText,
  lockedMessage,
  useWithActions=[]
}) => {
  return InteractiveObject(id, description, smallDescription, features, {openDescription, openMessage, readableText, lockedMessage}, useWithActions);
}

exports.interactiveObjectMapper = interactiveObjectMapper;
