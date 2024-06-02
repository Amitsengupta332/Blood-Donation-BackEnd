"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/users/user.route");
const auth_routes_1 = require("../modules/auth/auth.routes");
const request_routes_1 = require("../modules/request/request.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: user_route_1.userRoutes,
    },
    {
        path: "/",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/",
        route: request_routes_1.requestRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
