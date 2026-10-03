#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Batch Processor
 * Procesa múltiples tareas en paralelo optimizando costos
 */

const SmartRouter = require('./smart-router');

class BatchProcessor {
  constructor() {
    this.router = new SmartRouter();
    this.queue = [];
    this.results = [];
    this.concurrency = 5; // Máximo 5 requests simultáneos
  }
  
  /**
   * Agrega una tarea al queue
   */
  addTask(type, prompt, options = {}) {
    this.queue.push({
      id: Date.now() + Math.random(),
      type, // 'text', 'image', 'video'
      prompt,
      options,
      status: 'pending'
    });
  }
  
  /**
   * Procesa todas las tareas del queue
   */
  async processAll() {
    console.log(`[BATCH] Procesando ${this.queue.length} tareas...\n`);
    
    const startTime = Date.now();
    const chunks = this.chunkArray(this.queue, this.concurrency);
    
    for (let i = 0; i < chunks.length; i++) {
      console.log(`[BATCH] Chunk ${i + 1}/${chunks.length}`);
      
      const promises = chunks[i].map(task => this.processTask(task));
      await Promise.allSettled(promises);
      
      // Pausa entre chunks para evitar rate limits
      if (i < chunks.length - 1) {
        await this.sleep(1000);
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const stats = this.router.getStats();
    
    console.log('\n' + '='.repeat(60));
    console.log('[BATCH] Procesamiento completado');
    console.log('='.repeat(60));
    console.log(`Tareas: ${this.queue.length}`);
    console.log(`Duración: ${duration}s`);
    console.log(`Requests: ${stats.totalRequests}`);
    console.log(`Costo ahorrado: ${stats.costSaved}`);
    console.log(`Providers usados: ${stats.providers.join(', ')}`);
    console.log('='.repeat(60));
    
    return {
      results: this.results,
      duration,
      stats
    };
  }
  
  /**
   * Procesa una tarea individual
   */
  async processTask(task) {
    try {
      console.log(`[TASK] ${task.type}: ${task.prompt.substring(0, 50)}...`);
      
      let result;
      
      switch (task.type) {
        case 'text':
          result = await this.router.routeText(task.prompt, task.options);
          break;
        case 'image':
          result = await this.router.routeImage(task.prompt, task.options);
          break;
        case 'video':
          result = await this.router.routeVideo(task.prompt, task.options.imageUrl, task.options);
          break;
        default:
          throw new Error(`Tipo desconocido: ${task.type}`);
      }
      
      this.results.push({
        taskId: task.id,
        type: task.type,
        status: 'success',
        result
      });
      
      task.status = 'completed';
      console.log(`[OK] ${task.type} completado con ${result.provider}`);
      
    } catch (error) {
      this.results.push({
        taskId: task.id,
        type: task.type,
        status: 'error',
        error: error.message
      });
      
      task.status = 'failed';
      console.log(`[FAIL] ${task.type}: ${error.message}`);
    }
  }
  
  /**
   * Divide un array en chunks
   */
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  
  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Genera batch de prompts para un proyecto
   */
  generateProjectBatch(projectType, config) {
    console.log(`[BATCH] Generando tareas para proyecto: ${projectType}\n`);
    
    switch (projectType) {
      case 'judas':
        return this.generateJudasBatch(config);
      case 'cyberpunk-session':
        return this.generateCyberpunkBatch(config);
      case 'music-video':
        return this.generateMusicVideoBatch(config);
      default:
        throw new Error(`Proyecto desconocido: ${projectType}`);
    }
  }
  
  /**
   * Genera batch para proyecto "Judas"
   */
  generateJudasBatch(config) {
    const scenes = config.scenes || 8;
    
    // Generar prompts para cada escena
    for (let i = 0; i < scenes; i++) {
      this.addTask('text', `Genera descripción visual para escena ${i + 1} del videoclip cyberpunk "Judas"`, {
        provider: 'qwen'
      });
      
      this.addTask('image', `Escena ${i + 1}: Personaje cyberpunk en ciudad nocturna, neón, cinematográfico`, {
        provider: 'fal',
        size: 'landscape_16_9'
      });
    }
    
    // Generar material promocional
    this.addTask('image', 'Poster cinematográfico para videoclip "JUDAS" by BELENTANI, cyberpunk', {
      provider: 'fal',
      size: 'portrait_2_3'
    });
    
    this.addTask('image', 'Thumbnail cuadrado para videoclip "JUDAS", cyberpunk, neón', {
      provider: 'fal',
      size: 'square'
    });
    
    console.log(`[BATCH] ${this.queue.length} tareas generadas\n`);
  }
  
  /**
   * Genera batch para sesión cyberpunk
   */
  generateCyberpunkBatch(config) {
    const count = config.count || 10;
    const style = config.style || 'neon';
    
    for (let i = 0; i < count; i++) {
      this.addTask('text', `Genera concepto único para foto cyberpunk ${i + 1}/${count}, estilo ${style}`, {
        provider: 'gemini'
      });
      
      this.addTask('image', `Foto cyberpunk ${i + 1}, estilo ${style}, cinematográfico, 8K`, {
        provider: 'fal',
        size: 'portrait_4_5'
      });
    }
    
    console.log(`[BATCH] ${this.queue.length} tareas generadas\n`);
  }
  
  /**
   * Genera batch para video musical
   */
  generateMusicVideoBatch(config) {
    const duration = config.duration || 180;
    const scenes = Math.floor(duration / 20); // ~20s por escena
    
    for (let i = 0; i < scenes; i++) {
      this.addTask('text', `Describe escena ${i + 1} para video musical de ${duration}s, estilo cyberpunk`, {
        provider: 'qwen'
      });
      
      this.addTask('image', `Keyframe escena ${i + 1}: cyberpunk cinematográfico, alta calidad`, {
        provider: 'fal',
        size: 'landscape_16_9'
      });
    }
    
    console.log(`[BATCH] ${this.queue.length} tareas generadas\n`);
  }
}

module.exports = BatchProcessor;
