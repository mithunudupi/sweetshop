import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./ormconfig";
import authRouter from "./routes/auth";
import sweetsRouter from "./routes/sweets";

const PORT = process.env.PORT || 4000;

async function main(){
  await AppDataSource.initialize();
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRouter);
  app.use("/api/sweets", sweetsRouter);

  app.get("/", (req,res)=> res.send({ok:true, message:"Sweet Shop API"}));

  app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
}

main().catch(err=>{ console.error("Failed to start:", err); process.exit(1); });
