import { Router } from "express";
import Users from "../core_controller/users.controller";
import { validateToken } from "../core_controller/auth.controller";

const userRouter = Router();

userRouter.get("/signin", Users.UserSignIn);

userRouter.post("/create", Users.CreateUser);

userRouter.patch("/update", validateToken, Users.UpdateUser);

userRouter.get("/findAll", validateToken, Users.FindAllUser);

userRouter.get("/:id", validateToken, Users.FindUser);


export default userRouter;
