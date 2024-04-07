import to from 'await-to-js';
import { isEmpty } from 'lodash';
import { Request, Response } from 'express';
import { epic1Json } from '../../dummy/epics';
import { epic2Json } from '../../dummy/epics2';
import usersModel from '../schema/users.schema';
import projectsModel from '../schema/projects.schema';
import workspaceModel from '../schema/workspace.schema';

export class Projects {
  static async FetchProjects(req: Request, res: Response) {
    let fetchPayload = new Projects();
    return fetchPayload.fetchAndCreateProjects(req, res);
  }

  static async GetProjects(req: Request, res: Response) {
    let fetchPayload = new Projects();
    return fetchPayload.getProjects(req, res);
  }

  static async UpdateProjects(req: Request, res: Response) {
    let fetchPayload = new Projects();
    return fetchPayload.updateProjects(req, res);
  }

  async fetchAndCreateProjects(request: Request, response: Response) {
    let epicsJson;
    const workspaceID = request?.query?.id;

    // This can be removed if when we are actually making an thirdparty API call since i am loading json from static file.
    const [workspaceFetchFailed, workspaceDetail] = await to(workspaceModel.findById({ _id: workspaceID }));
    if (!workspaceFetchFailed) {
      if (workspaceDetail!.name === 'workspace 1') {
        epicsJson = epic1Json;
      } else {
        epicsJson = epic2Json;
      }
    }
    return await this.createProjects(response, epicsJson!, workspaceID);
  }

  async createProjects(response: Response, epicsObjects: Object[], workspaceID: any) {
    const projectArray: any[] = [];
    epicsObjects.forEach((epic) => {
      const constructedObject = this.constructProjectCreationObject(epic, workspaceID);
      projectArray.push(constructedObject);
    });

    if (!isEmpty(projectArray)) {
      const [writeProjectFailed, projectsCreated] = await to(projectsModel.insertMany(projectArray));
      if (!writeProjectFailed) {
        projectsCreated.forEach(async (project) => {
          const [updateUserFailed, userUpdated] = await to(
            usersModel.updateOne(
              { email: project.assignee },
              {
                $addToSet: {
                  projects: project._id,
                },
              },
              {
                runValidators: true,
              }
            )
          );
          if (updateUserFailed) {
            return response.status(409).send({
              message: 'Projects creation failed when updating user',
              error: updateUserFailed?.message,
            });
          }
        });
        return response.status(201).send({
          message: 'Projects created successfully',
          projects: projectsCreated,
        });
      }
      return response.status(409).send({
        message: 'Projects creation failed',
        error: writeProjectFailed?.message,
      });
    }
  }

  async getProjects(request: Request, response: Response) {
    const [failure, projectsList] = await to(projectsModel.find({}));
    if (!failure) {
      return response.send(projectsList);
    }
    return response.status(500).send(failure);
  }

  async updateProjects(request: Request, response: Response) {
    const projectId = { _id: request.body.id };
    const projectUpdatePayload = request.body.updatePayload;
    const [failure, updatedProject] = await to(projectsModel.findOneAndUpdate(projectId, projectUpdatePayload));
    if (!failure) {
      return response.status(200).send(updatedProject);
    }
    return response.status(500).send(failure);
  }

  constructProjectCreationObject(epicObject: any, workspaceID: string) {
    return {
      title: epicObject.fields.summary,
      description: epicObject.fields.description,
      parentProjectName: epicObject.fields.project.name,
      parentProjectID: epicObject.fields.project.id,
      assignee: epicObject.fields.assignee,
      priority: epicObject.fields.priority.name,
      status: epicObject.fields.status.name,
      workspace: [workspaceID],
    };
  }
}
