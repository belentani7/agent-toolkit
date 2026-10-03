#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Request Cache
 * Evita requests duplicados y ahorra tokens
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class RequestCache {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || path.join(__dirname, '../.cache');
    this.ttl = options.ttl || 24 * 60 * 60 * 1000; // 24 horas por defecto
    this.maxSize = options.maxSize || 1000; // Máximo 1000 entradas
    
    // Crear directorio de caché si no existe
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    
    this.cacheFile = path.join(this.cacheDir, 'cache.json');
    this.cache = this.loadCache();
    
    console.log(`[CACHE] Inicializado (${Object.keys(this.cache).length} entradas)`);
  }
  
  /**
   * Genera hash único para un request
   */
  generateKey(type, prompt, options = {}) {
    const data = JSON.stringify({ type, prompt, options });
    return crypto.createHash('md5').update(data).digest('hex');
  }
  
  /**
   * Obtiene un resultado del caché
   */
  get(key) {
    const entry = this.cache[key];
    
    if (!entry) {
      return null;
    }
    
    // Verificar si expiró
    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      delete this.cache[key];
      this.saveCache();
      return null;
    }
    
    console.log(`[CACHE] Hit: ${key.substring(0, 8)}...`);
    return entry.data;
  }
  
  /**
   * Guarda un resultado en el caché
   */
  set(key, data) {
    // Si el caché está lleno, eliminar entradas antiguas
    if (Object.keys(this.cache).length >= this.maxSize) {
      this.evictOldest();
    }
    
    this.cache[key] = {
      data,
      timestamp: Date.now()
    };
    
    this.saveCache();
    console.log(`[CACHE] Stored: ${key.substring(0, 8)}...`);
  }
  
  /**
   * Verifica si un request está en caché
   */
  has(key) {
    return this.get(key) !== null;
  }
  
  /**
   * Elimina entradas antiguas del caché
   */
  evictOldest() {
    const entries = Object.entries(this.cache);
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Eliminar el 20% más antiguo
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      delete this.cache[entries[i][0]];
    }
    
    console.log(`[CACHE] Evicted ${toRemove} old entries`);
  }
  
  /**
   * Limpia todo el caché
   */
  clear() {
    this.cache = {};
    this.saveCache();
    console.log('[CACHE] Cleared');
  }
  
  /**
   * Obtiene estadísticas del caché
   */
  getStats() {
    const entries = Object.keys(this.cache);
    const now = Date.now();
    const valid = entries.filter(key => now - this.cache[key].timestamp <= this.ttl);
    
    return {
      total: entries.length,
      valid: valid.length,
      expired: entries.length - valid.length,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }
  
  /**
   * Carga el caché desde disco
   */
  loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.log('[CACHE] Error loading cache, starting fresh');
    }
    return {};
  }
  
  /**
   * Guarda el caché en disco
   */
  saveCache() {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.log('[CACHE] Error saving cache:', error.message);
    }
  }
  
  /**
   * Wrapper para funciones con caché
   */
  async cached(fn, type, prompt, options = {}) {
    const key = this.generateKey(type, prompt, options);
    
    // Intentar obtener del caché
    const cached = this.get(key);
    if (cached) {
      return {
        data: cached,
        fromCache: true,
        key
      };
    }
    
    // Ejecutar función
    const result = await fn(prompt, options);
    
    // Guardar en caché
    this.set(key, result);
    
    return {
      data: result,
      fromCache: false,
      key
    };
  }
}

module.exports = RequestCache;
