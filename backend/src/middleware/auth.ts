import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../../ormconfig";
import { User } from "../entity/User";

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET";

export interface AuthRequest extends Request {
  user?: User;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction){
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith("Bearer ")) return res.status(401).json({error:"Missing token"});
  const token = auth.slice(7);
  try{
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id: payload.id });
    if(!user) return res.status(401).json({error:"User not found"});
    req.user = user;
    next();
  }catch(err){
    return res.status(401).json({error:"Invalid token"});
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction){
  if(!req.user) return res.status(401).json({error:"Missing user"});
  if(!req.user.isAdmin) return res.status(403).json({error:"Admin only"});
  next();
}
