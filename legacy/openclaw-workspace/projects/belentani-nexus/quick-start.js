#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Quick Start Script
 * Script de inicio rápido para probar el sistema
 */

const BelentaniAPI = require('./api-clients/belentani-api-v2');
const PromptGenerator = require('./api-clients/prompt-generator');

async function quickStart() {
  console.log('='.repeat(60));
  console.log('🦞 BELENTANI NEXUS - QUICK START');
  console.log('='.repeat(60));
  console.log();
  
  const api = new BelentaniAPI();
  const prompts = new PromptGenerator();
  
  // 1. Verificar API keys
  console.log('1️⃣  Verificando API keys...');
  const keys = {
    qwen: process.env.DASHSCOPE_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    zai: process.env.ZAI_API_KEY,
    silicon: process.env.SILICON_API_KEY,
    fal: process.env.FAL_KEY
  };
  
  const configured = Object.entries(keys).filter(([k, v]) => v && !v.includes('your_'));
  console.log(`✅ ${configured.length}/6 APIs configuradas`);
  
  if (configured.length === 0) {
    console.log('\n⚠️  No hay API keys configuradas.');
    console.log('Ejecuta: npm run setup');
    return;
  }
  
  console.log('   Providers disponibles:');
  configured.forEach(([name]) => console.log(`   - ${name}`));
  console.log();
  
  // 2. Test rápido de chat
  console.log('2️⃣  Test rápido de chat...');
  const provider = configured[0][0];
  
  try {
    const response = await api.chat('Escribe un haiku sobre el futuro cyberpunk', {
      provider
    });
    console.log(`✅ Respuesta de ${provider}:`);
    console.log(`   "${response}"`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log();
  
  // 3. Generar prompt de ejemplo
  console.log('3️⃣  Generando prompt cyberpunk...');
  const prompt = prompts.generateCyberpunk('mysterious hacker in neon city');
  console.log('✅ Prompt generado:');
  console.log(`   "${prompt.substring(0, 100)}..."`);
  console.log();
  
  // 4. Mostrar estadísticas
  console.log('4️⃣  Estadísticas del sistema:');
  const stats = api.getStats();
  console.log(`   Requests: ${stats.session.requests.total}`);
  console.log(`   Cache hits: ${stats.cache.hits}`);
  console.log(`   Costo estimado: €${stats.session.costs.estimated.toFixed(4)}`);
  console.log();
  
  // 5. Próximos pasos
  console.log('5️⃣  Próximos pasos:');
  console.log('   - Ejecutar demo completa: npm run demo');
  console.log('   - Producir videoclip: npm run judas');
  console.log('   - Generar video musical: npm run imax');
  console.log('   - Sesión de fotos: npm run cyberpunk');
  console.log();
  
  console.log('='.repeat(60));
  console.log('✅ QUICK START COMPLETADO');
  console.log('='.repeat(60));
}

quickStart().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
