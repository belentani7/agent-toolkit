#!/usr/bin/env node
/**
 * BELENTANI NEXUS - CLI Interface
 * Interfaz de línea de comandos para el ecosistema
 */

const BelentaniAPI = require('./api-clients/belentani-api-v2');
const IMAXAlbumEngine = require('./imax-album-engine/engine');
const CyberpunkExtraction = require('./cyberpunk-extraction/engine');
const JudasOrchestrator = require('./judas-storyboard/orchestrator');
const ProjectTemplates = require('./api-clients/project-templates');
const AssetManager = require('./api-clients/asset-manager');
const PromptGenerator = require('./api-clients/prompt-generator');

class CLI {
  constructor() {
    this.api = new BelentaniAPI();
    this.templates = new ProjectTemplates();
    this.assets = new AssetManager();
    this.prompts = new PromptGenerator();
    
    this.commands = {
      'help': () => this.showHelp(),
      'demo': () => this.runDemo(),
      'judas': () => this.runJudas(),
      'imax': () => this.runIMAX(),
      'cyberpunk': () => this.runCyberpunk(),
      'prompt': (args) => this.generatePrompt(args),
      'stats': () => this.showStats(),
      'templates': () => this.listTemplates(),
      'assets': () => this.listAssets(),
      'clear-cache': () => this.clearCache(),
      'export': (args) => this.exportAssets(args)
    };
  }
  
  async run(command, args = []) {
    console.log('\n🦞 BELENTANI NEXUS CLI\n');
    
    if (!this.commands[command]) {
      console.log(`❌ Comando no reconocido: ${command}`);
      this.showHelp();
      return;
    }
    
    try {
      await this.commands[command](args);
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
    }
  }
  
  showHelp() {
    console.log('📚 COMANDOS DISPONIBLES:\n');
    console.log('  help              - Mostrar esta ayuda');
    console.log('  demo              - Ejecutar demo de APIs');
    console.log('  judas             - Producir videoclip "Judas"');
    console.log('  imax              - Generar video musical IMAX');
    console.log('  cyberpunk         - Sesión de fotos cyberpunk');
    console.log('  prompt <type>     - Generar prompt (cyberpunk/cinematic/storyboard)');
    console.log('  stats             - Mostrar estadísticas');
    console.log('  templates         - Listar templates disponibles');
    console.log('  assets            - Listar assets generados');
    console.log('  clear-cache       - Limpiar caché de requests');
    console.log('  export <format>   - Exportar assets (json/csv/markdown)');
    console.log('\n📖 DOCUMENTACIÓN:');
    console.log('  README.md         - Documentación completa');
    console.log('  GUIA_INICIO.md    - Guía de inicio rápido');
    console.log('  LEGADO.md         - Filosofía y visión\n');
  }
  
