import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "../../../ormconfig";
import authRouter from "../routes/auth";
import sweetsRouter from "../routes/sweets";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/sweets", sweetsRouter);

export default app;
