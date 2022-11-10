const { InteractiveObject } = require("../domain/interactiveObjects")

const interactiveObjectMapper = ({id,
  description,
  features,
  openMessage,
  openDescription,
  readableText,
  lockedMessage,
  useWithActions=[]
}) => {
  return InteractiveObject(id, description, features, {openDescription, openMessage, readableText, lockedMessage}, useWithActions);
}

exports.interactiveObjectMapper = interactiveObjectMapper;
