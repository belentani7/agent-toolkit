#!/usr/bin/env node
/**
 * BELENTANI NEXUS - Prompt Generator
 * Generador avanzado de prompts para IA
 */

class PromptGenerator {
  constructor() {
    this.styles = {
      cyberpunk: {
        keywords: ['neon', 'cyberpunk', 'futuristic', 'dystopian', 'holographic', 'chrome', 'dark'],
        colors: ['cyan', 'magenta', 'purple', 'green neon', 'blue electric'],
        lighting: ['neon lights', 'volumetric fog', 'rain', 'reflections', 'glow']
      },
      cinematic: {
        keywords: ['cinematic', 'dramatic', 'epic', 'professional', 'high quality', '8k'],
        colors: ['golden hour', 'warm tones', 'deep shadows', 'contrast'],
        lighting: ['volumetric', 'god rays', 'rim light', 'backlight']
      },
      anime: {
        keywords: ['anime', 'manga', 'studio ghibli', 'makoto shinkai', 'detailed'],
        colors: ['vibrant', 'pastel', 'saturated'],
        lighting: ['soft', 'dreamy', 'ethereal']
      }
    };
    
    this.qualities = [
      'ultra detailed',
      'sharp focus',
      'professional',
      'high resolution',
      '8k',
      'photorealistic',
      'masterpiece'
    ];
    
    this.cameras = [
      '85mm lens',
      '35mm lens',
      'wide angle',
      'telephoto',
      'macro',
      'fisheye'
    ];
    
    this.compositions = [
      'rule of thirds',
      'centered',
      'dynamic angle',
      'low angle',
      'high angle',
      'dutch angle'
    ];
  }
  
  /**
   * Genera prompt para imagen cyberpunk
   */
  generateCyberpunk(subject, options = {}) {
    const style = this.styles.cyberpunk;
    const quality = options.quality || 'ultra detailed, 8k, professional';
    const camera = options.camera || '85mm lens, f/1.8';
    
    const elements = [
      subject,
      ...this.getRandom(style.keywords, 2),
      ...this.getRandom(style.colors, 2),
      ...this.getRandom(style.lighting, 2),
      quality,
      camera,
      'shallow depth of field',
      'sharp focus'
    ];
    
    if (options.location) {
      elements.push(options.location);
    }
    
    if (options.mood) {
      elements.push(options.mood);
    }
    
    return elements.join(', ');
  }
  
  /**
   * Genera prompt para video cinematográfico
   */
  generateCinematic(scene, options = {}) {
    const style = this.styles.cinematic;
    
    const elements = [
      scene,
      ...this.getRandom(style.keywords, 3),
      ...this.getRandom(style.lighting, 2),
      'cinematic composition',
      'professional color grading',
      'film grain',
      'anamorphic lens'
    ];
    
    if (options.camera_movement) {
      elements.push(options.camera_movement);
    }
    
    if (options.duration) {
      elements.push(`${options.duration} seconds`);
    }
    
    return elements.join(', ');
  }
  
  /**
   * Genera prompt para storyboard
   */
  generateStoryboard(sceneNumber, sceneDescription, options = {}) {
    const template = `
Scene ${sceneNumber}: ${sceneDescription}

Visual Elements:
- Setting: ${options.setting || 'cyberpunk city at night'}
- Characters: ${options.characters || 'main protagonist'}
- Action: ${options.action || 'walking through neon-lit streets'}
- Camera: ${options.camera || 'tracking shot, medium close-up'}
- Lighting: ${options.lighting || 'neon signs, volumetric fog'}
- Mood: ${options.mood || 'mysterious, atmospheric'}
- Color Palette: ${options.palette || 'cyan, magenta, deep purple'}

Technical Details:
- Aspect Ratio: 16:9
- Quality: 8K, ultra detailed
- Style: Cinematic cyberpunk
- Reference: Blade Runner 2049, Ghost in the Shell
    `.trim();
    
    return template;
  }
  
