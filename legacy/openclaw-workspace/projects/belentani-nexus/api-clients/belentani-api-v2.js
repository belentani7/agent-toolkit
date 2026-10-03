#!/usr/bin/env node
/**
 * BELENTANI NEXUS - API Client v2
 * Cliente unificado con caché, retry y logging
 */

const axios = require('axios');
require('dotenv').config();
const RequestCache = require('./cache');
const Logger = require('./logger');

class BelentaniAPI {
  constructor(options = {}) {
    this.providers = {
      // GRATIS
      gemini: {
        url: 'https://generativelanguage.googleapis.com/v1beta/models',
        key: process.env.GEMINI_API_KEY,
        models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro']
      },
      groq: {
        url: 'https://api.groq.com/openai/v1',
        key: process.env.GROQ_API_KEY,
        models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768']
      },
      pollinations: {
        url: 'https://text.pollinations.ai',
        key: null,
        models: ['openai', 'mistral']
      },
      zai: {
        url: 'https://api.z.ai/api/paas/v4/chat/completions',
        key: process.env.ZAI_API_KEY,
        models: ['glm-4-plus', 'glm-4v-plus']
      },
      silicon: {
        url: 'https://api.siliconflow.cn/v1',
        key: process.env.SILICON_API_KEY,
        models: ['Qwen/Qwen2.5-72B-Instruct', 'deepseek-ai/DeepSeek-V3']
      },
      
      // TOKEN PLAN
      qwen: {
        url: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
        key: process.env.DASHSCOPE_API_KEY,
        models: ['qwen-plus', 'qwen-max', 'qwen-turbo']
      },
      
      // IMAGEN
      fal: {
        url: 'https://fal.run',
        key: process.env.FAL_KEY,
        models: ['fal-ai/flux/dev', 'fal-ai/flux-pro']
      },
      stability: {
        url: 'https://api.stability.ai/v2beta',
        key: process.env.STABILITY_API_KEY,
        models: ['stable-diffusion-xl-1024-v1-0']
      },
      
      // VIDEO
      minimax: {
        url: 'https://api.minimaxi.chat/v1',
        key: process.env.MINIMAX_API_KEY,
        models: ['video-01']
      },
      luma: {
        url: 'https://api.lumalabs.ai/dream-machine/v1',
        key: process.env.LUMA_API_KEY,
        models: ['dream-machine']
      }
    };
    
    this.defaultProvider = options.defaultProvider || 'qwen';
    this.cache = new RequestCache();
    this.logger = new Logger();
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    
    this.logger.info('API Client v2 initialized');
  }
  
