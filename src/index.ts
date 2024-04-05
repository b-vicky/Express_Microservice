import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/users";
import 'dotenv/config'


const app = express();
const db = mongoose.connection;
const port = process.env.PORT;
const dbConnectionURL = process.env.DB_URL;


app.use(express.json());
app.use(cors());

mongoose.connect(`${dbConnectionURL}`);

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

// Custom Routes
app.use('/user', userRouter);

// Add this error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});