const dialogs = require('./dialogs').dialogs;
const {Player, Place, TheRoomEngine} = require("./domain");

exports.init = () => {
  return dialogs.INIT;
}

const theChaise = new Place(
  id = "theChaise",
  description = dialogs.THE_CHAISE.DESCRIPTION,
  objects= [{id: "table", description: dialogs.THE_CHAISE.OBJECTS.TABLE.DESCRIPTION}]);
const theTable = new Place(
    id = "theTable",
    description = dialogs.THE_TABLE.DESCRIPTION,
    objects= [{
      id: "book",
      description: dialogs.THE_TABLE.OBJECTS.BOOK.DESCRIPTION,
      text: dialogs.THE_TABLE.OBJECTS.BOOK.TEXT,
      isReadable:true
    }, {
      id: "knife",
      description: dialogs.THE_TABLE.OBJECTS.KNIFE.DESCRIPTION,
      isPortable: true
    }]);

const player = new Player(theChaise, []);

const places = [
  theChaise, theTable
]

exports.Player = Player;
exports.places = places;
exports.initialPlace = theChaise;
exports.TheRoomEngine = TheRoomEngine;