const { InteractiveObject } = require("../domain/interactiveObjects")

const interactiveObjectMapper = ({id,
  description,
  smallDescription,
  features,
  openMessage,
  openDescription,
  readableText,
  lockedMessage,
  unlockMessage,
  errorUsing,
  useWithActions=[],
}) => {
  return InteractiveObject(id, description, smallDescription, features, {openDescription, openMessage, readableText, lockedMessage, unlockMessage, errorUsing}, useWithActions);
}

exports.interactiveObjectMapper = interactiveObjectMapper;
