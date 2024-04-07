import workspaceModel from '../schema/workspace.schema';
import usersModel, { IUser } from '../schema/users.schema';
import to from 'await-to-js';
import { Request, Response } from 'express';

export class Workspace {
  static async CreateWorkspace(req: Request, res: Response) {
    const workspace = new Workspace();
    return workspace.createWorkspace(req, res);
  }

  static async ListWorkspace(req: Request, res: Response) {
    const workspace = new Workspace();
    return workspace.listWorkspace(req, res);
  }

  static async AddUserToWorkspace(req: Request, res: Response) {
    const workspace = new Workspace();
    return workspace.addUsersToWorkspace(req, res);
  }

  async createWorkspace(request: Request, response: Response) {
    const workspaceDetails = new workspaceModel(request.body);
    const [failure, success] = await to(workspaceDetails.save());
    if (!failure) {
      return response.status(200).send({
        workspace: success.id,
      });
    }
    return response.status(500).send(failure);
  }

  async addUsersToWorkspace(request: Request, response: Response) {
    const workspaceID = request.body.workspace;
    const addedUser = request.body.user;

    await this.checkWorkspaceLimit(response, addedUser);

    const [failureOnWorkspaceUpdate, success] = await to(
      workspaceModel.updateOne(
        { _id: workspaceID },
        {
          $addToSet: {
            users: addedUser,
          },
        },
        {
          runValidators: true
        }
      )
    );
    if (!failureOnWorkspaceUpdate) {
      const [failureOnUserUpdate, updatedUser] = await to(
        usersModel.updateOne(
          { _id: addedUser },
          {
            $addToSet: {
              workspace: workspaceID,
            },
          },
          {
            runValidators: true
          }
        )
      );
      if (!failureOnUserUpdate) {
        return response.status(200).send({
          message: 'User added to workspace',
        });
      }
      return response.status(500).send( failureOnUserUpdate?.message);
    }

    return response.status(500).send(failureOnWorkspaceUpdate?.message);
  }

  async listWorkspace(request: Request, response: Response) {
    const [failure, workspaceList] = await to(workspaceModel.find({}));
    if (!failure) {
      return response.send(workspaceList);
    }
    return response.status(500).send(failure);
  }


  async checkWorkspaceLimit(response: Response, userId: string) {
    const [failureToFindUserWorkspace, workspaceArray] = await to(usersModel.findById({ _id: userId }));
    if(!failureToFindUserWorkspace) {
      if(workspaceArray!.workspace!.length >= 2) {
        return response.status(403).send({
          message: 'User cannot have more than (2) Workspace!'
        })
      }
    }
  }
}

export default Workspace;
