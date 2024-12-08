type CacheData = {
  data: any
  timestamp: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

class Cache {
  private static instance: Cache
  private cache: Map<string, CacheData>

  private constructor() {
    this.cache = new Map()
  }

  static getInstance() {
    if (!Cache.instance) {
      Cache.instance = new Cache()
    }
    return Cache.instance
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }
}

export const cache = Cache.getInstance()