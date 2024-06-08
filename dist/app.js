"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHanlder_1 = __importDefault(require("./app/middlewares/globalErrorHanlder"));
const app = (0, express_1.default)();
// app.use(cors());
// app.use(cookieParser());
// setting for enable refresh token functionality
app.use((0, cors_1.default)({ origin: "https://blood-donation-client-woad.vercel.app", credentials: true }));
app.use((0, cookie_parser_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send({
        Message: "Blood donation server..",
    });
});
app.use("/api", routes_1.default);
app.use(globalErrorHanlder_1.default);
exports.default = app;