  /**
   * Genera prompt para material promocional
   */
  generatePromo(type, title, artist, options = {}) {
    const templates = {
      poster: `
Movie poster for music video "${title}" by ${artist}

Style: Cyberpunk cinematográfico
Layout: Vertical (2:3 aspect ratio)
Elements:
- Large title "${title}" at top
- Artist name "${artist}" at bottom
- Central visual: ${options.visual || 'protagonist in neon-lit city'}
- Background: ${options.background || 'dystopian cityscape'}
- Color scheme: ${options.colors || 'neon cyan, magenta, deep purple'}
- Typography: Futuristic, bold
- Mood: ${options.mood || 'dark, mysterious, epic'}

Quality: Ultra detailed, professional design, print-ready
      `.trim(),
      
      thumbnail: `
YouTube thumbnail for "${title}" by ${artist}

Style: Eye-catching cyberpunk
Layout: Square (1:1 aspect ratio)
Elements:
- Large title "${title}" (readable at small size)
- Artist name "${artist}"
- Central visual: ${options.visual || 'close-up of protagonist'}
- Background: ${options.background || 'neon lights, blurred city'}
- High contrast, vibrant colors
- Bold, readable typography

Quality: High resolution, optimized for YouTube
      `.trim(),
      
      instagram_story: `
Instagram Story promo for "${title}" by ${artist}

Style: Vertical cyberpunk aesthetic
Layout: Vertical (9:16 aspect ratio)
Elements:
- Title "${title}" (large, top)
- Artist "${artist}" (bottom)
- Visual: ${options.visual || 'dynamic action shot'}
- Background: ${options.background || 'animated neon particles'}
- Call to action: "Watch now" / "Out now"
- Swipe up indicator

Quality: Optimized for Instagram, vibrant colors
      `.trim()
    };
    
    return templates[type] || templates.poster;
  }
  
  /**
   * Genera prompt para concepto de escena
   */
  generateSceneConcept(section, emotion, intensity, options = {}) {
    const template = `
Scene Concept for: ${section}

Emotional Tone: ${emotion}
Intensity: ${intensity}/10

Visual Description:
${this.generateVisualDescription(emotion, intensity, options)}

Technical Details:
- Duration: ${options.duration || '20'} seconds
- Camera Movement: ${this.suggestCameraMovement(emotion, intensity)}
- Lighting: ${this.suggestLighting(emotion, intensity)}
- Color Palette: ${this.suggestColorPalette(emotion)}
- Transitions: ${this.suggestTransitions(intensity)}

References:
${this.suggestReferences(emotion, intensity)}
    `.trim();
    
    return template;
  }
  
  /**
   * Genera descripción visual basada en emoción
   */
  generateVisualDescription(emotion, intensity, options = {}) {
    const descriptions = {
      'dark': 'Sombras profundas, siluetas contra luces de neón, ambiente misterioso',
      'emotional': 'Primer planos expresivos, lágrimas reflejando luces, momentos íntimos',
      'energetic': 'Movimiento dinámico, luces estroboscópicas, acción rápida',
      'mysterious': 'Niebla volumétrica, figuras parcialmente ocultas, atmósfera enigmática',
      'epic': 'Planos amplios, escalas masivas, momentos grandiosos',
      'melancholic': 'Lluvia, reflejos en charcos, soledad urbana, tonos fríos'
    };
    
    const base = descriptions[emotion.toLowerCase()] || descriptions['dark'];
    
    if (intensity >= 8) {
      return `${base}\n\nAlta intensidad: elementos visuales dramáticos, contrastes extremos, movimientos rápidos.`;
    } else if (intensity >= 5) {
      return `${base}\n\nIntensidad media: equilibrio entre calma y acción, transiciones suaves.`;
    } else {
      return `${base}\n\nBaja intensidad: momentos contemplativos, planos estáticos, atmósfera serena.`;
    }
  }
  
  /**
   * Sugiere movimiento de cámara según emoción
   */
  suggestCameraMovement(emotion, intensity) {
    const movements = {
      'dark': 'Slow dolly, subtle push-in',
      'emotional': 'Handheld, intimate close-ups',
      'energetic': 'Fast tracking, dynamic angles',
      'mysterious': 'Slow pan, reveal shots',
      'epic': 'Wide crane shots, sweeping movements',
      'melancholic': 'Static shots, slow zoom out'
    };
    
    return movements[emotion.toLowerCase()] || 'Medium tracking shot';
  }
  
