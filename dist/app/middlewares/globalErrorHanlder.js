"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const globalErrorHandler = (error, req, res, next) => {
    let status = error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let success = error.status || false;
    let message = error.message || `something wen't wrong`;
    let errorDetails = error || [];
    if (error instanceof zod_1.ZodError) {
        const issues = error.errors.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));
        status = http_status_1.default.BAD_REQUEST;
        (success = false),
            (message = message = issues.map((error) => error.message).join(". ")),
            (errorDetails = { issues });
    }
    else if (errorDetails.statusCode === 401) {
        status = http_status_1.default.UNAUTHORIZED;
        (success = false),
            (message = message = error.message),
            (errorDetails = "unauthorized error");
    }
    res.status(status).json({
        success,
        message,
        errorDetails,
    });
};
exports.default = globalErrorHandler;
