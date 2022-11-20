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
  whenUsingMessage,
  errorUsing,
  useWithActions=[],
  sentenceReplacer,
}) => {
  return InteractiveObject(id, description, smallDescription, features, {openDescription, openMessage, readableText, lockedMessage, unlockMessage, errorUsing, whenUsingMessage}, useWithActions, sentenceReplacer);
}

exports.interactiveObjectMapper = interactiveObjectMapper;
