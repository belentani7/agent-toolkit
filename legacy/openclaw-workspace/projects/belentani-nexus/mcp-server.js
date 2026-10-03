import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'belentani-nexus-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// APIs gratuitas configuradas
const APIS = {
  pollinations: {
    baseUrl: 'https://image.pollinations.ai',
    key: null, // No necesita API key
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    key: process.env.GROQ_API_KEY,
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    key: process.env.DEEPSEEK_API_KEY,
  },
  huggingface: {
    baseUrl: 'https://api-inference.huggingface.co/models',
    key: process.env.HUGGINGFACE_API_KEY,
  },
  qwen: {
    baseUrl: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
    key: process.env.QWEN_API_KEY,
  },
  kilo: {
    baseUrl: 'https://api.kilocode.ai/v1',
    key: null, // No necesita API key
  },
};

// Herramientas MCP
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'generate_image',
      description: 'Genera imágenes usando Pollinations AI (gratis, ilimitado)',
      inputSchema: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'Descripción de la imagen' },
          width: { type: 'number', description: 'Ancho en píxeles', default: 1024 },
          height: { type: 'number', description: 'Alto en píxeles', default: 1024 },
          model: { type: 'string', description: 'Modelo (flux, turbo)', default: 'flux' },
        },
        required: ['prompt'],
      },
    },
    {
      name: 'chat_completion',
      description: 'Chat con múltiples modelos (Groq, DeepSeek, Qwen, Kilo)',
      inputSchema: {
        type: 'object',
        properties: {
          provider: {
            type: 'string',
            enum: ['groq', 'deepseek', 'qwen', 'kilo'],
            description: 'Proveedor de IA',
          },
          messages: {
            type: 'array',
            description: 'Array de mensajes {role, content}',
          },
          model: { type: 'string', description: 'Modelo específico (opcional)' },
        },
        required: ['provider', 'messages'],
      },
    },
    {
      name: 'list_models',
      description: 'Lista todos los modelos disponibles por proveedor',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'check_api_status',
      description: 'Verifica el estado de las APIs configuradas',
      inputSchema: {
        type: 'object',
        properties: {
          provider: {
            type: 'string',
            enum: ['groq', 'deepseek', 'qwen', 'kilo', 'pollinations'],
            description: 'Proveedor a verificar (opcional, verifica todos si no se especifica)',
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'generate_image': {
        const { prompt, width = 1024, height = 1024, model = 'flux' } = args;
        const encodedPrompt = encodeURIComponent(prompt);
        const url = `${APIS.pollinations.baseUrl}/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&nologo=true`;
        
        return {
          content: [
            {
              type: 'text',
              text: `Imagen generada con Pollinations AI (${model}):\n\nURL: ${url}\n\nPuedes descargar la imagen directamente desde esta URL.`,
            },
          ],
        };
      }

      case 'chat_completion': {
        const { provider, messages, model } = args;
        const api = APIS[provider];

        if (!api) {
          throw new Error(`Proveedor ${provider} no encontrado`);
        }

        if (api.key === null && provider !== 'pollinations') {
          throw new Error(`API key no configurada para ${provider}. Configura ${provider.toUpperCase()}_API_KEY en .env`);
        }

        const defaultModels = {
          groq: 'llama-3.3-70b-versatile',
          deepseek: 'deepseek-chat',
          qwen: 'qwen3.8-max',
          kilo: 'gpt-4o-mini',
        };

        const selectedModel = model || defaultModels[provider];

        const response = await fetch(`${api.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(api.key ? { Authorization: `Bearer ${api.key}` } : {}),
          },
          body: JSON.stringify({
            model: selectedModel,
            messages,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Error de API ${provider}: ${response.status} - ${error}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        return {
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        };
      }

      case 'list_models': {
        const models = {
          pollinations: {
            status: '✅ Activo (sin API key)',
            models: ['flux', 'turbo'],
            limits: 'Ilimitado',
          },
          groq: {
            status: api.groq.key ? '✅ Configurado' : '⚠️ API key faltante',
            models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
            limits: '1000 req/día',
          },
          deepseek: {
            status: api.deepseek.key ? '✅ Configurado' : '⚠️ API key faltante',
            models: ['deepseek-chat', 'deepseek-coder'],
            limits: 'Free tier generoso',
          },
          qwen: {
            status: api.qwen.key ? '✅ Configurado (Token Plan Pro)' : '⚠️ API key faltante',
            models: ['qwen3.8-max', 'qwen3.7-plus', 'qwen3.6-flash'],
            limits: '90K req/mes',
          },
          kilo: {
            status: '✅ Activo (sin API key)',
            models: ['gpt-4o-mini'],
            limits: '200 req/hora',
          },
          huggingface: {
            status: api.huggingface.key ? '✅ Configurado' : '⚠️ API key faltante',
            models: ['Qwen/Qwen2.5-72B-Instruct', 'meta-llama/Llama-3.3-70B-Instruct'],
            limits: 'Variable por modelo',
          },
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(models, null, 2),
            },
          ],
        };
      }

      case 'check_api_status': {
        const { provider } = args;
        const providers = provider ? [provider] : ['groq', 'deepseek', 'qwen', 'kilo', 'pollinations'];
        const results = {};

        for (const p of providers) {
          const api = APIS[p];
          if (!api) {
            results[p] = { status: '❌ No encontrado' };
            continue;
          }

          try {
            if (p === 'pollinations') {
              results[p] = { status: '✅ Activo (sin API key necesaria)', latency: 'N/A' };
            } else if (api.key) {
              const start = Date.now();
              const response = await fetch(`${api.baseUrl}/models`, {
                headers: { Authorization: `Bearer ${api.key}` },
              });
              const latency = Date.now() - start;
              results[p] = {
                status: response.ok ? '✅ Activo' : `❌ Error ${response.status}`,
                latency: `${latency}ms`,
              };
            } else {
              results[p] = { status: '⚠️ API key no configurada' };
            }
          } catch (error) {
            results[p] = { status: `❌ Error: ${error.message}` };
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Herramienta ${name} no encontrada`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('BELENTANI NEXUS MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
