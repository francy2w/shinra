import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import pino from "pino-http";
import prisma from "./prisma";
import authRoutes from "./routes/auth";
import keysRoutes from "./routes/keys";
import adminRoutes from "./routes/admin";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pino());

app.use("/api/auth", authRoutes(prisma));
app.use("/api/keys", keysRoutes(prisma));
app.use("/api/admin", adminRoutes(prisma));

app.get("/", (req, res) => res.json({ ok: true, service: "shinra-backend" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Shinra backend listening on ${PORT}`);
});
