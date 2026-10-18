/**
 * lib/rate-limit/index.ts
 * Rate limiting بسيط في الذاكرة — يحمي الدخول وOTP والعمليات الحساسة.
 *
 * ملاحظة: هذا التنفيذ مناسب لنسخة أحادية العقد (single instance).
 * عند التوسع لأكثر من نسخة، استبدلها بمخزن مشترك (Redis مثلاً).
 */

type Bucket = {
  timestamps: number[];
};

const buckets = new Map<string, Bucket>();

// تنظيف دوري لمنع تضخم الذاكرة
const PRUNE_INTERVAL_MS = 5 * 60 * 1000;
let lastPrune = Date.now();
function maybePrune(now: number) {
  if (now - lastPrune < PRUNE_INTERVAL_MS) return;
  lastPrune = now;
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < 60 * 60 * 1000);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * يسجّل محاولة ويعيد true إذا كانت ضمن الحد المسموح.
 * @param key    مفتاح فريد (مثال: "login:01012345678:1.2.3.4")
 * @param limit  أقصى عدد محاولات
 * @param windowSeconds نافذة الزمن بالثواني
 */
export function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  maybePrune(now);

  const windowMs = windowSeconds * 1000;
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000)
    );
    return { ok: false, remaining: 0, retryAfterSeconds };
  }

  bucket.timestamps.push(now);
  return {
    ok: true,
    remaining: limit - bucket.timestamps.length,
    retryAfterSeconds: 0,
  };
}
