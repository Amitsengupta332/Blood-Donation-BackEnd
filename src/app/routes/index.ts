import express from "express";
import { userRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { requestRoutes } from "../modules/request/request.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/",
    route: AuthRoutes,
  },
  {
    path: "/",
    route: requestRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
