import type { Request, Response } from 'express';
import { z } from 'zod';
import { db, initializeDatabase } from './db.js';
import { config } from './config.js';
import { hashPassword, verifyPassword } from './lib/security.js';
import { requireAuth, requireAgeVerification, signToken, type AuthenticatedRequest } from './middleware/auth.js';
import { moderatePrompt } from './services/moderation.js';
import { generateLocalImage } from './services/localInference.js';

initializeDatabase();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  dateOfBirth: z.string().optional(),
  agreedToTerms: z.boolean().default(false),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const generationSchema = z.object({
  prompt: z.string().min(10).max(500),
  negativePrompt: z.string().max(500).optional(),
});

export function registerRoutes(app: any) {
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, status: 'healthy' });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.parse(req.body);

      if (!parsed.agreedToTerms) {
        return res.status(400).json({ error: 'You must agree to the terms and age policy.' });
      }

      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(parsed.email);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const passwordHash = hashPassword(parsed.password);
      const now = new Date().toISOString();
      const ageVerified = parsed.dateOfBirth ? new Date(parsed.dateOfBirth) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18)) : false;

      const result = db.prepare(`
        INSERT INTO users (email, password_hash, date_of_birth, is_age_verified, age_verified_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        parsed.email,
        passwordHash,
        parsed.dateOfBirth ?? null,
        ageVerified ? 1 : 0,
        ageVerified ? now : null,
        now,
        now,
      );

      const user = db.prepare('SELECT id, email, is_age_verified as isAgeVerified FROM users WHERE id = ?').get(result.lastInsertRowid);
      const token = signToken({
        sub: Number(user.id),
        email: user.email,
        isAgeVerified: Boolean(user.isAgeVerified),
      });

      return res.status(201).json({ token, user: { id: user.id, email: user.email, isAgeVerified: Boolean(user.isAgeVerified) } });
    } catch (error: any) {
      return res.status(400).json({ error: error.message ?? 'Invalid registration payload.' });
    }
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.parse(req.body);
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(parsed.email) as any;

      if (!user || !verifyPassword(parsed.password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = signToken({
        sub: user.id,
        email: user.email,
        isAgeVerified: Boolean(user.is_age_verified),
      });

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          isAgeVerified: Boolean(user.is_age_verified),
        },
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message ?? 'Invalid login payload.' });
    }
  });

  app.get('/api/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const user = db.prepare('SELECT id, email, is_age_verified as isAgeVerified FROM users WHERE id = ?').get(req.user?.id);
    return res.json({ user });
  });

  app.post('/api/age-gate', (req: Request, res: Response) => {
    const parsed = z.object({
      dateOfBirth: z.string().optional(),
      agreedToTerms: z.boolean().default(false),
    }).parse(req.body);

    if (!parsed.agreedToTerms) {
      return res.status(400).json({ error: 'Terms must be accepted.' });
    }

    if (!parsed.dateOfBirth) {
      return res.status(400).json({ error: 'Date of birth is required.' });
    }

    const dob = new Date(parsed.dateOfBirth);
    const age = new Date(Date.now() - dob.getTime());
    const years = age.getUTCFullYear() - 1970;

    if (years < 18) {
      return res.status(403).json({ error: 'You must be at least 18 years old to access this service.' });
    }

    return res.json({ ok: true, eligible: true });
  });

  app.post('/api/generate', requireAuth, requireAgeVerification, async (req: Request, res: Response) => {
    try {
      const parsed = generationSchema.parse(req.body);
      const moderation = await moderatePrompt(parsed.prompt);

      if (!moderation.allowed) {
        return res.status(400).json({ error: moderation.reason });
      }

      const result = await generateLocalImage(parsed.prompt);
      const generation = db.prepare(`
        INSERT INTO generations (user_id, prompt, negative_prompt, status, result_url, moderation_notes, created_at)
        VALUES (?, ?, ?, 'complete', ?, ?, CURRENT_TIMESTAMP)
      `).run(req.user?.id, parsed.prompt, parsed.negativePrompt ?? '', result.url ?? '', moderation.reason ?? 'Passed moderation');

      return res.json({
        ok: true,
        generationId: generation.lastInsertRowid,
        result,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message ?? 'Unable to process generation request.' });
    }
  });
}
