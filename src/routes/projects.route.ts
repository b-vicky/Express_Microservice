import { Router } from "express";
import { Projects } from "../core_controller/projects.controller";
import { validateToken } from "../core_controller/auth.controller";

const projectRouter = Router();

projectRouter.get("/", validateToken, Projects.GetProjects);
projectRouter.get("/create", validateToken, Projects.FetchProjects);
projectRouter.patch("/update", validateToken, Projects.UpdateProjects);

export default projectRouter;
