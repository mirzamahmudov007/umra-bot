import { Injectable } from '@nestjs/common';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // milliseconds
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimiterService {
  private store = new Map<string, RateLimitEntry>();

  private defaultConfig: RateLimitConfig = {
    maxAttempts: 10,
    windowMs: 60 * 1000, // 1 minute
  };

  isAllowed(identifier: string, config?: RateLimitConfig): boolean {
    const conf = config || this.defaultConfig;
    const now = Date.now();

    let entry = this.store.get(identifier);

    // Agar window vaqti o'tgan bo'lsa, reset qil
    if (!entry || entry.resetTime < now) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + conf.windowMs,
      });
      return true;
    }

    // Agar limit o'tgan bo'lsa, block qil
    if (entry.count >= conf.maxAttempts) {
      return false;
    }

    // Countni o'zgart
    entry.count++;
    this.store.set(identifier, entry);
    return true;
  }

  getRemainingAttempts(identifier: string, config?: RateLimitConfig): number {
    const conf = config || this.defaultConfig;
    const entry = this.store.get(identifier);
    const now = Date.now();

    if (!entry || entry.resetTime < now) {
      return conf.maxAttempts;
    }

    return Math.max(0, conf.maxAttempts - entry.count);
  }

  getResetTime(identifier: string): number {
    const entry = this.store.get(identifier);
    return entry?.resetTime || 0;
  }

  // Cleanup: Old entries larni o'chirish
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  // Vaqt-vaqti bilan cleanup
  startCleanup(intervalMs: number = 5 * 60 * 1000) {
    setInterval(() => this.cleanup(), intervalMs);
  }
}
