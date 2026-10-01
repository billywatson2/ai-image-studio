import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  databasePath: process.env.DATABASE_PATH ?? './data/app.db',
  forgeApiUrl: process.env.FORGE_API_URL ?? 'http://127.0.0.1:7860',
  comfyUiApiUrl: process.env.COMFYUI_API_URL ?? 'http://127.0.0.1:8188',
  openAiApiKey: process.env.OPENAI_API_KEY ?? '',
  moderationApiKey: process.env.MODERATION_API_KEY ?? '',
  allowMockResults: (process.env.ALLOW_MOCK_RESULTS ?? 'true') === 'true',
};