  /**
   * Chat con retry y caché
   */
  async chat(prompt, options = {}) {
    const startTime = Date.now();
    const provider = options.provider || this.defaultProvider;
    const model = options.model || this.providers[provider].models[0];
    const useCache = options.cache !== false;
    
    this.logger.debug(`Chat request: ${provider}/${model}`);
    
    // Intentar caché
    if (useCache) {
      const cached = this.cache.get(this.cache.generateKey('text', prompt, { provider, model }));
      if (cached) {
        this.logger.request(provider, 'text', Date.now() - startTime, true);
        return cached;
      }
    }
    
    // Retry logic
    let lastError;
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await this.callProvider(provider, prompt, model);
        
        // Guardar en caché
        if (useCache) {
          this.cache.set(this.cache.generateKey('text', prompt, { provider, model }), response);
        }
        
        this.logger.request(provider, 'text', Date.now() - startTime, true);
        return response;
      } catch (error) {
        lastError = error;
        this.logger.warn(`Attempt ${attempt + 1} failed for ${provider}: ${error.message}`);
        
        if (attempt < this.maxRetries - 1) {
          await this.sleep(this.retryDelay * (attempt + 1));
        }
      }
    }
    
    this.logger.request(provider, 'text', Date.now() - startTime, false);
    this.logger.error(`All ${this.maxRetries} attempts failed for ${provider}`, lastError);
    throw lastError;
  }
  
  /**
   * Llama al provider específico
   */
  async callProvider(provider, prompt, model) {
    switch (provider) {
      case 'gemini':
        return await this.callGemini(prompt, model);
      case 'groq':
        return await this.callGroq(prompt, model);
      case 'pollinations':
        return await this.callPollinations(prompt, model);
      case 'zai':
        return await this.callZAI(prompt, model);
      case 'silicon':
        return await this.callSilicon(prompt, model);
      case 'qwen':
        return await this.callQwen(prompt, model);
      default:
        throw new Error(`Provider desconocido: ${provider}`);
    }
  }
  
  async callGemini(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.gemini.url}/${model}:generateContent?key=${this.providers.gemini.key}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    return data.candidates[0].content.parts[0].text;
  }
  
  async callGroq(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.groq.url}/chat/completions`,
      { model, messages: [{ role: 'user', content: prompt }] },
      { headers: { 'Authorization': `Bearer ${this.providers.groq.key}` } }
    );
    return data.choices[0].message.content;
  }
  
  async callPollinations(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.pollinations.url}/openai`,
      { model, messages: [{ role: 'user', content: prompt }] }
    );
    return data.choices[0].message.content;
  }
  
  async callZAI(prompt, model) {
    const { data } = await axios.post(
      this.providers.zai.url,
      { model, messages: [{ role: 'user', content: prompt }] },
      { headers: { 'Authorization': `Bearer ${this.providers.zai.key}` } }
    );
    return data.choices[0].message.content;
  }
  
  async callSilicon(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.silicon.url}/chat/completions`,
      { model, messages: [{ role: 'user', content: prompt }] },
      { headers: { 'Authorization': `Bearer ${this.providers.silicon.key}` } }
    );
    return data.choices[0].message.content;
  }
  
  async callQwen(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.qwen.url}/chat/completions`,
      { model, messages: [{ role: 'user', content: prompt }] },
      { headers: { 'Authorization': `Bearer ${this.providers.qwen.key}` } }
    );
    return data.choices[0].message.content;
  }
  
  /**
   * Generación de imagen con retry
   */
  async generateImage(prompt, options = {}) {
    const startTime = Date.now();
    const provider = options.provider || 'fal';
    
    this.logger.debug(`Image request: ${provider}`);
    
    try {
      let result;
      
      if (provider === 'fal') {
        result = await this.callFalImage(prompt, options);
      } else if (provider === 'stability') {
        result = await this.callStabilityImage(prompt, options);
      } else {
        throw new Error(`Provider de imagen desconocido: ${provider}`);
      }
      
      this.logger.request(provider, 'image', Date.now() - startTime, true);
      return result;
    } catch (error) {
      this.logger.request(provider, 'image', Date.now() - startTime, false);
      this.logger.error(`Image generation failed for ${provider}`, error);
      throw error;
    }
  }
  
  async callFalImage(prompt, options) {
    const model = options.model || 'fal-ai/flux/dev';
    const { data } = await axios.post(
      `${this.providers.fal.url}/${model}`,
      {
        prompt,
        image_size: options.size || 'landscape_16_9',
        num_images: options.count || 1
      },
      { headers: { 'Authorization': `Key ${this.providers.fal.key}` } }
    );
    return data.images.map(img => img.url);
  }
  
  async callStabilityImage(prompt, options) {
    const { data } = await axios.post(
      `${this.providers.stability.url}/stable-diffusion/text-to-image`,
      { prompt, output_format: 'png' },
      {
        headers: { 'Authorization': `Bearer ${this.providers.stability.key}` },
        responseType: 'arraybuffer'
      }
    );
    return Buffer.from(data).toString('base64');
  }
  
  /**
   * Generación de video con retry
   */
  async generateVideo(prompt, imageUrl, options = {}) {
    const startTime = Date.now();
    const provider = options.provider || 'minimax';
    
    this.logger.debug(`Video request: ${provider}`);
    
    try {
      let result;
      
      if (provider === 'minimax') {
        result = await this.callMinimaxVideo(prompt, imageUrl, options);
      } else if (provider === 'luma') {
        result = await this.callLumaVideo(prompt, imageUrl, options);
      } else {
        throw new Error(`Provider de video desconocido: ${provider}`);
      }
      
      this.logger.request(provider, 'video', Date.now() - startTime, true);
      return result;
    } catch (error) {
      this.logger.request(provider, 'video', Date.now() - startTime, false);
      this.logger.error(`Video generation failed for ${provider}`, error);
      throw error;
    }
  }
  
  async callMinimaxVideo(prompt, imageUrl, options) {
    const { data } = await axios.post(
      `${this.providers.minimax.url}/video_generation`,
      { model: 'video-01', prompt, first_frame_image: imageUrl },
      { headers: { 'Authorization': `Bearer ${this.providers.minimax.key}` } }
    );
    return data.task_id;
  }
  
  async callLumaVideo(prompt, imageUrl, options) {
    const { data } = await axios.post(
      `${this.providers.luma.url}/generations`,
      {
        prompt,
        keyframes: { frame0: { type: 'image', url: imageUrl } }
      },
      { headers: { 'Authorization': `Bearer ${this.providers.luma.key}` } }
    );
    return data.id;
  }
  
  /**
   * Obtiene estadísticas
   */
  getStats() {
    return {
      cache: this.cache.getStats(),
      session: this.logger.getStats()
    };
  }
  
  /**
   * Limpia caché
   */
  clearCache() {
    this.cache.clear();
  }
  
  /**
   * Genera reporte completo
   */
  generateReport() {
    this.logger.generateReport();
    console.log('\n📦 CACHE STATS:');
    console.log(this.cache.getStats());
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = BelentaniAPI;
