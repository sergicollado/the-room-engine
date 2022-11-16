const { ActionType } = require("./actions");
const { ResponseDefinition } = require("./responseDefinition");
const { Response } = require("./responseController");

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
  messages,
  useWithActions=[],
  ) => {
  const {openMessage, openDescription, readableText, lockedMessage, unlockMessage, errorUsing} = messages;

  const is = (feature) => {
      return features.includes(feature) ;
    };
  const isNot = (feature) => {
      return !is(feature) ;
    };

  const getOpenMessage= () => {
      return openMessage;
    };
  const unlock = () => {
    removeFeature(Feature.LOCKED);
  };
  const unhide = () => {
    removeFeature(Feature.HIDDEN);
  };

  const getTryToOpenButLockedMessage= () => {
    return lockedMessage;
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
    unhide,
    is,
    isNot,
    getTryToOpenButLockedMessage,
    removeFeature,
    open: () => {
      if(is(Feature.LOCKED)) {
        return Response({...getTryToOpenButLockedMessage(), responseDefinition: ResponseDefinition.IS_LOCKED});
      }

      features.push(Feature.OPEN);
      return Response({...getOpenMessage(), responseDefinition: ResponseDefinition.OPEN_MESSAGE});
    },

    getMessages: () => {
      return messages;
    },

    getDescription: () => {
      if(is(Feature.OPENABLE) && is(Feature.OPEN)) {
        return Response({...openDescription,responseDefinition: ResponseDefinition.SEE_AND_OBJECT});
      }
      return Response({...description,responseDefinition: ResponseDefinition.SEE_AND_OBJECT});
    },

    getReadableResponse: () => {
      return readableText;
    },

    addFeature: (featureToAdd)  => {
      features.push(featureToAdd);
    },

    useWith: (interactiveObject) => {
      const {id, action} = useWithActions.find(({id}) => interactiveObject.id===id) || {};

      if(!id) {
        return;
      }

      if(action === ActionType.UNLOCK) {
        unlock();
        return Response({...unlockMessage, responseDefinition: ResponseDefinition.UNLOCK});
      }

      if(action === ActionType.PLOT) {
        return {responseDefinition: ResponseDefinition.PLOT_SUCCESS};
      }
    }
  }
}

exports.Feature = Feature;
exports.InteractiveObject = InteractiveObject;
