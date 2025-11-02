import { Router } from "express";
import { AppDataSource } from "../../../ormconfig";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET";

router.post("/register", async (req, res) => {
  const { email, password, isAdmin } = req.body;
  if(!email || !password) return res.status(400).json({error:"email and password required"});
  const repo = AppDataSource.getRepository(User);
  const exists = await repo.findOneBy({ email });
  if(exists) return res.status(400).json({error:"Email already registered"});
  const hashed = await bcrypt.hash(password, 10);
  const user = repo.create({ email, password: hashed, isAdmin: !!isAdmin });
  await repo.save(user);
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({error:"email and password required"});
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOneBy({ email });
  if(!user) return res.status(400).json({error:"Invalid credentials"});
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(400).json({error:"Invalid credentials"});
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
});

export default router;
