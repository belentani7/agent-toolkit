#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Performance Monitor
 * Monitoreo de rendimiento y métricas en tiempo real
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      startTime: Date.now(),
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        byProvider: {},
        byType: {},
        latencies: []
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0
      },
      costs: {
        estimated: 0,
        saved: 0
      },
      errors: []
    };
    
    this.costs = {
      qwen: 0,
      gemini: 0,
      groq: 0,
      zai: 0,
      silicon: 0,
      pollinations: 0,
      fal: 0.05,
      stability: 0.06,
      minimax: 0.10,
      luma: 0.15
    };
  }
  
  /**
   * Registra un request
   */
  recordRequest(provider, type, latency, success = true, fromCache = false) {
    this.metrics.requests.total++;
    
    if (success) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
    }
    
    // Por provider
    if (!this.metrics.requests.byProvider[provider]) {
      this.metrics.requests.byProvider[provider] = { count: 0, errors: 0 };
    }
    this.metrics.requests.byProvider[provider].count++;
    if (!success) {
      this.metrics.requests.byProvider[provider].errors++;
    }
    
    // Por tipo
    if (!this.metrics.requests.byType[type]) {
      this.metrics.requests.byType[type] = 0;
    }
    this.metrics.requests.byType[type]++;
    
    // Latencia
    this.metrics.requests.latencies.push(latency);
    
    // Caché
    if (fromCache) {
      this.metrics.cache.hits++;
    } else {
      this.metrics.cache.misses++;
    }
    
    // Calcular hit rate
    const total = this.metrics.cache.hits + this.metrics.cache.misses;
    this.metrics.cache.hitRate = total > 0 ? (this.metrics.cache.hits / total * 100).toFixed(2) : 0;
    
    // Costos
    const cost = this.costs[provider] || 0;
    this.metrics.costs.estimated += cost;
    
    // Ahorro por usar APIs gratuitas
    if (cost === 0 && type === 'text') {
      this.metrics.costs.saved += 0.02; // ~$0.02 por request de texto
    }
  }
  
  /**
   * Registra un error
   */
  recordError(error, context = {}) {
    this.metrics.errors.push({
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack,
      context
    });
    
    // Mantener solo los últimos 100 errores
    if (this.metrics.errors.length > 100) {
      this.metrics.errors.shift();
    }
  }
  
  /**
   * Obtiene métricas actuales
   */
  getMetrics() {
    const uptime = Date.now() - this.metrics.startTime;
    const uptimeMinutes = Math.floor(uptime / 1000 / 60);
    
    const avgLatency = this.metrics.requests.latencies.length > 0
      ? Math.round(this.metrics.requests.latencies.reduce((a, b) => a + b, 0) / this.metrics.requests.latencies.length)
      : 0;
    
    const successRate = this.metrics.requests.total > 0
      ? ((this.metrics.requests.successful / this.metrics.requests.total) * 100).toFixed(2)
      : 0;
    
    return {
      uptime: `${uptimeMinutes}m`,
      requests: {
        total: this.metrics.requests.total,
        successful: this.metrics.requests.successful,
        failed: this.metrics.requests.failed,
        successRate: `${successRate}%`,
        avgLatency: `${avgLatency}ms`
      },
      cache: {
        hits: this.metrics.cache.hits,
        misses: this.metrics.cache.misses,
        hitRate: `${this.metrics.cache.hitRate}%`
      },
      costs: {
        estimated: `€${this.metrics.costs.estimated.toFixed(2)}`,
        saved: `€${this.metrics.costs.saved.toFixed(2)}`
      },
      byProvider: this.metrics.requests.byProvider,
      byType: this.metrics.requests.byType,
      recentErrors: this.metrics.errors.slice(-5)
    };
  }
  
  /**
   * Imprime reporte en consola
   */
  printReport() {
    const metrics = this.getMetrics();
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 BELENTANI NEXUS - PERFORMANCE REPORT');
    console.log('='.repeat(70));
    
    console.log(`\n⏱️  UPTIME: ${metrics.uptime}`);
    
    console.log('\n📡 REQUESTS:');
    console.log(`  Total: ${metrics.requests.total}`);
    console.log(`  Successful: ${metrics.requests.successful} (${metrics.requests.successRate})`);
    console.log(`  Failed: ${metrics.requests.failed}`);
    console.log(`  Avg Latency: ${metrics.requests.avgLatency}`);
    
    console.log('\n💾 CACHE:');
    console.log(`  Hits: ${metrics.cache.hits}`);
    console.log(`  Misses: ${metrics.cache.misses}`);
    console.log(`  Hit Rate: ${metrics.cache.hitRate}`);
    
    console.log('\n💰 COSTS:');
    console.log(`  Estimated: ${metrics.costs.estimated}`);
    console.log(`  Saved: ${metrics.costs.saved}`);
    
    console.log('\n🔌 BY PROVIDER:');
    for (const [provider, data] of Object.entries(metrics.byProvider)) {
      const errorRate = data.count > 0 ? ((data.errors / data.count) * 100).toFixed(1) : 0;
      console.log(`  ${provider}: ${data.count} requests (${errorRate}% errors)`);
    }
    
    console.log('\n📦 BY TYPE:');
    for (const [type, count] of Object.entries(metrics.byType)) {
      console.log(`  ${type}: ${count}`);
    }
    
    if (metrics.recentErrors.length > 0) {
      console.log('\n⚠️  RECENT ERRORS:');
      metrics.recentErrors.forEach((err, i) => {
        const time = new Date(err.timestamp).toISOString();
        console.log(`  ${i + 1}. [${time}] ${err.message}`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    
    return metrics;
  }
  
  /**
   * Reset métricas
   */
  reset() {
    this.metrics = {
      startTime: Date.now(),
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        byProvider: {},
        byType: {},
        latencies: []
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0
      },
      costs: {
        estimated: 0,
        saved: 0
      },
      errors: []
    };
  }
  
  /**
   * Exporta métricas a JSON
   */
  exportJSON() {
    return JSON.stringify(this.getMetrics(), null, 2);
  }
}

module.exports = PerformanceMonitor;
