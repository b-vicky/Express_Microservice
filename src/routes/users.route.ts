import { Router } from "express";
import Users from "../core_controller/users.controller";

const userRouter = Router();

userRouter.post("/create", Users.CreateUser);

userRouter.get("/signin", Users.UserSignIn);

userRouter.get("/:id", Users.FindUser);

userRouter.get("/findAll", Users.FindAllUser);

export default userRouter;
