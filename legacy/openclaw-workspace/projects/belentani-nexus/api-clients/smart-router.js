#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Smart Router
 * Ruteo inteligente de requests a APIs según costo/disponibilidad
 */

const BelentaniAPI = require('./belentani-api');

class SmartRouter {
  constructor() {
    this.api = new BelentaniAPI();
    this.stats = {
      totalRequests: 0,
      byProvider: {},
      costSaved: 0 // Euros ahorrados usando APIs gratuitas
    };
    
    // Prioridades de ruteo
    this.priority = {
      text: ['qwen', 'gemini', 'groq', 'zai', 'silicon', 'pollinations'],
      image: ['fal', 'stability'],
      video: ['minimax', 'luma']
    };
    
    // Costos por request (estimados)
    this.costs = {
      qwen: 0, // Token Plan (ya pagado)
      gemini: 0, // Gratis
      groq: 0, // Gratis
      zai: 0, // Gratis
      silicon: 0, // Gratis
      pollinations: 0, // Gratis
      fal: 0.05, // ~$0.05 por imagen
      stability: 0.06, // ~$0.06 por imagen
      minimax: 0.10, // ~$0.10 por video
      luma: 0.15 // ~$0.15 por video
    };
  }
  
  /**
   * Rutea un request de texto al mejor provider disponible
   */
  async routeText(prompt, options = {}) {
    this.stats.totalRequests++;
    
    const providers = this.priority.text;
    
    for (const provider of providers) {
      try {
        const config = this.api.providers[provider];
        
        // Skip si no tiene API key (excepto pollinations)
        if (!config.key && provider !== 'pollinations') continue;
        
        const response = await this.api.chat(prompt, {
          provider,
          model: options.model || config.models[0]
        });
        
        // Actualizar stats
        if (!this.stats.byProvider[provider]) {
          this.stats.byProvider[provider] = 0;
        }
        this.stats.byProvider[provider]++;
        
        // Calcular costo ahorrado (vs usar API de pago)
        const paidCost = 0.02; // ~$0.02 por request en OpenAI
        this.stats.costSaved += paidCost;
        
        return {
          response,
          provider,
          cost: 0,
          latency: Date.now()
        };
      } catch (error) {
        console.log(`[ROUTER] ${provider} falló, intentando siguiente...`);
        continue;
      }
    }
    
    throw new Error('Todos los providers de texto fallaron');
  }
  
  /**
   * Rutea un request de imagen al mejor provider
   */
  async routeImage(prompt, options = {}) {
    this.stats.totalRequests++;
    
    const providers = this.priority.image;
    
    for (const provider of providers) {
      try {
        const config = this.api.providers[provider];
        if (!config.key) continue;
        
        const urls = await this.api.generateImage(prompt, {
          provider,
          ...options
        });
        
        if (!this.stats.byProvider[provider]) {
          this.stats.byProvider[provider] = 0;
        }
        this.stats.byProvider[provider]++;
        
        const cost = this.costs[provider] || 0;
        
        return {
          urls,
          provider,
          cost,
          latency: Date.now()
        };
      } catch (error) {
        console.log(`[ROUTER] ${provider} falló, intentando siguiente...`);
        continue;
      }
    }
    
    throw new Error('Todos los providers de imagen fallaron');
  }
  
  /**
   * Rutea un request de video al mejor provider
   */
  async routeVideo(prompt, imageUrl, options = {}) {
    this.stats.totalRequests++;
    
    const providers = this.priority.video;
    
    for (const provider of providers) {
      try {
        const config = this.api.providers[provider];
        if (!config.key) continue;
        
        const taskId = await this.api.generateVideo(prompt, imageUrl, {
          provider,
          ...options
        });
        
        if (!this.stats.byProvider[provider]) {
          this.stats.byProvider[provider] = 0;
        }
        this.stats.byProvider[provider]++;
        
        const cost = this.costs[provider] || 0;
        
        return {
          taskId,
          provider,
          cost,
          latency: Date.now()
        };
      } catch (error) {
        console.log(`[ROUTER] ${provider} falló, intentando siguiente...`);
        continue;
      }
    }
    
    throw new Error('Todos los providers de video fallaron');
  }
  
  /**
   * Obtiene estadísticas de uso
   */
  getStats() {
    return {
      ...this.stats,
      costSaved: `€${this.stats.costSaved.toFixed(2)}`,
      providers: Object.keys(this.stats.byProvider)
    };
  }
  
  /**
   * Reset stats
   */
  resetStats() {
    this.stats = {
      totalRequests: 0,
      byProvider: {},
      costSaved: 0
    };
  }
}

module.exports = SmartRouter;
