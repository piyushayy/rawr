// In a truly scalable system, this would be backed by Vercel KV or Upstash Redis.
// For now, this in-memory Map provides basic rate limiting.

const rateLimits = new Map<string, { count: number; timestamp: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = rateLimits.get(key);

    if (!record) {
        rateLimits.set(key, { count: 1, timestamp: now });
        return true; // Allowed
    }

    if (now - record.timestamp > windowMs) {
        // Window expired, block resets
        rateLimits.set(key, { count: 1, timestamp: now });
        return true;
    }

    if (record.count >= limit) {
        return false; // Rate limited (blocked)
    }

    record.count += 1;
    return true; // Allowed
}
