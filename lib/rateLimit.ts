// Simple in-memory rate limiter.
// Works per serverless instance — good enough for basic abuse protection.
// For multi-instance production scale, swap the store for Upstash Redis.

interface Record {
  count: number;
  resetAt: number;
}

const store = new Map<string, Record>();

/**
 * Returns true if the request should be allowed, false if it should be blocked.
 * @param key     — typically the caller's IP address
 * @param limit   — max requests per window (default 10)
 * @param windowMs — rolling window in ms (default 60 s)
 */
export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  return true;
}

/** Extract the real IP from Next.js request headers. */
export function getIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
