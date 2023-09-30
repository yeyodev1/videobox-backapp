"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleHttpError(res, message = 'Oops, something happened', code = 403) {
    res.status(code);
    res.send({ message: message });
}
exports.default = handleHttpError;
