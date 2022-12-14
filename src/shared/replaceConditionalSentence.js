exports.replaceConditionalSentence = (sentence, getObject) => {
  const dependantContentMatches = sentence.matchAll(/<if=(.*?)>(.*?)<\/if>/g);
  if(dependantContentMatches.length === 0) {
    return sentence;
  }

  let responseText = sentence;
  for (const match of dependantContentMatches) {
    const [toReplace, idObject, contentDescription] = match;
    const object = getObject(idObject);

    let replacement = object? contentDescription : "";
    responseText = responseText.replace(toReplace, replacement);
  }
  return responseText;
}
