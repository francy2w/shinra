import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { signContent } from "../utils/sign";

export default function (prisma: PrismaClient) {
  const router = Router();

  // Create license (admin)
  router.post("/create", requireAuth, async (req: AuthRequest, res) => {
    if (!req.authUser || req.authUser.role !== "admin") return res.status(403).json({ error: "admin required" });
    const { key, expiresAt, meta } = req.body;
    if (!key) return res.status(400).json({ error: "key required" });
    try {
      const license = await prisma.license.create({
        data: { key, expiresAt: expiresAt ? new Date(expiresAt) : null, meta }
      });
      res.json(license);
    } catch (e) {
      res.status(400).json({ error: "Could not create license" });
    }
  });

  // Activate license (user)
  router.post("/activate", requireAuth, async (req: AuthRequest, res) => {
    const { key, fingerprint } = req.body;
    if (!key) return res.status(400).json({ error: "key required" });
    const license = await prisma.license.findUnique({ where: { key } });
    if (!license) return res.status(404).json({ error: "license not found" });
    if (license.revoked) return res.status(403).json({ error: "license revoked" });
    if (license.expiresAt && new Date() > license.expiresAt) return res.status(403).json({ error: "license expired" });

    // If license already bound to a fingerprint, enforce binding
    if (license.fingerprint && fingerprint && license.fingerprint !== fingerprint) {
      return res.status(403).json({ error: "license bound to different device" });
    }

    // Bind fingerprint if provided and not yet bound (optional)
    if (fingerprint && !license.fingerprint) {
      await prisma.license.update({ where: { id: license.id }, data: { fingerprint } });
    }

    // create activation record
    const activation = await prisma.activation.create({
      data: {
        licenseId: license.id,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || undefined,
        fingerprint: fingerprint || undefined
      }
    });

    // Log a message
    await prisma.log.create({
      data: {
        level: "info",
        message: `License ${license.key} activated by user ${req.authUser?.sub}`,
        userId: req.authUser?.sub
      }
    });

    res.json({ ok: true, activationId: activation.id });
  });

  // Download signed artifact (requires license key)
  router.get("/artifact/:name", requireAuth, async (req: AuthRequest, res) => {
    const name = req.params.name;
    const key = req.query.key as string | undefined;
    if (!key) return res.status(400).json({ error: "license key query param required" });

    const license = await prisma.license.findUnique({ where: { key } });
    if (!license || license.revoked) return res.status(403).json({ error: "invalid license" });

    // Example artifact content - in real use you would stream a file from storage
    const content = `-- Artifact ${name}\n-- Delivered by Shinra\nprint("This is a signed artifact: ${name}")\n`;

    const signature = signContent(content);

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("X-Shinra-Signature", signature);
    res.send(content);
  });

  // Revoke license (admin)
  router.post("/revoke", requireAuth, async (req: AuthRequest, res) => {
    if (!req.authUser || req.authUser.role !== "admin") return res.status(403).json({ error: "admin required" });
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: "key required" });
    const license = await prisma.license.updateMany({ where: { key }, data: { revoked: true } });
    if (license.count === 0) return res.status(404).json({ error: "license not found" });
    res.json({ ok: true });
  });

  return router;
}