  /**
   * Sugiere iluminación según emoción
   */
  suggestLighting(emotion, intensity) {
    const lightings = {
      'dark': 'Low key, deep shadows, single neon source',
      'emotional': 'Soft rim light, warm highlights',
      'energetic': 'Strobing lights, high contrast',
      'mysterious': 'Volumetric fog, backlit silhouettes',
      'epic': 'Dramatic backlight, god rays',
      'melancholic': 'Cool tones, diffused light, rain reflections'
    };
    
    return lightings[emotion.toLowerCase()] || 'Balanced lighting';
  }
  
  /**
   * Sugiere paleta de colores según emoción
   */
  suggestColorPalette(emotion) {
    const palettes = {
      'dark': 'Deep purple, cyan neon, black',
      'emotional': 'Warm amber, soft pink, deep blue',
      'energetic': 'Electric blue, hot pink, white',
      'mysterious': 'Dark teal, purple haze, silver',
      'epic': 'Gold, deep red, black',
      'melancholic': 'Cool blue, gray, pale cyan'
    };
    
    return palettes[emotion.toLowerCase()] || 'Cyberpunk neon palette';
  }
  
  /**
   * Sugiere transiciones según intensidad
   */
  suggestTransitions(intensity) {
    if (intensity >= 8) {
      return 'Fast cuts, glitch transitions, flash frames';
    } else if (intensity >= 5) {
      return 'Smooth dissolves, light leaks, subtle glitches';
    } else {
      return 'Slow fades, gentle dissolves, minimal cuts';
    }
  }
  
  /**
   * Sugiere referencias visuales
   */
  suggestReferences(emotion, intensity) {
    const refs = [
      '- Blade Runner 2049 (Roger Deakins cinematography)',
      '- Ghost in the Shell (1995)',
      '- Akira (Katsuhiro Otomo)',
      '- Cyberpunk 2077 (game cinematics)',
      '- Alita: Battle Angel',
      '- Dredd (2012)'
    ];
    
    return this.getRandom(refs, 3).join('\n');
  }
  
  /**
   * Obtiene elementos aleatorios de un array
   */
  getRandom(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  /**
   * Genera prompt completo para sesión de fotos
   */
  generatePhotoshootPrompt(concept, style = 'neon') {
    const styleConfig = {
      neon: {
        lighting: 'bright neon lights, colorful reflections',
        colors: 'cyan, magenta, electric blue, hot pink',
        mood: 'vibrant, energetic, futuristic'
      },
      dystopian: {
        lighting: 'dim industrial lighting, harsh shadows',
        colors: 'dark grays, rust orange, toxic green',
        mood: 'oppressive, gritty, raw'
      },
      retro: {
        lighting: 'synthwave sunset, palm shadows',
        colors: 'purple, pink, orange gradient',
        mood: 'nostalgic, dreamy, 80s aesthetic'
      },
      minimal: {
        lighting: 'clean white light, soft shadows',
        colors: 'monochrome with single accent color',
        mood: 'sleek, modern, sophisticated'
      },
      glitch: {
        lighting: 'flickering screens, digital artifacts',
        colors: 'distorted RGB, chromatic aberration',
        mood: 'chaotic, digital, hacker'
      }
    };
    
    const config = styleConfig[style] || styleConfig.neon;
    
    return `
Cyberpunk photoshoot - ${style.toUpperCase()} style

Subject: ${concept}

Visual Elements:
- Lighting: ${config.lighting}
- Color Palette: ${config.colors}
- Mood: ${config.mood}
- Setting: Futuristic urban environment
- Props: Cybernetic enhancements, holographic displays, neon accessories

Technical:
- Camera: 85mm portrait lens, f/1.8
- Quality: Ultra realistic, 8K, professional photography
- Composition: Rule of thirds, dynamic angles
- Post-processing: High contrast, neon glow, film grain

References: Cyberpunk 2077, Blade Runner 2049, Ghost in the Shell
    `.trim();
  }
}

module.exports = PromptGenerator;
