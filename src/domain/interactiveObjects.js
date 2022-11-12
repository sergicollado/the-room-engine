const { ActionType } = require("./actions");

 const Feature = {
  READABLE: "READABLE",
  PORTABLE: "PORTABLE",
  OPENABLE: "OPENABLE",
  OPEN: "OPEN",
  LOCKED: "LOCKED",
  HIDDEN: "HIDDEN",
}

const InteractiveObject = (
  id,
  description,
  smallDescription,
  features=[],
  messages={openMessage:"", openDescription:"", readableText:"", lockedMessage:"", unlockMessage:"", errorUsing:""},
  useWithActions=[]) => {
  const is = (feature) => {
      return features.includes(feature) ;
    };
  const isNot = (feature) => {
      return !is(feature) ;
    };

  const getOpenMessage= () => {
      return messages.openMessage;
    };
  const unlock = () => {
    removeFeature(Feature.LOCKED);
  };

  const getTryToOpenButLockedMessage= () => {
    return messages.lockedMessage;
  };
  const removeFeature = (featureToRemove) => {
    features= features.filter((feature) => { feature!==featureToRemove});
  };

  return {
    id,
    description,
    smallDescription,
    getOpenMessage,
    unlock,
    is,
    isNot,
    getTryToOpenButLockedMessage,
    removeFeature,
    open: () => {
      if(is(Feature.LOCKED)) {
        return getTryToOpenButLockedMessage();
      }

      features.push(Feature.OPEN);
      return getOpenMessage();
    },

    getMessages: () => {
      return messages;
    },

    getDescription: () => {
      if(is(Feature.OPENABLE) && is(Feature.OPEN)) {
        return messages.openDescription;
      }
      return description;
    },

    getText: () => {
      return messages.readableText;
    },

    addFeature: (featureToAdd)  => {
      features.push(featureToAdd);
    },

    useWith: (interactiveObject) => {
      const {id, action} = useWithActions.find(({id}) => interactiveObject.id===id) || {};

      if(!id) {
        return messages.errorUsing;
      }

      if(action === ActionType.UNLOCK) {
        unlock()
        return messages.unlockMessage
      }
    }
  }
}

exports.Feature = Feature;
exports.InteractiveObject = InteractiveObject;
