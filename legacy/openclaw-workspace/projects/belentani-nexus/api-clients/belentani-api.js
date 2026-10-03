/**
 * BELENTANI API CLIENT - Unified Multi-Provider
 * Conecta con 50+ APIs de IA (gratis + Token Plan)
 */

const axios = require('axios');
require('dotenv').config();

class BelentaniAPI {
  constructor() {
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
        key: null, // Sin API key
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
      
      // TOKEN PLAN (prioritario)
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
    
    this.defaultProvider = 'qwen';
  }
  
  async chat(prompt, options = {}) {
    const provider = options.provider || this.defaultProvider;
    const model = options.model || this.providers[provider].models[0];
    
    console.log(`[API] ${provider}/${model}`);
    
    try {
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
    } catch (error) {
      console.error(`[API ERROR] ${provider}:`, error.message);
      throw error;
    }
  }
  
  async callGemini(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.gemini.url}/${model}:generateContent?key=${this.providers.gemini.key}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    return data.candidates[0].content.parts[0].text;
  }
  
  async callGroq(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.groq.url}/chat/completions`,
      {
        model,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.groq.key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return data.choices[0].message.content;
  }
  
  async callPollinations(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.pollinations.url}/openai`,
      {
        model,
        messages: [{ role: 'user', content: prompt }]
      }
    );
    return data.choices[0].message.content;
  }
  
  async callZAI(prompt, model) {
    const { data } = await axios.post(
      this.providers.zai.url,
      {
        model,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.zai.key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return data.choices[0].message.content;
  }
  
  async callSilicon(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.silicon.url}/chat/completions`,
      {
        model,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.silicon.key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return data.choices[0].message.content;
  }
  
  async callQwen(prompt, model) {
    const { data } = await axios.post(
      `${this.providers.qwen.url}/chat/completions`,
      {
        model,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.qwen.key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return data.choices[0].message.content;
  }
  
  // GENERACIÓN DE IMAGEN
  async generateImage(prompt, options = {}) {
    const provider = options.provider || 'fal';
    
    console.log(`[IMAGE] ${provider}`);
    
    try {
      if (provider === 'fal') {
        return await this.callFalImage(prompt, options);
      } else if (provider === 'stability') {
        return await this.callStabilityImage(prompt, options);
      }
    } catch (error) {
      console.error(`[IMAGE ERROR] ${provider}:`, error.message);
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
      {
        headers: {
          'Authorization': `Key ${this.providers.fal.key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return data.images.map(img => img.url);
  }
  
  async callStabilityImage(prompt, options) {
    const { data } = await axios.post(
      `${this.providers.stability.url}/stable-diffusion/text-to-image`,
      {
        prompt,
        output_format: 'png'
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.stability.key}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    return Buffer.from(data).toString('base64');
  }
  
  // GENERACIÓN DE VIDEO
  async generateVideo(prompt, imageUrl, options = {}) {
    const provider = options.provider || 'minimax';
    
    console.log(`[VIDEO] ${provider}`);
    
    try {
      if (provider === 'minimax') {
        return await this.callMinimaxVideo(prompt, imageUrl, options);
      } else if (provider === 'luma') {
        return await this.callLumaVideo(prompt, imageUrl, options);
      }
    } catch (error) {
      console.error(`[VIDEO ERROR] ${provider}:`, error.message);
      throw error;
    }
  }
  
  async callMinimaxVideo(prompt, imageUrl, options) {
    const { data } = await axios.post(
      `${this.providers.minimax.url}/video_generation`,
      {
        model: 'video-01',
        prompt,
        first_frame_image: imageUrl
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.minimax.key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return data.task_id;
  }
  
  async callLumaVideo(prompt, imageUrl, options) {
    const { data } = await axios.post(
      `${this.providers.luma.url}/generations`,
      {
        prompt,
        keyframes: {
          frame0: {
            type: 'image',
            url: imageUrl
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.luma.key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return data.id;
  }
}

module.exports = BelentaniAPI;
