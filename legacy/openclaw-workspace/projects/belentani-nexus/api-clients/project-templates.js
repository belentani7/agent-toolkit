#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Project Templates
 * Templates predefinidos para proyectos comunes
 */

class ProjectTemplates {
  constructor() {
    this.templates = {
      judas: this.getJudasTemplate(),
      cyberpunkAlbum: this.getCyberpunkAlbumTemplate(),
      musicVideo: this.getMusicVideoTemplate(),
      photoshoot: this.getPhotoshootTemplate(),
      promo: this.getPromoTemplate()
    };
  }
  
  /**
   * Template para proyecto "Judas"
   */
  getJudasTemplate() {
    return {
      name: 'Judas - Videoclip Cyberpunk',
      description: 'Producción completa del videoclip "Judas" con estética cyberpunk cinematográfica',
      duration: 180, // 3 minutos
      scenes: 10,
      style: 'cyberpunk-cinematic',
      
      structure: {
        intro: { duration: 20, emotion: 'mysterious', intensity: 3 },
        verse1: { duration: 30, emotion: 'dark', intensity: 5 },
        chorus1: { duration: 25, emotion: 'energetic', intensity: 8 },
        verse2: { duration: 30, emotion: 'emotional', intensity: 6 },
        chorus2: { duration: 25, emotion: 'energetic', intensity: 9 },
        bridge: { duration: 20, emotion: 'melancholic', intensity: 4 },
        finalChorus: { duration: 20, emotion: 'epic', intensity: 10 },
        outro: { duration: 10, emotion: 'dark', intensity: 2 }
      },
      
      visualConcept: {
        protagonist: 'Andrógino, ropa futurista cyberpunk, implantes cybernéticos',
        setting: 'Ciudad distópica nocturna, calles iluminadas por neón',
        props: ['Gafas VR', 'Arma futurista', 'Hologramas', 'Drones'],
        colorPalette: ['cyan', 'magenta', 'purple', 'black'],
        references: ['Blade Runner 2049', 'Ghost in the Shell', 'Cyberpunk 2077']
      },
      
      deliverables: {
        video: { format: 'mp4', resolution: '4K', fps: 30 },
        photos: { count: 20, style: 'cyberpunk-neon' },
        promo: ['poster', 'thumbnail', 'instagram-story', 'twitter-header']
      }
    };
  }
  
  /**
   * Template para álbum cyberpunk
   */
  getCyberpunkAlbumTemplate() {
    return {
      name: 'Cyberpunk Album Visual',
      description: 'Genera visuales para un álbum completo de música cyberpunk',
      tracks: 10,
      style: 'cyberpunk',
      
      trackStyles: [
        { name: 'Track 01 - Intro', mood: 'atmospheric', intensity: 3 },
        { name: 'Track 02 - Neon Dreams', mood: 'energetic', intensity: 7 },
        { name: 'Track 03 - Digital Love', mood: 'emotional', intensity: 5 },
        { name: 'Track 04 - Hacker', mood: 'dark', intensity: 8 },
        { name: 'Track 05 - Interlude', mood: 'ambient', intensity: 2 },
        { name: 'Track 06 - Rebellion', mood: 'aggressive', intensity: 9 },
        { name: 'Track 07 - Memories', mood: 'melancholic', intensity: 4 },
        { name: 'Track 08 - Uprising', mood: 'epic', intensity: 10 },
        { name: 'Track 09 - Reflection', mood: 'contemplative', intensity: 3 },
        { name: 'Track 10 - Finale', mood: 'triumphant', intensity: 8 }
      ],
      
      deliverables: {
        coverArt: { size: '3000x3000', format: 'png' },
        trackVisuals: { count: 10, style: 'matching-mood' },
        promo: ['spotify-canvas', 'youtube-thumbnails', 'social-media-kit']
      }
    };
  }
  