  async runDemo() {
    console.log('🧪 EJECUTANDO DEMO...\n');
    
    // Test 1: Chat con Qwen
    console.log('1️⃣  Test: Chat con Qwen');
    try {
      const response = await this.api.chat('Escribe un haiku cyberpunk', {
        provider: 'qwen'
      });
      console.log('✅ Respuesta:', response);
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    
    // Test 2: Chat con Gemini
    console.log('\n2️⃣  Test: Chat con Gemini');
    try {
      const response = await this.api.chat('Describe una ciudad cyberpunk en 3 palabras', {
        provider: 'gemini'
      });
      console.log('✅ Respuesta:', response);
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    
    // Test 3: Generar prompt
    console.log('\n3️⃣  Test: Generar prompt cyberpunk');
    const prompt = this.prompts.generateCyberpunk('mysterious figure in neon city');
    console.log('✅ Prompt:', prompt);
    
    // Test 4: Estadísticas
    console.log('\n4️⃣  Estadísticas:');
    const stats = this.api.getStats();
    console.log('  Cache:', stats.cache);
    console.log('  Session:', stats.session);
    
    console.log('\n✅ DEMO COMPLETADA\n');
  }
  
  async runJudas() {
    console.log('🎬 PRODUCCIENDO "JUDAS"...\n');
    
    const orchestrator = new JudasOrchestrator(this.api);
    
    console.log('1️⃣  Generando concepto visual...');
    const concept = await orchestrator.generateConcept();
    console.log('✅ Concepto:', concept.title);
    
    console.log('\n2️⃣  Generando storyboard...');
    const storyboard = await orchestrator.generateStoryboard(concept);
    console.log(`✅ ${storyboard.length} escenas generadas`);
    
    console.log('\n3️⃣  Generando assets visuales...');
    const assets = await orchestrator.generateVisualAssets(storyboard);
    console.log(`✅ ${assets.length} assets generados`);
    
    console.log('\n4️⃣  Generando material promocional...');
    const promo = await orchestrator.generatePromotionalMaterial(concept);
    console.log(`✅ ${promo.length} piezas promocionales`);
    
    console.log('\n✅ PRODUCCIÓN "JUDAS" COMPLETADA\n');
    console.log('📁 Assets guardados en: output/judas/');
    console.log('📊 Estadísticas:');
    this.api.generateReport();
  }
  
  async runIMAX() {
    console.log('🎥 GENERANDO VIDEO MUSICAL IMAX...\n');
    
    const engine = new IMAXAlbumEngine(this.api);
    
    console.log('1️⃣  Analizando estructura musical...');
    const analysis = await engine.analyzeSongStructure();
    console.log('✅ Estructura:', analysis.sections.length, 'secciones');
    
    console.log('\n2️⃣  Generando storyboard...');
    const storyboard = await engine.generateStoryboard(analysis);
    console.log(`✅ ${storyboard.length} escenas`);
    
    console.log('\n3️⃣  Generando keyframes...');
    const keyframes = await engine.generateKeyframes(storyboard);
    console.log(`✅ ${keyframes.length} keyframes`);
    
    console.log('\n4️⃣  Animando keyframes...');
    const videos = await engine.animateKeyframes(keyframes);
    console.log(`✅ ${videos.length} clips de video`);
    
    console.log('\n5️⃣  Compilando video final...');
    const finalVideo = await engine.compileFinalVideo(videos);
    console.log('✅ Video final:', finalVideo.outputPath);
    
    console.log('\n✅ VIDEO MUSICAL IMAX COMPLETADO\n');
  }
  
  async runCyberpunk() {
    console.log('📸 GENERANDO SESIÓN CYBERPUNK...\n');
    
    const engine = new CyberpunkExtraction(this.api);
    
    console.log('1️⃣  Generando conceptos...');
    const concepts = await engine.generateConcepts(10);
    console.log(`✅ ${concepts.length} conceptos únicos`);
    
    console.log('\n2️⃣  Generando prompts...');
    const prompts = await engine.generatePrompts(concepts, 'neon');
    console.log(`✅ ${prompts.length} prompts cinematográficos`);
    
    console.log('\n3️⃣  Generando imágenes...');
    const images = await engine.generatePhotoshoot(concepts, 'neon');
    console.log(`✅ ${images.length} imágenes generadas`);
    
    console.log('\n✅ SESIÓN CYBERPUNK COMPLETADA\n');
    console.log('📁 Imágenes guardadas en: output/cyberpunk/');
  }
  
  generatePrompt(args) {
    const type = args[0] || 'cyberpunk';
    const subject = args.slice(1).join(' ') || 'mysterious figure';
    
    console.log(`🎨 GENERANDO PROMPT: ${type}\n`);
    
    let prompt;
    
    switch (type) {
      case 'cyberpunk':
        prompt = this.prompts.generateCyberpunk(subject);
        break;
      case 'cinematic':
        prompt = this.prompts.generateCinematic(subject);
        break;
      case 'storyboard':
        prompt = this.prompts.generateStoryboard(1, subject);
        break;
      case 'photoshoot':
        prompt = this.prompts.generatePhotoshootPrompt(subject, 'neon');
        break;
      default:
        prompt = this.prompts.generateCyberpunk(subject);
    }
    
    console.log('✅ PROMPT:\n');
    console.log(prompt);
    console.log('\n');
  }
  
  showStats() {
    console.log('📊 ESTADÍSTICAS DEL SISTEMA\n');
    
    const stats = this.api.getStats();
    
    console.log('📡 REQUESTS:');
    console.log(`  Total: ${stats.session.requests.total}`);
    console.log(`  Successful: ${stats.session.requests.successful}`);
    console.log(`  Failed: ${stats.session.requests.failed}`);
    
    console.log('\n💾 CACHE:');
    console.log(`  Hits: ${stats.cache.hits}`);
    console.log(`  Misses: ${stats.cache.misses}`);
    console.log(`  Hit Rate: ${stats.cache.hitRate}%`);
    
    console.log('\n💰 COSTOS:');
    console.log(`  Estimated: €${stats.session.costs.estimated.toFixed(2)}`);
    console.log(`  Saved: €${stats.session.costs.saved.toFixed(2)}`);
    
    console.log('\n🔌 PROVIDERS:');
    for (const [provider, data] of Object.entries(stats.session.byProvider)) {
      console.log(`  ${provider}: ${data.count} requests`);
    }
    
    console.log('\n');
  }
  
  listTemplates() {
    console.log('📋 TEMPLATES DISPONIBLES\n');
    
    const templates = this.templates.listTemplates();
    
    templates.forEach((t, i) => {
      console.log(`${i + 1}. ${t.name}`);
      console.log(`   ${t.description}\n`);
    });
  }
  
  async listAssets() {
    console.log('📦 ASSETS GENERADOS\n');
    
    await this.assets.init();
    const stats = await this.assets.getStats();
    
    console.log(`Total: ${stats.total} assets`);
    console.log(`Tamaño: ${stats.totalSize}`);
    
    console.log('\nPor tipo:');
    for (const [type, count] of Object.entries(stats.byType)) {
      console.log(`  ${type}: ${count}`);
    }
    
    if (stats.oldest) {
      console.log(`\nMás antiguo: ${stats.oldest}`);
      console.log(`Más reciente: ${stats.newest}`);
    }
    
    console.log('\n');
  }
  
  clearCache() {
    console.log('🗑️  LIMPIANDO CACHÉ...\n');
    this.api.clearCache();
    console.log('✅ Caché limpiado\n');
  }
  
  async exportAssets(args) {
    const format = args[0] || 'json';
    
    console.log(`📤 EXPORTANDO ASSETS (${format.toUpperCase()})...\n`);
    
    await this.assets.init();
    const filepath = await this.assets.exportAssets(format);
    
    console.log(`✅ Exportado a: ${filepath}\n`);
  }
}

// Ejecutar CLI si se llama directamente
if (require.main === module) {
  const cli = new CLI();
  const command = process.argv[2] || 'help';
  const args = process.argv.slice(3);
  
  cli.run(command, args).catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = CLI;
