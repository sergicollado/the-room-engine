const Response = ({text, image, responseDefinition}) => {
  return {
    getText: () => text,
    getImage: () => image,
    responseDefinition,
    text,
    image,
    getPrimitives: () => ({text,image,responseDefinition})
  }
}

exports.Response = Response;

exports.ResponseController = (responsesConfig) => {
  const data = responsesConfig;

  const getResponse = (responseDefinition) => {
    return Response({...data[responseDefinition], responseDefinition});
  }

  return {
    getResponse,
  }
}
