import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export default function(prisma: PrismaClient) {
  const router = Router();

  router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const hashed = await bcrypt.hash(password, 12);
    try {
      const user = await prisma.user.create({
        data: { email, password: hashed }
      });
      res.json({ id: user.id, email: user.email });
    } catch (e) {
      res.status(400).json({ error: "User exists or invalid data" });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "2h" });
    res.json({ token });
  });

  return router;
}
