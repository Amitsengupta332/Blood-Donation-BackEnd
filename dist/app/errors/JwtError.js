"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class jwtError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = jwtError;
