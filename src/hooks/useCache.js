import create from 'zustand';

const DEFAULT_CACHE_LIMIT = 5;

const useCacheStore = create((set, get) => ({
  cache: new Map(),
  cacheLimit: DEFAULT_CACHE_LIMIT,
  
  setInCache: (key, value) => {
    const { cache, cacheLimit } = get();
    
    if (cache.size >= cacheLimit) {
      // Remove oldest entry using LRU strategy
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, {
      value,
      timestamp: Date.now(),
    });
    
    set({ cache: new Map(cache) });
  },
  
  getFromCache: (key) => {
    const { cache } = get();
    const entry = cache.get(key);
    return entry ? entry.value : null;
  },
  
  clearCache: () => set({ cache: new Map() }),
  
  setCacheLimit: (limit) => set({ cacheLimit: limit }),
}));

export const useCache = () => {
  const store = useCacheStore();
  
  return {
    setInCache: store.setInCache,
    getFromCache: store.getFromCache,
    clearCache: store.clearCache,
    setCacheLimit: store.setCacheLimit,
  };
};
