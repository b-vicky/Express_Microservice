import { Router } from "express";
import usersModel from "../schema/users.model";
import to from "await-to-js";
import bcrypt from "bcrypt";
import  Jwt  from "jsonwebtoken";

const userRouter = Router();

userRouter.post("/create", async (request, response) => {
  const user = new usersModel(request.body);
  const [failure, userValue] = await to(user.save());
  if (!failure) {
    response.send(userValue);
  }
  response.status(500).send(failure);
});

userRouter.get("/signin", async (request, response) => {
  const userEmail = request.body.email;
  const [failureToFind, user] = await to(usersModel.findOne(userEmail));
  if (failureToFind) {
    response.status(500).send(failureToFind);
  }
  if (!user) {
    response.status(404).send("User Not Found!!!");
  }else{
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
    var token = Jwt.sign({
      id: user.id
    },'ExtremeSecretForAwhile', {
      expiresIn: 86400
    });
    response.status(200).send({
      message: "Login successful",
      accessToken: token,
    })
  }
});

userRouter.get("/:id", async (request, response) => {
  const userId = request.params.id;
  const [failure, userValue] = await to(usersModel.findById(userId));
  if (!failure) {
    response.status(200).send(userValue);
  }
  response.status(500).send(failure);
});

userRouter.get("/findAll", async (request, response) => {
  const [failure, userValue] = await to(usersModel.find({}));
  if (!failure) {
    response.send(userValue);
  }
  response.status(500).send(failure);
});

export default userRouter;
