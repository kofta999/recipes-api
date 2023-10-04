import express from "express";
import mongoose from "mongoose";
import recipeRouter from "./routes/recipes";
import authRouter from "./routes/auth";
import { errorHandler } from "./util/errorHandler";

const app = express();

app.use(express.json());
app.use("/recipes", recipeRouter);
app.use("/", authRouter);

app.use(errorHandler);

await mongoose.connect(process.env.DATABASE_URI!);
app.listen(3000, () => console.log("connected on port 3000"));
