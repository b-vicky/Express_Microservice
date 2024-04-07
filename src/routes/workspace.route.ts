import { Router } from "express";
import { validateToken } from "../core_controller/auth.controller";
import { Workspace } from "../core_controller/workspace.controller";

const workspaceRouter = Router();

workspaceRouter.get("/list", validateToken, Workspace.ListWorkspace);
workspaceRouter.post("/create", validateToken, Workspace.CreateWorkspace);
workspaceRouter.patch("/addUser", validateToken, Workspace.AddUserToWorkspace);

export default workspaceRouter;