const {InteractiveObject} = require("./interactiveObjects");

class Place {
  constructor(id, description, objects=[]) {
    this.id= id;
    this.description = description;
    this.interactiveObjects = objects.map((
      { id,
        description,
        features,
        openMessage,
        openedDescription,
        readableText
      }) => new InteractiveObject(id, description, features, {openedDescription, openMessage, readableText}));
  }
  getObject(idObject) {
    return this.interactiveObjects.find(({id}) => id===idObject);
  }
}

exports.Place = Place;
