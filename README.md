# AI Image Studio

A secure, age-gated AI image generation starter with:
- JavaScript/TypeScript full-stack architecture
- Protected auth + age verification
- Prompt moderation with OpenAI Moderation API and local fallback checks
- Local inference integration for Forge / ComfyUI via backend proxy
- Docker-ready setup for local development and deployment

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite (dev-friendly, easy to replace with PostgreSQL in production)
- Secrets management: environment variables

## Quick start

1. Copy the env files:
   - cp .env.example .env
   - cp backend/.env.example backend/.env
   - cp frontend/.env.example frontend/.env

2. Fill in your secrets.

3. Install dependencies:
   - cd backend && npm install
   - cd frontend && npm install

4. Run the app:
   - cd backend && npm run dev
   - cd frontend && npm run dev

5. Open the frontend and complete the age gate.

## Environment variables

Required values:
- JWT_SECRET
- OPENAI_API_KEY (optional but recommended for moderation)
- MODERATION_API_KEY (optional)
- FORGE_API_URL
- COMFYUI_API_URL
- APP_PORT

## Production notes

- Do not expose API keys in frontend code or public repos.
- Use a proper secret manager in production (GitHub Actions secrets, AWS Secrets Manager, etc.).
- Only allow authenticated users to submit generation requests.
- Keep all model execution behind the backend.

## License

MIT