  /**
   * Template para video musical genérico
   */
  getMusicVideoTemplate(options = {}) {
    return {
      name: options.name || 'Music Video',
      description: 'Video musical automatizado con IA',
      duration: options.duration || 180,
      scenes: Math.floor((options.duration || 180) / 20),
      style: options.style || 'cinematic',
      
      structure: {
        intro: { duration: 15, emotion: 'atmospheric', intensity: 3 },
        verse1: { duration: 30, emotion: options.mood || 'neutral', intensity: 5 },
        chorus1: { duration: 25, emotion: 'energetic', intensity: 8 },
        verse2: { duration: 30, emotion: options.mood || 'neutral', intensity: 6 },
        chorus2: { duration: 25, emotion: 'energetic', intensity: 9 },
        bridge: { duration: 20, emotion: 'contrast', intensity: 4 },
        finalChorus: { duration: 25, emotion: 'epic', intensity: 10 },
        outro: { duration: 10, emotion: 'resolution', intensity: 3 }
      },
      
      deliverables: {
        video: { format: 'mp4', resolution: '4K', fps: 30 },
        thumbnails: { count: 5, style: 'eye-catching' },
        social: ['instagram-reel', 'tiktok-clip', 'youtube-shorts']
      }
    };
  }
  
  /**
   * Template para sesión de fotos
   */
  getPhotoshootTemplate(options = {}) {
    return {
      name: options.name || 'Cyberpunk Photoshoot',
      description: 'Sesión de fotos cyberpunk profesional',
      count: options.count || 10,
      style: options.style || 'neon',
      
      concepts: [
        { theme: 'Portrait', mood: 'intense', lighting: 'dramatic' },
        { theme: 'Action', mood: 'dynamic', lighting: 'strobing' },
        { theme: 'Mystery', mood: 'enigmatic', lighting: 'shadowy' },
        { theme: 'Romance', mood: 'intimate', lighting: 'soft neon' },
        { theme: 'Rebellion', mood: 'aggressive', lighting: 'harsh' },
        { theme: 'Reflection', mood: 'contemplative', lighting: 'ambient' },
        { theme: 'Power', mood: 'dominant', lighting: 'backlit' },
        { theme: 'Vulnerability', mood: 'exposed', lighting: 'minimal' },
        { theme: 'Transformation', mood: 'evolving', lighting: 'gradient' },
        { theme: 'Transcendence', mood: 'ethereal', lighting: 'glowing' }
      ],
      
      deliverables: {
        photos: { count: options.count || 10, format: 'png', resolution: '4K' },
        metadata: { prompts: true, concepts: true },
        social: ['instagram-carousel', 'twitter-thread', 'portfolio-gallery']
      }
    };
  }
  
  /**
   * Template para material promocional
   */
  getPromoTemplate(options = {}) {
    return {
      name: options.name || 'Promo Kit',
      description: 'Kit de material promocional completo',
      
      assets: [
        {
          type: 'poster',
          format: 'vertical',
          size: '2:3',
          description: 'Póster principal para promoción'
        },
        {
          type: 'thumbnail',
          format: 'square',
          size: '1:1',
          description: 'Thumbnail para YouTube/Spotify'
        },
        {
          type: 'banner',
          format: 'horizontal',
          size: '16:9',
          description: 'Banner para redes sociales'
        },
        {
          type: 'story',
          format: 'vertical',
          size: '9:16',
          description: 'Instagram/Facebook Story'
        },
        {
          type: 'post',
          format: 'square',
          size: '1:1',
          description: 'Post para feed de Instagram'
        },
        {
          type: 'header',
          format: 'wide',
          size: '3:1',
          description: 'Header para Twitter/YouTube'
        }
      ],
      
      deliverables: {
        images: { count: 6, format: 'png', resolution: 'high' },
        metadata: { prompts: true, usage: true },
        guidelines: { brand: true, colors: true, typography: true }
      }
    };
  }
  
  /**
   * Obtiene un template por nombre
   */
  getTemplate(name) {
    return this.templates[name] || null;
  }
  
  /**
   * Lista todos los templates disponibles
   */
  listTemplates() {
    return Object.keys(this.templates).map(name => ({
      name,
      description: this.templates[name].description
    }));
  }
  
  /**
   * Crea un proyecto desde template
   */
  async createProject(templateName, overrides = {}) {
    const template = this.getTemplate(templateName);
    
    if (!template) {
      throw new Error(`Template no encontrado: ${templateName}`);
    }
    
    // Merge con overrides
    const project = {
      ...template,
      ...overrides,
      createdAt: new Date().toISOString(),
      id: Date.now()
    };
    
    return project;
  }
}

module.exports = ProjectTemplates;
