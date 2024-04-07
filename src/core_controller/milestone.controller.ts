import milestoneModel from "../schema/milestones.schema";
import to from "await-to-js";
import { Request, Response } from "express";

export class Milestone {

    static async CreateMilestone(req: Request, res: Response) {
        const milestone = new Milestone();
        return milestone.createMilestone(req, res);
    }

    static async ListMilestone(req: Request, res: Response) {
        const milestone = new Milestone();
        return milestone.listMilestone(req, res);
    }

    async createMilestone(request: Request, response: Response) {
        const milestoneDetails = new milestoneModel(request.body);
        const [failure, success] = await to(milestoneDetails.save());
        if (!failure) {
            return response.status(200).send({
                Milestone: success.id
            });
        }
        return response.status(500).send(failure);
    }

    async listMilestone(request: Request, response: Response) {
        const [failure, milestoneList] = await to(milestoneModel.find({}));
        if (!failure) {
            return response.send(milestoneList);
        }
        return response.status(500).send(failure);
    }

}

export default Milestone;
