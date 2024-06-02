import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHanlder";

const app: Application = express();

// app.use(cors());
// app.use(cookieParser());

// setting for enable refresh token functionality
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Blood donation server..",
  });
});

app.use("/api", router);
app.use(globalErrorHandler);

export default app;
