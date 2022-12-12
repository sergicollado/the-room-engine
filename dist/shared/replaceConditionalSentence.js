"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceConditionalSentence = void 0;
function replaceConditionalSentence(sentence, getObject) {
    const dependantContentMatches = sentence.matchAll(/<if=(.*?)>(.*?)<\/if>/g);
    let responseText = sentence;
    for (const match of dependantContentMatches) {
        const [toReplace, idObject, contentDescription] = match;
        const object = getObject(idObject);
        let replacement = object ? contentDescription : "";
        responseText = responseText.replace(toReplace, replacement);
    }
    return responseText;
}
exports.replaceConditionalSentence = replaceConditionalSentence;
//# sourceMappingURL=replaceConditionalSentence.js.map