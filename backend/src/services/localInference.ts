import { config } from '../config.js';

const bannedPatterns = [
  'nude',
  'naked',
  'explicit sexual',
  'porn',
  'hardcore porn',
  'explicit adult',
  'sexually explicit',
  'graphic sexual'
];

export async function moderatePrompt(prompt: string) {
  const normalized = prompt.toLowerCase();

  const localTrigger = bannedPatterns.some((term) => normalized.includes(term));
  if (localTrigger) {
    return {
      allowed: false,
      reason: 'Prompt contains prohibited explicit sexual content.',
      provider: 'local-policy',
    };
  }

  if (!config.openAiApiKey && !config.moderationApiKey) {
    return {
      allowed: true,
      reason: 'No moderation API key configured. Local policy only.',
      provider: 'local-policy',
    };
  }

  try {
    const key = config.openAiApiKey || config.moderationApiKey;
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ input: prompt }),
    });

    if (!response.ok) {
      throw new Error(`Moderation API failed: ${response.status}`);
    }

    const data = await response.json();
    const result = data.results?.[0];
    const flagged = Boolean(result?.flagged);

    if (flagged) {
      return {
        allowed: false,
        reason: 'Prompt flagged by moderation service.',
        provider: 'openai-moderation',
      };
    }

    return {
      allowed: true,
      reason: 'Prompt passed moderation checks.',
      provider: 'openai-moderation',
    };
  } catch (_error) {
    return {
      allowed: true,
      reason: 'Moderation check unavailable; using local safeguards only.',
      provider: 'fallback',
    };
  }
}
