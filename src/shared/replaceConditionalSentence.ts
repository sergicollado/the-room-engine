
export function replaceConditionalSentence(
  sentence: string,
  getObject: (idObject:string)=>string
  ) {
  const dependantContentMatches = sentence.matchAll(/<if=(.*?)>(.*?)<\/if>/g);

  let responseText = sentence;
  for (const match of dependantContentMatches) {
    const [toReplace, idObject, contentDescription] = match;
    const object = getObject(idObject);

    let replacement = object? contentDescription : "";
    responseText = responseText.replace(toReplace, replacement);
  }
  return responseText;
}
