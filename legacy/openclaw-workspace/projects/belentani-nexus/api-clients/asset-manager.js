#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Asset Manager
 * Gestiona assets generados (imágenes, videos, metadata)
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class AssetManager {
  constructor(options = {}) {
    this.baseDir = options.baseDir || path.join(__dirname, '../output');
    this.metadataDir = path.join(this.baseDir, 'metadata');
    this.indexFile = path.join(this.baseDir, 'assets-index.json');
    
    this.index = [];
  }
  
  /**
   * Inicializa directorios
   */
  async init() {
    await fs.mkdir(this.baseDir, { recursive: true });
    await fs.mkdir(this.metadataDir, { recursive: true });
    
    // Cargar índice existente
    try {
      const data = await fs.readFile(this.indexFile, 'utf-8');
      this.index = JSON.parse(data);
    } catch (error) {
      this.index = [];
    }
  }
  
  /**
   * Guarda un asset (imagen, video, etc.)
   */
  async saveAsset(type, data, metadata = {}) {
    await this.init();
    
    const id = this.generateId();
    const timestamp = Date.now();
    const extension = this.getExtension(type);
    const filename = `${type}-${id}-${timestamp}${extension}`;
    
    // Determinar subdirectorio
    const subdir = this.getSubdir(type);
    const filepath = path.join(this.baseDir, subdir, filename);
    
    // Crear subdirectorio si no existe
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    
    // Guardar archivo
    if (typeof data === 'string' && data.startsWith('http')) {
      // Es una URL, guardar referencia
      await fs.writeFile(filepath + '.url', data);
    } else if (Buffer.isBuffer(data)) {
      // Es binary data
      await fs.writeFile(filepath, data);
    } else {
      // Es texto/JSON
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    }
    
    // Crear metadata
    const assetMetadata = {
      id,
      type,
      filename,
      filepath,
      timestamp,
      size: Buffer.isBuffer(data) ? data.length : 0,
      ...metadata
    };
    
    // Guardar metadata
    const metadataFile = path.join(this.metadataDir, `${id}.json`);
    await fs.writeFile(metadataFile, JSON.stringify(assetMetadata, null, 2));
    
    // Actualizar índice
    this.index.push(assetMetadata);
    await this.saveIndex();
    
    console.log(`[ASSET] Saved: ${filename}`);
    
    return assetMetadata;
  }
  
  /**
   * Obtiene un asset por ID
   */
  async getAsset(id) {
    const metadataFile = path.join(this.metadataDir, `${id}.json`);
    
    try {
      const data = await fs.readFile(metadataFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Lista assets por tipo
   */
  async listAssets(type = null, options = {}) {
    await this.init();
    
    let assets = this.index;
    
    if (type) {
      assets = assets.filter(a => a.type === type);
    }
    
    if (options.limit) {
      assets = assets.slice(-options.limit);
    }
    
    if (options.sortBy) {
      assets.sort((a, b) => {
        if (options.sortBy === 'timestamp') {
          return b.timestamp - a.timestamp;
        }
        return 0;
      });
    }
    
    return assets;
  }
  
  /**
   * Elimina un asset
   */
  async deleteAsset(id) {
    const asset = await this.getAsset(id);
    
    if (!asset) {
      return false;
    }
    
    // Eliminar archivo
    try {
      await fs.unlink(asset.filepath);
    } catch (error) {
      // Ignorar si no existe
    }
    
    // Eliminar metadata
    try {
      await fs.unlink(path.join(this.metadataDir, `${id}.json`));
    } catch (error) {
      // Ignorar si no existe
    }
    
    // Actualizar índice
    this.index = this.index.filter(a => a.id !== id);
    await this.saveIndex();
    
    console.log(`[ASSET] Deleted: ${id}`);
    
    return true;
  }
  
  /**
   * Busca assets por metadata
   */
  async searchAssets(query) {
    await this.init();
    
    const results = this.index.filter(asset => {
      const searchable = JSON.stringify(asset).toLowerCase();
      return searchable.includes(query.toLowerCase());
    });
    
    return results;
  }
  
  /**
   * Exporta assets a formato específico
   */
  async exportAssets(format = 'json', options = {}) {
    await this.init();
    
    let assets = this.index;
    
    if (options.type) {
      assets = assets.filter(a => a.type === options.type);
    }
    
    const timestamp = Date.now();
    const filename = `assets-export-${timestamp}.${format}`;
    const filepath = path.join(this.baseDir, filename);
    
    let content;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(assets, null, 2);
        break;
      case 'csv':
        content = this.toCSV(assets);
        break;
      case 'markdown':
        content = this.toMarkdown(assets);
        break;
      default:
        throw new Error(`Formato no soportado: ${format}`);
    }
    
    await fs.writeFile(filepath, content);
    
    console.log(`[EXPORT] ${assets.length} assets exported to ${filename}`);
    
    return filepath;
  }
  
  /**
   * Convierte assets a CSV
   */
  toCSV(assets) {
    if (assets.length === 0) return '';
    
    const headers = Object.keys(assets[0]);
    const rows = assets.map(asset => 
      headers.map(h => JSON.stringify(asset[h] || '')).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }
  
  /**
   * Convierte assets a Markdown
   */
  toMarkdown(assets) {
    let md = '# Assets Export\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;
    md += `Total: ${assets.length} assets\n\n`;
    
    assets.forEach((asset, i) => {
      md += `## ${i + 1}. ${asset.type} - ${asset.id}\n\n`;
      md += `- **Filename:** ${asset.filename}\n`;
      md += `- **Timestamp:** ${new Date(asset.timestamp).toISOString()}\n`;
      
      if (asset.prompt) {
        md += `- **Prompt:** ${asset.prompt.substring(0, 100)}...\n`;
      }
      
      if (asset.url) {
        md += `- **URL:** ${asset.url}\n`;
      }
      
      md += '\n';
    });
    
    return md;
  }
  
  /**
   * Obtiene estadísticas
   */
  async getStats() {
    await this.init();
    
    const byType = {};
    let totalSize = 0;
    
    this.index.forEach(asset => {
      if (!byType[asset.type]) {
        byType[asset.type] = 0;
      }
      byType[asset.type]++;
      totalSize += asset.size || 0;
    });
    
    return {
      total: this.index.length,
      byType,
      totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      oldest: this.index.length > 0 ? new Date(this.index[0].timestamp).toISOString() : null,
      newest: this.index.length > 0 ? new Date(this.index[this.index.length - 1].timestamp).toISOString() : null
    };
  }
  
  /**
   * Limpia assets antiguos
   */
  async cleanup(daysToKeep = 30) {
    await this.init();
    
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const toDelete = this.index.filter(a => a.timestamp < cutoff);
    
    for (const asset of toDelete) {
      await this.deleteAsset(asset.id);
    }
    
    console.log(`[CLEANUP] Deleted ${toDelete.length} old assets`);
    
    return toDelete.length;
  }
  
  /**
   * Genera ID único
   */
  generateId() {
    return crypto.randomBytes(8).toString('hex');
  }
  
  /**
   * Obtiene extensión según tipo
   */
  getExtension(type) {
    const extensions = {
      image: '.png',
      video: '.mp4',
      audio: '.wav',
      metadata: '.json',
      prompt: '.txt'
    };
    return extensions[type] || '.dat';
  }
  
  /**
   * Obtiene subdirectorio según tipo
   */
  getSubdir(type) {
    const subdirs = {
      image: 'images',
      video: 'videos',
      audio: 'audio',
      metadata: 'metadata',
      prompt: 'prompts'
    };
    return subdirs[type] || 'misc';
  }
  
  /**
   * Guarda índice
   */
  async saveIndex() {
    await fs.writeFile(this.indexFile, JSON.stringify(this.index, null, 2));
  }
}

module.exports = AssetManager;
