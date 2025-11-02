import { Router } from "express";
import { AppDataSource } from "../../../ormconfig";
import { Sweet } from "../entity/Sweet";
import { authMiddleware, adminOnly, AuthRequest } from "../middleware/auth";

const router = Router();

// Create sweet (protected)
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { name, category, price, quantity } = req.body;
  if(!name || !category || price == null || quantity == null) return res.status(400).json({error:"Missing fields"});
  const repo = AppDataSource.getRepository(Sweet);
  const sweet = repo.create({ name, category, price: Number(price), quantity: Number(quantity) });
  await repo.save(sweet);
  res.json(sweet);
});

// List sweets (public)
router.get("/", async (req, res) => {
  const repo = AppDataSource.getRepository(Sweet);
  const list = await repo.find();
  res.json(list);
});

// Search
router.get("/search", async (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  const repo = AppDataSource.getRepository(Sweet);
  const qb = repo.createQueryBuilder("s");
  if(q) qb.andWhere("s.name LIKE :q", { q: `%${q}%` });
  if(category) qb.andWhere("s.category = :cat", { cat: category });
  if(minPrice) qb.andWhere("s.price >= :min", { min: Number(minPrice) });
  if(maxPrice) qb.andWhere("s.price <= :max", { max: Number(maxPrice) });
  const results = await qb.getMany();
  res.json(results);
});

// Update
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const repo = AppDataSource.getRepository(Sweet);
  const sweet = await repo.findOneBy({ id });
  if(!sweet) return res.status(404).json({error:"Not found"});
  const { name, category, price, quantity } = req.body;
  if(name) sweet.name = name;
  if(category) sweet.category = category;
  if(price != null) sweet.price = Number(price);
  if(quantity != null) sweet.quantity = Number(quantity);
  await repo.save(sweet);
  res.json(sweet);
});

// Delete (admin)
router.delete("/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const repo = AppDataSource.getRepository(Sweet);
  const sweet = await repo.findOneBy({ id });
  if(!sweet) return res.status(404).json({error:"Not found"});
  await repo.remove(sweet);
  res.json({ok:true});
});

// Purchase - decrease quantity
router.post("/:id/purchase", authMiddleware, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const qty = Number(req.body.quantity || 1);
  const repo = AppDataSource.getRepository(Sweet);
  const sweet = await repo.findOneBy({ id });
  if(!sweet) return res.status(404).json({error:"Not found"});
  if(sweet.quantity < qty) return res.status(400).json({error:"Not enough stock"});
  sweet.quantity -= qty;
  await repo.save(sweet);
  res.json(sweet);
});

// Restock - admin only
router.post("/:id/restock", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const qty = Number(req.body.quantity || 1);
  const repo = AppDataSource.getRepository(Sweet);
  const sweet = await repo.findOneBy({ id });
  if(!sweet) return res.status(404).json({error:"Not found"});
  sweet.quantity += qty;
  await repo.save(sweet);
  res.json(sweet);
});

export default router;
