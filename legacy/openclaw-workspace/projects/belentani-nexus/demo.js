#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Demo & Testing
 * Demuestra las capacidades del ecosistema
 */

require('dotenv').config();
const BelentaniAPI = require('./api-clients/belentani-api');
const IMAXAlbumEngine = require('./imax-album-engine/engine');
const CyberpunkExtraction = require('./cyberpunk-extraction/engine');
const JudasOrchestrator = require('./judas-storyboard/orchestrator');

const api = new BelentaniAPI();

async function main() {
  console.log('='.repeat(60));
  console.log('BELENTANI NEXUS - Ecosistema IA Unificado');
  console.log('='.repeat(60));
  console.log();
  
  // Parsear argumentos
  const args = process.argv.slice(2);
  const project = args.find(a => a.startsWith('--project='))?.split('=')[1] || 'demo';
  
  switch (project) {
    case 'judas':
      await demoJudas();
      break;
    case 'imax':
      await demoIMAX();
      break;
    case 'cyberpunk':
      await demoCyberpunk();
      break;
    default:
      await demoGeneral();
  }
}

async function demoGeneral() {
  console.log('[DEMO] Probando APIs de texto...\n');
  
  // Test 1: Qwen (Token Plan)
  try {
    console.log('1. Probando Qwen (Token Plan)...');
    const response = await api.chat('Escribe un haiku sobre cyberpunk', {
      provider: 'qwen',
      model: 'qwen-plus'
    });
    console.log('✅ Qwen:', response);
  } catch (error) {
    console.log('❌ Qwen:', error.message);
  }
  
  console.log();
  
  // Test 2: Gemini (gratis)
  try {
    console.log('2. Probando Gemini (gratis)...');
    const response = await api.chat('Escribe un haiku sobre inteligencia artificial', {
      provider: 'gemini',
      model: 'gemini-2.0-flash-exp'
    });
    console.log('✅ Gemini:', response);
  } catch (error) {
    console.log('❌ Gemini:', error.message);
  }
  
  console.log();
  
  // Test 3: Groq (gratis, rápido)
  try {
    console.log('3. Probando Groq (gratis)...');
    const response = await api.chat('Escribe un haiku sobre música electrónica', {
      provider: 'groq',
      model: 'llama-3.3-70b-versatile'
    });
    console.log('✅ Groq:', response);
  } catch (error) {
    console.log('❌ Groq:', error.message);
  }
  
  console.log();
  console.log('='.repeat(60));
  console.log('Demo completada. Configura tus API keys en .env');
  console.log('='.repeat(60));
}

async function demoJudas() {
  console.log('[JUDAS] Iniciando producción del videoclip...\n');
  
  const orchestrator = new JudasOrchestrator();
  
  try {
    const result = await orchestrator.produce();
    
    console.log('\n' + '='.repeat(60));
    console.log('PRODUCCIÓN JUDAS COMPLETADA');
    console.log('='.repeat(60));
    console.log(`Video: ${result.video.videoPath}`);
    console.log(`Escenas: ${result.scenes}`);
    console.log(`Fotos: ${result.photos}`);
    console.log(`Assets promo: ${result.promo}`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('[JUDAS ERROR]', error.message);
    console.error(error.stack);
  }
}

async function demoIMAX() {
  console.log('[IMAX] Generando video musical...\n');
  
  const engine = new IMAXAlbumEngine();
  
  try {
    const result = await engine.generateMusicVideo({
      audioPath: './assets/demo-audio.mp3',
      lyrics: 'Letra de ejemplo para demo...\nVerso 1\nCoro\nVerso 2',
      style: 'cyberpunk',
      duration: 60 // 1 minuto para demo
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('VIDEO IMAX GENERADO');
    console.log('='.repeat(60));
    console.log(`Video: ${result.videoPath}`);
    console.log(`Escenas: ${result.scenes}`);
    console.log(`Keyframes: ${result.keyframes}`);
    console.log(`Duración: ${result.duration}s`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('[IMAX ERROR]', error.message);
  }
}

async function demoCyberpunk() {
  console.log('[CYBERPUNK] Generando sesión de fotos...\n');
  
  const extraction = new CyberpunkExtraction();
  
  try {
    const result = await extraction.generatePhotoshoot({
      subject: 'persona andrógina con ropa futurista cyberpunk',
      style: 'neon',
      count: 5, // 5 fotos para demo
      location: 'Barcelona nocturno 2045'
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('SESIÓN CYBERPUNK GENERADA');
    console.log('='.repeat(60));
    console.log(`Fotos: ${result.count}`);
    console.log(`Estilo: ${result.style}`);
    console.log(`Locación: ${result.location}`);
    console.log('='.repeat(60));
    console.log('\nImágenes generadas:');
    result.images.forEach((img, i) => {
      console.log(`${i + 1}. ${img.url}`);
    });
  } catch (error) {
    console.error('[CYBERPUNK ERROR]', error.message);
  }
}

// Ejecutar
main().catch(error => {
  console.error('[FATAL]', error);
  process.exit(1);
});
