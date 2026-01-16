# Shinra

Shinra — License management and secure artifact delivery platform.

Summary
- Backend: Node.js + TypeScript + Express + Prisma (Postgres)
- Frontend: React + Vite
- Deployment: Docker / Koyeb (example `koyeb.yaml` included)
- Features: register/login, license keys (create/activate/revoke), optional fingerprint binding (HWID-style), activation/execution logs, HMAC-signed artifacts for integrity, admin panel, OpenAPI docs.

Design constraints
- This project does NOT include aggressive obfuscators, anti-analysis loaders, or techniques intended to evade bans or security systems. Protect sensitive logic by keeping it server-side, using signed artifact delivery and license binding options.

Quickstart (local, using Docker Compose)
1. Clone or copy repository files.
2. Start services:
   docker-compose up --build
3. Backend will be available at http://localhost:4000
4. Frontend at http://localhost:5173

Local dev (Node / Vite)
- Backend
  cd backend
  cp .env.example .env
  npm install
  npx prisma generate
  npx prisma migrate dev --name init
  npm run dev

- Frontend
  cd frontend
  cp .env.example .env
  npm install
  npm run dev

Environment variables
- Backend `.env.example` includes: DATABASE_URL, JWT_SECRET, HMAC_SECRET, PORT.
- Frontend `.env.example`: VITE_API_BASE

Deployment (Koyeb example)
- See `koyeb.yaml`. Build and push images to a container registry, update image names and secrets in Koyeb, and deploy.

Security notes
- Keep `JWT_SECRET` and `HMAC_SECRET` secret and rotate periodically.
- Keep logic that should remain private on the server (do not distribute core secrets client-side).
- Use HTTPS in production, and enable monitoring & rate limiting.

Next steps you can ask me to do:
- Add Stripe payment integration for selling licenses
- Expand admin UI (pagination, search, export)
- Add 2FA for user accounts
- Add additional API endpoints or more robust artifact storage (S3)
- Hook up GitHub Actions to automatically push images to your registry

License: MIT
