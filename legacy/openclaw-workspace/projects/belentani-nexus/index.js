#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Main Entry Point
 * Orquesta todos los módulos del ecosistema
 */

require('dotenv').config();
const BelentaniAPI = require('./api-clients/belentani-api');
const IMAXAlbumEngine = require('./imax-album-engine/engine');
const CyberpunkExtraction = require('./cyberpunk-extraction/engine');
const JudasOrchestrator = require('./judas-storyboard/orchestrator');

class BelentaniNexus {
  constructor() {
    this.api = new BelentaniAPI();
    this.imax = new IMAXAlbumEngine();
    this.cyberpunk = new CyberpunkExtraction();
    this.judas = new JudasOrchestrator();
    
    console.log('='.repeat(60));
    console.log('🦞 BELENTANI NEXUS v2.0.0');
    console.log('Ecosistema IA Unificado');
    console.log('='.repeat(60));
  }
  
  async init() {
    console.log('\n[INIT] Verificando APIs...');
    
    const providers = Object.keys(this.api.providers);
    const available = [];
    const missing = [];
    
    for (const provider of providers) {
      const config = this.api.providers[provider];
      if (!config.key && provider !== 'pollinations') {
        missing.push(provider);
      } else {
        available.push(provider);
      }
    }
    
    console.log(`[OK] ${available.length} APIs disponibles:`, available.join(', '));
    if (missing.length > 0) {
      console.log(`[WARN] ${missing.length} APIs sin key:`, missing.join(', '));
      console.log('[INFO] Configura tus keys en .env');
    }
    
    return { available, missing };
  }
  
  async run(mode = 'demo') {
    console.log(`\n[RUN] Modo: ${mode}\n`);
    
    switch (mode) {
      case 'judas':
        return await this.judas.produce();
      case 'imax':
        return await this.imax.generateMusicVideo({
          audioPath: './assets/audio.mp3',
          lyrics: 'Letra aquí...',
          style: 'cyberpunk',
          duration: 180
        });
      case 'cyberpunk':
        return await this.cyberpunk.generatePhotoshoot({
          subject: 'persona cyberpunk',
          style: 'neon',
          count: 10,
          location: 'Barcelona 2045'
        });
      default:
        return await this.demo();
    }
  }
  
  async demo() {
    console.log('[DEMO] Probando APIs...\n');
    
    try {
      const response = await this.api.chat('Escribe un haiku sobre cyberpunk', {
        provider: 'qwen'
      });
      console.log('[OK] Qwen:', response);
    } catch (error) {
      console.log('[FAIL] Qwen:', error.message);
    }
    
    try {
      const response = await this.api.chat('Escribe un haiku sobre IA', {
        provider: 'gemini'
      });
      console.log('[OK] Gemini:', response);
    } catch (error) {
      console.log('[FAIL] Gemini:', error.message);
    }
    
    console.log('\n[DONE] Demo completada');
  }
}

// CLI
if (require.main === module) {
  const nexus = new BelentaniNexus();
  const mode = process.argv[2] || 'demo';
  
  nexus.init().then(() => nexus.run(mode)).catch(error => {
    console.error('[FATAL]', error);
    process.exit(1);
  });
}

module.exports = BelentaniNexus;
