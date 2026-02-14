// API Cache Management
// Simple localStorage-based caching for API responses

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresIn: number;
}

class APICache {
  private prefix = "api_cache_";
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Set cache entry
   */
  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    if (typeof window === "undefined") return;

    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      expiresIn: ttl,
    };

    try {
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn("Failed to cache data:", error);
    }
  }

  /**
   * Get cache entry
   */
  get(key: string): any | null {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      if (!item) return null;

      const entry: CacheEntry = JSON.parse(item);
      const age = Date.now() - entry.timestamp;

      // Check if expired
      if (age > entry.expiresIn) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn("Failed to read cache:", error);
      return null;
    }
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.warn("Failed to delete cache:", error);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            const entry: CacheEntry = JSON.parse(item);
            const age = Date.now() - entry.timestamp;
            if (age > entry.expiresIn) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn("Failed to clear expired cache:", error);
    }
  }

  /**
   * Get cache size
   */
  getSize(): number {
    if (typeof window === "undefined") return 0;

    try {
      const keys = Object.keys(localStorage);
      let size = 0;
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          size += (localStorage.getItem(key) || "").length;
        }
      });
      return size;
    } catch (error) {
      return 0;
    }
  }
}

export const apiCache = new APICache();

/**
 * Cache decorator for API calls
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  getCacheKey: (...args: Parameters<T>) => string,
  ttl?: number,
): T {
  return (async (...args: Parameters<T>) => {
    const key = getCacheKey(...args);

    // Try to get from cache
    const cached = apiCache.get(key);
    if (cached !== null) {
      console.log(`Cache hit: ${key}`);
      return cached;
    }

    // Call the actual function
    console.log(`Cache miss: ${key}`);
    const result = await fn(...args);

    // Cache the result
    apiCache.set(key, result, ttl);

    return result;
  }) as T;
}
