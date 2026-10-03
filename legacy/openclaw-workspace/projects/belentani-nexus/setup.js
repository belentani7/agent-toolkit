#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Setup Wizard
 * Configura automáticamente el ecosistema
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class SetupWizard {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.envPath = path.join(__dirname, '.env');
    this.envExample = path.join(__dirname, '.env.example');
  }
  
  async run() {
    console.log('='.repeat(60));
    console.log('🦞 BELENTANI NEXUS - Setup Wizard');
    console.log('='.repeat(60));
    console.log();
    
    // 1. Verificar Node.js
    console.log('[1/5] Verificando Node.js...');
    const nodeVersion = process.version;
    console.log(`✓ Node.js ${nodeVersion}`);
    console.log();
    
    // 2. Verificar dependencias
    console.log('[2/5] Verificando dependencias...');
    await this.checkDependencies();
    console.log();
    
    // 3. Configurar API keys
    console.log('[3/5] Configurando API keys...');
    await this.configureAPIKeys();
    console.log();
    
    // 4. Crear directorios de output
    console.log('[4/5] Creando directorios...');
    await this.createDirectories();
    console.log();
    
    // 5. Verificar configuración
    console.log('[5/5] Verificando configuración...');
    await this.verifySetup();
    console.log();
    
    console.log('='.repeat(60));
    console.log('✅ SETUP COMPLETADO');
    console.log('='.repeat(60));
    console.log();
    console.log('Próximos pasos:');
    console.log('1. Ejecuta: npm run demo');
    console.log('2. Prueba: npm run judas');
    console.log('3. Documentación: README.md');
    console.log();
    
    this.rl.close();
  }
  
  async checkDependencies() {
    const required = ['axios', 'dotenv'];
    const missing = [];
    
    for (const dep of required) {
      try {
        require.resolve(dep);
        console.log(`✓ ${dep}`);
      } catch (error) {
        missing.push(dep);
        console.log(`✗ ${dep} (faltante)`);
      }
    }
    
    if (missing.length > 0) {
      console.log('\nInstalando dependencias faltantes...');
      const { execSync } = require('child_process');
      execSync('npm install ' + missing.join(' '), { stdio: 'inherit' });
      console.log('✓ Dependencias instaladas');
    }
  }
  
  async configureAPIKeys() {
    // Verificar si .env ya existe
    if (fs.existsSync(this.envPath)) {
      console.log('✓ Archivo .env ya existe');
      const answer = await this.ask('¿Deseas reconfigurar las API keys? (s/n): ');
      if (answer.toLowerCase() !== 's') {
        return;
      }
    }
    
    // Copiar .env.example
    if (!fs.existsSync(this.envExample)) {
      console.log('✗ .env.example no encontrado');
      return;
    }
    
    fs.copyFileSync(this.envExample, this.envPath);
    console.log('✓ Archivo .env creado desde .env.example');
    
    // Preguntar por cada API key
    const keys = [
      { name: 'GEMINI_API_KEY', url: 'https://makersuite.google.com/app/apikey', required: true },
      { name: 'GROQ_API_KEY', url: 'https://console.groq.com/keys', required: true },
      { name: 'DASHSCOPE_API_KEY', url: 'https://dashscope.console.aliyun.com/', required: false },
      { name: 'FAL_KEY', url: 'https://fal.ai/dashboard/keys', required: false },
      { name: 'ZAI_API_KEY', url: 'https://open.bigmodel.cn/', required: false },
      { name: 'SILICON_API_KEY', url: 'https://cloud.siliconflow.cn/', required: false }
    ];
    
    console.log('\nConfigura tus API keys (deja vacío para saltar):');
    console.log('Las APIs gratuitas son suficientes para empezar.\n');
    
    for (const key of keys) {
      const answer = await this.ask(`${key.name}: `);
      if (answer.trim()) {
        this.updateEnvFile(key.name, answer.trim());
        console.log(`✓ ${key.name} configurada`);
      } else {
        console.log(`⊘ ${key.name} saltada`);
      }
    }
    
    console.log('\n✓ API keys guardadas en .env');
  }
  
  async createDirectories() {
    const dirs = [
      'output/imax-album',
      'output/cyberpunk',
      'output/judas',
      'assets',
      'logs'
    ];
    
    for (const dir of dirs) {
      const fullPath = path.join(__dirname, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✓ ${dir}`);
      } else {
        console.log(`✓ ${dir} (ya existe)`);
      }
    }
  }
  
  async verifySetup() {
    // Verificar que .env existe
    if (!fs.existsSync(this.envPath)) {
      console.log('✗ .env no encontrado');
      return;
    }
    
    // Leer .env y contar keys configuradas
    const envContent = fs.readFileSync(this.envPath, 'utf-8');
    const lines = envContent.split('\n');
    const configuredKeys = lines.filter(line => {
      return line.includes('=') && !line.startsWith('#') && !line.includes('your_');
    }).length;
    
    console.log(`✓ ${configuredKeys} API keys configuradas`);
    
    // Verificar dependencias
    try {
      require('axios');
      require('dotenv');
      console.log('✓ Dependencias OK');
    } catch (error) {
      console.log('✗ Dependencias faltantes');
    }
    
    // Verificar directorios
    const dirs = ['output/imax-album', 'output/cyberpunk', 'output/judas'];
    for (const dir of dirs) {
      if (fs.existsSync(path.join(__dirname, dir))) {
        console.log(`✓ ${dir}`);
      }
    }
  }
  
  updateEnvFile(key, value) {
    let content = fs.readFileSync(this.envPath, 'utf-8');
    const regex = new RegExp(`^${key}=.*$`, 'm');
    
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
    
    fs.writeFileSync(this.envPath, content);
  }
  
  ask(question) {
    return new Promise(resolve => {
      this.rl.question(question, answer => {
        resolve(answer);
      });
    });
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const wizard = new SetupWizard();
  wizard.run().catch(error => {
    console.error('[ERROR]', error);
    process.exit(1);
  });
}

module.exports = SetupWizard;
