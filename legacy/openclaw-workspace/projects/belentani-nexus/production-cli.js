#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Production CLI
 * CLI para producción cinematográfica
 */

const BelentaniAPI = require('./api-clients/belentani-api-v2');
const IMAXAlbumEngine = require('./imax-album-engine/engine');
const CyberpunkExtraction = require('./cyberpunk-extraction/engine');
const JudasOrchestrator = require('./judas-storyboard/orchestrator');

class ProductionCLI {
  constructor() {
    this.api = new BelentaniAPI();
  }
  
  async produce(type, options = {}) {
    console.log(`\n🎬 PRODUCCIENDO: ${type.toUpperCase()}\n`);
    
    switch (type) {
      case 'judas':
        await this.produceJudas(options);
        break;
      case 'imax':
        await this.produceIMAX(options);
        break;
      case 'cyberpunk':
        await this.produceCyberpunk(options);
        break;
      default:
        console.log(`❌ Tipo no reconocido: ${type}`);
    }
  }
  
  async produceJudas(options) {
    const orchestrator = new JudasOrchestrator(this.api);
    
    console.log('1️⃣  Concepto visual...');
    const concept = await orchestrator.generateConcept();
    console.log(`✅ ${concept.title}`);
    
    console.log('\n2️⃣  Storyboard...');
    const storyboard = await orchestrator.generateStoryboard(concept);
    console.log(`✅ ${storyboard.length} escenas`);
    
    console.log('\n3️⃣  Assets visuales...');
    const assets = await orchestrator.generateVisualAssets(storyboard);
    console.log(`✅ ${assets.length} assets`);
    
    console.log('\n4️⃣  Material promocional...');
    const promo = await orchestrator.generatePromotionalMaterial(concept);
    console.log(`✅ ${promo.length} piezas`);
    
    console.log('\n✅ JUDAS COMPLETADO\n');
  }
  
  async produceIMAX(options) {
    const engine = new IMAXAlbumEngine(this.api);
    
    console.log('1️⃣  Análisis musical...');
    const analysis = await engine.analyzeSongStructure();
    console.log(`✅ ${analysis.sections.length} secciones`);
    
    console.log('\n2️⃣  Storyboard...');
    const storyboard = await engine.generateStoryboard(analysis);
    console.log(`✅ ${storyboard.length} escenas`);
    
    console.log('\n3️⃣  Keyframes...');
    const keyframes = await engine.generateKeyframes(storyboard);
    console.log(`✅ ${keyframes.length} keyframes`);
    
    console.log('\n4️⃣  Animación...');
    const videos = await engine.animateKeyframes(keyframes);
    console.log(`✅ ${videos.length} clips`);
    
    console.log('\n5️⃣  Compilación...');
    const finalVideo = await engine.compileFinalVideo(videos);
    console.log(`✅ ${finalVideo.outputPath}`);
    
    console.log('\n✅ IMAX COMPLETADO\n');
  }
  
  async produceCyberpunk(options) {
    const engine = new CyberpunkExtraction(this.api);
    const count = options.count || 10;
    const style = options.style || 'neon';
    
    console.log(`1️⃣  Generando ${count} conceptos...`);
    const concepts = await engine.generateConcepts(count);
    console.log(`✅ ${concepts.length} conceptos`);
    
    console.log(`\n2️⃣  Generando prompts (${style})...`);
    const prompts = await engine.generatePrompts(concepts, style);
    console.log(`✅ ${prompts.length} prompts`);
    
    console.log('\n3️⃣  Generando imágenes...');
    const images = await engine.generatePhotoshoot(concepts, style);
    console.log(`✅ ${images.length} imágenes`);
    
    console.log('\n✅ CYBERPUNK COMPLETADO\n');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const cli = new ProductionCLI();
  const type = process.argv[2];
  const options = {
    count: parseInt(process.argv[3]) || 10,
    style: process.argv[4] || 'neon'
  };
  
  if (!type) {
    console.log('Uso: node production-cli.js <tipo> [count] [style]');
    console.log('Tipos: judas, imax, cyberpunk');
    process.exit(1);
  }
  
  cli.produce(type, options).catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = ProductionCLI;
