import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireAdmin } from "../middleware/auth";

export default function (prisma: PrismaClient) {
  const router = Router();

  // List licenses (admin)
  router.get("/licenses", requireAuth, requireAdmin, async (req, res) => {
    const list = await prisma.license.findMany({ take: 100, orderBy: { createdAt: "desc" } });
    res.json(list);
  });

  // List activations (admin)
  router.get("/activations", requireAuth, requireAdmin, async (req, res) => {
    const list = await prisma.activation.findMany({ take: 200, orderBy: { activatedAt: "desc" } });
    res.json(list);
  });

  // List logs (admin)
  router.get("/logs", requireAuth, requireAdmin, async (req, res) => {
    const logs = await prisma.log.findMany({ take: 200, orderBy: { createdAt: "desc" } });
    res.json(logs);
  });

  return router;
}
