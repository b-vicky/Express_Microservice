import { Router } from "express";
import { Projects } from "../core_controller/projects.controller";
import { validateToken } from "../core_controller/auth.controller";

const projectRouter = Router();

projectRouter.get("/get", validateToken, Projects.FetchProjects);

export default projectRouter;
