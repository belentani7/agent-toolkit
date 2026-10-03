#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Logger & Monitor
 * Sistema de logging y monitoreo de uso
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.logDir = options.logDir || path.join(__dirname, '../logs');
    this.logLevel = options.logLevel || 'info'; // debug, info, warn, error
    
    // Crear directorio de logs si no existe
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // Archivo de log del día
    const date = new Date().toISOString().split('T')[0];
    this.logFile = path.join(this.logDir, `belentani-${date}.log`);
    
    // Estadísticas de sesión
    this.stats = {
      startTime: Date.now(),
      requests: 0,
      errors: 0,
      byProvider: {},
      byType: {}
    };
    
    console.log(`[LOG] Logging to: ${this.logFile}`);
  }
  
  /**
   * Log genérico
   */
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level,
      message,
      data
    };
    
    const line = JSON.stringify(entry);
    
    // Escribir a archivo
    fs.appendFileSync(this.logFile, line + '\n');
    
    // Console output (solo si el nivel es suficiente)
    if (this.shouldLog(level)) {
      const prefix = `[${level.toUpperCase()}]`;
      console.log(`${prefix} ${message}`);
      if (data && level === 'error') {
        console.log(data);
      }
    }
  }
  
  /**
   * Log de debug
   */
  debug(message, data = null) {
    this.log('debug', message, data);
  }
  
  /**
   * Log de info
   */
  info(message, data = null) {
    this.log('info', message, data);
  }
  
  /**
   * Log de warning
   */
  warn(message, data = null) {
    this.log('warn', message, data);
  }
  
  /**
   * Log de error
   */
  error(message, data = null) {
    this.log('error', message, data);
    this.stats.errors++;
  }
  
  /**
   * Registra un request de API
   */
  request(provider, type, duration, success = true) {
    this.stats.requests++;
    
    // Por provider
    if (!this.stats.byProvider[provider]) {
      this.stats.byProvider[provider] = { count: 0, errors: 0 };
    }
    this.stats.byProvider[provider].count++;
    if (!success) {
      this.stats.byProvider[provider].errors++;
    }
    
    // Por tipo
    if (!this.stats.byType[type]) {
      this.stats.byType[type] = 0;
    }
    this.stats.byType[type]++;
    
    this.debug(`API request: ${provider}/${type} (${duration}ms)`, { success });
  }
  
  /**
   * Verifica si se debe loguear según el nivel
   */
  shouldLog(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }
  
  /**
   * Obtiene estadísticas de la sesión
   */
  getStats() {
    const uptime = Date.now() - this.stats.startTime;
    const uptimeMinutes = Math.floor(uptime / 1000 / 60);
    
    return {
      uptime: `${uptimeMinutes}m`,
      requests: this.stats.requests,
      errors: this.stats.errors,
      errorRate: this.stats.requests > 0 
        ? ((this.stats.errors / this.stats.requests) * 100).toFixed(2) + '%'
        : '0%',
      byProvider: this.stats.byProvider,
      byType: this.stats.byType
    };
  }
  
  /**
   * Genera reporte de sesión
   */
  generateReport() {
    const stats = this.getStats();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE DE SESIÓN');
    console.log('='.repeat(60));
    console.log(`Uptime: ${stats.uptime}`);
    console.log(`Requests: ${stats.requests}`);
    console.log(`Errors: ${stats.errors} (${stats.errorRate})`);
    console.log('\nPor Provider:');
    for (const [provider, data] of Object.entries(stats.byProvider)) {
      console.log(`  ${provider}: ${data.count} requests, ${data.errors} errors`);
    }
    console.log('\nPor Tipo:');
    for (const [type, count] of Object.entries(stats.byType)) {
      console.log(`  ${type}: ${count}`);
    }
    console.log('='.repeat(60));
    
    return stats;
  }
  
  /**
   * Limpia logs antiguos (más de 7 días)
   */
  cleanupOldLogs(daysToKeep = 7) {
    const files = fs.readdirSync(this.logDir);
    const now = Date.now();
    const cutoff = now - (daysToKeep * 24 * 60 * 60 * 1000);
    
    let deleted = 0;
    
    for (const file of files) {
      if (!file.endsWith('.log')) continue;
      
      const filePath = path.join(this.logDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.mtimeMs < cutoff) {
        fs.unlinkSync(filePath);
        deleted++;
      }
    }
    
    if (deleted > 0) {
      this.info(`Cleaned up ${deleted} old log files`);
    }
  }
}

module.exports = Logger;
