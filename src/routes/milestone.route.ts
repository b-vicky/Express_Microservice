import { Router } from "express";
import { Milestone } from "../core_controller/milestone.controller";
import { validateToken } from "../core_controller/auth.controller";

const milestoneRouter = Router();

milestoneRouter.get("/get", validateToken, Milestone.ListMilestone);
milestoneRouter.post("/create", validateToken, Milestone.CreateMilestone);

export default milestoneRouter;
