"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseController = exports.Response = void 0;
const Response = ({ text, image, responseDefinition }) => {
    return {
        getText: () => text,
        getImage: () => image,
        responseDefinition,
        text,
        image,
        getPrimitives: () => ({ text, image, responseDefinition })
    };
};
exports.Response = Response;
const ResponseController = (responsesConfig) => {
    const data = responsesConfig;
    const getResponse = (responseDefinition) => {
        return (0, exports.Response)(Object.assign(Object.assign({}, data[responseDefinition]), { responseDefinition }));
    };
    return {
        getResponse,
    };
};
exports.ResponseController = ResponseController;
//# sourceMappingURL=responseController.js.map