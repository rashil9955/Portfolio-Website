import { EmailMessage } from 'cloudflare:email';
import type { ContactFields } from '../src/contactValidation';
import { normalizeContactFields, validateContactFields } from '../src/contactValidation';

interface Env {
  ASSETS: Fetcher;
  CONTACT_EMAIL: SendEmail;
  CONTACT_RATE_LIMITER: RateLimit;
  CONTACT_FROM: string;
  CONTACT_TO: string;
}

const MAX_BODY_BYTES = 20_000;
// Anything submitted faster than this was almost certainly not typed by a person.
const MIN_FILL_MS = 2_500;
const ALLOWED_ORIGINS = new Set(['https://rshibak.com', 'https://www.rshibak.com']);

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
      }
      return handleContact(request, env, url);
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ ok: false, error: 'Not found.' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleContact(request: Request, env: Env, url: URL): Promise<Response> {
  const origin = request.headers.get('Origin');
  if (!origin || (origin !== url.origin && !ALLOWED_ORIGINS.has(origin))) {
    return json({ ok: false, error: 'This form only accepts messages sent from rshibak.com.' }, 403);
  }

  if (!request.headers.get('Content-Type')?.includes('application/json')) {
    return json({ ok: false, error: 'Unsupported request format.' }, 415);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: `contact:${ip}` });
  if (!success) {
    return json(
      { ok: false, error: 'You’re sending messages a little quickly. Please wait a minute and try again.' },
      429,
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'That message is too long to send.' }, 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'The form data couldn’t be read. Please try again.' }, 400);
  }

  // Honeypot or impossibly fast submission: answer like a success so bots
  // learn nothing, but don't send anything.
  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
  const elapsedMs = typeof body.elapsedMs === 'number' ? body.elapsedMs : 0;
  if (honeypot || elapsedMs < MIN_FILL_MS) {
    return json({ ok: true });
  }

  const fields = normalizeContactFields(body);
  const errors = validateContactFields(fields);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, error: 'Please fix the highlighted fields and try again.', errors }, 422);
  }

  try {
    const message = new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, buildEmail(fields, env));
    await env.CONTACT_EMAIL.send(message);
  } catch (error) {
    // Log only the failure reason, never the visitor's details or message.
    console.error('contact_email_failed', error instanceof Error ? error.message : 'unknown error');
    return json(
      {
        ok: false,
        error:
          'Your message couldn’t be sent right now. Please try again later, or email me at rashil9955@gmail.com.',
      },
      502,
    );
  }

  return json({ ok: true });
}

function buildEmail(fields: ContactFields, env: Env): string {
  const body = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    '',
    fields.message,
    '',
    '—',
    'Sent from the contact form on rshibak.com. Reply directly to answer.',
  ].join('\n');

  const headers = [
    `From: ${encodeWord('rshibak.com contact form')} <${env.CONTACT_FROM}>`,
    `To: <${env.CONTACT_TO}>`,
    // The address passed strict validation, so it can't carry quotes or line breaks.
    `Reply-To: ${encodeWord(fields.name)} <${fields.email}>`,
    `Subject: ${encodeWord(`New message from ${fields.name}`)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@rshibak.com>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
  ];

  return `${headers.join('\r\n')}\r\n\r\n${wrap(base64(body))}\r\n`;
}

// RFC 2047 encoded-word, so names with any characters are safe in headers.
function encodeWord(text: string): string {
  return `=?UTF-8?B?${base64(text)}?=`;
}

function base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function wrap(encoded: string): string {
  return encoded.match(/.{1,76}/g)?.join('\r\n') ?? '';
}

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}
