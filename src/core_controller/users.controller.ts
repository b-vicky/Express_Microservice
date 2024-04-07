import usersModel from "../schema/users.schema";
import to from "await-to-js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Jwt from "jsonwebtoken";

export class Users {

    static async CreateUser(req: Request, res: Response) {
        const createUser = new Users();
        return createUser.createUsers(req, res);
    }


    static async UserSignIn(req: Request, res: Response) {
        const createUser = new Users();
        return createUser.userSignin(req, res);
    }


    static async FindUser(req: Request, res: Response) {
        const createUser = new Users();
        return createUser.findUser(req, res);
    }

    static async UpdateUser(req: Request, res: Response) {
        const createUser = new Users();
        return createUser.updateUser(req, res);
    }


    static async FindAllUser(req: Request, res: Response) {
        const createUser = new Users();
        return createUser.findAllUsers(req, res);
    }


    async createUsers(request: Request, response: Response) {
        const user = new usersModel(request.body);
        const [failure, userValue] = await to(user.save());
        if (!failure) {
            return response.status(200).send({
                user: userValue.id
            });
        }
        return response.status(500).send(failure);
    }


    async userSignin(request: Request, response: Response) {
        const userEmail = { email: request.body.email };
        const [failureToFind, user] = await to(usersModel.findOne(userEmail));
        if (failureToFind) {
            return response.status(500).send(failureToFind);
        }
        if (!user) {
            return response.status(404).send("User Not Found!!!");
        } else {
            const passMatch = bcrypt.compareSync(
                request.body.password,
                user.password
            );
            // checking if password was valid and send response accordingly
            if (!passMatch) {
                return response.status(401)
                    .send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
            }
            const token = Jwt.sign({
                id: user.id
            }, `${process.env.JWT_SECRET}`, {
                expiresIn: '1h'
            });
            return response.status(200).send({
                message: "Login successful",
                accessToken: token,
            })
        }
    }



    async findUser(request: Request, response: Response) {
        const userId = request.params.id;
        const [failure, userValue] = await to(usersModel.findById(userId));
        if (!failure) {
            return response.status(200).send(userValue);
        }
        return response.status(500).send(failure);
    }

    async updateUser(request: Request, response: Response) {
        const userId = {_id: request.body.id};
        const userUpdatePayload = request.body.updatePayload;
        const [failure, updatedUser] = await to(usersModel.findOneAndUpdate(userId, userUpdatePayload));
        if (!failure) {
            return response.status(200).send(updatedUser);
        }
        return response.status(500).send(failure);
    }

    async findAllUsers(request: Request, response: Response) {
        const [failure, userValue] = await to(usersModel.find({}));
        if (!failure) {
            return response.send(userValue);
        }
        return response.status(500).send(failure);
    }

}

export default Users;
