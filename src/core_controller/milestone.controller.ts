import to from 'await-to-js';
import { Request, Response } from 'express';
import projectsModel from '../schema/projects.schema';
import milestoneModel from '../schema/milestones.schema';

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
    const projectID = request.body.projectID;
    const milestoneObject = this.constructMileStoneObject(request.body);
    const milestoneDetails = new milestoneModel(milestoneObject);
    const [milestoneSavefailure, milestoneCreated] = await to(milestoneDetails.save());
    if (!milestoneSavefailure) {
      const [projectUpdateFailure, updatedProject] = await to(
        projectsModel.updateOne(
          { _id: projectID },
          {
            $addToSet: {
              milestones: milestoneCreated.id,
            },
          },
          {
            runValidators: true,
          }
        )
      );

      if (!projectUpdateFailure) {
        return response.status(200).send({
          Milestone: milestoneCreated.id,
        });
      }
      return response.status(500).send(projectUpdateFailure?.message);
    }
    return response.status(500).send(milestoneSavefailure?.message);
  }

  async listMilestone(request: Request, response: Response) {
    const [failure, milestoneList] = await to(milestoneModel.find({}));
    if (!failure) {
      return response.send(milestoneList);
    }
    return response.status(500).send(failure);
  }

  constructMileStoneObject(reqPayload: any) {
    return {
      name: reqPayload.milestone.name,
      description: reqPayload.milestone.description,
      projectId: reqPayload.projectID,
    };
  }
}

export default Milestone;
