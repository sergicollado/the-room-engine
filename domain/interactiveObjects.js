
 const Feature = {
  READABLE: "READABLE",
  PORTABLE: "PORTABLE",
  OPENABLE: "OPENABLE",
  OPENED: "OPENED"
}

class InteractiveObject {
  constructor(id, description, features=[], messages={openMessage, openedDescription, readableText} ) {
    this.id = id;
    this.description = description;
    this.features = features;
    this.messages = messages;
  }

  open() {
    this.features.push(Feature.OPENED);
  }

  is(feature) {
    return this.features.includes(feature) ;
  }

  getMessages() {
    return this.messages;
  }

  getDescription() {
    if(this.is(Feature.OPENABLE) && this.is(Feature.OPENABLE)) {
      return this.messages.openedDescription;
    }
    return this.description;
  }
  getText() {
    return this.messages.readableText;
  }

  getOpenMessage() {
    return this.messages.openMessage;
  }
}

exports.Feature = Feature;
exports.InteractiveObject = InteractiveObject;
