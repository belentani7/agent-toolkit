import { generateText } from 'ai';

// Modelo configurable. En free tier de Vercel AI Gateway funcionan:
//   openai/gpt-4o-mini, openai/gpt-4.1-mini, meta/llama-3.3-70b,
//   alibaba/qwen3-coder, mistral/mistral-small
// NO funcionan en free tier (requieren creditos de pago):
//   openai/gpt-5.6-sol, openai/gpt-5.6-luna, anthropic/claude-haiku-4.5
const model = process.env.AI_GATEWAY_MODEL ?? 'openai/gpt-4o-mini';

const { text, usage } = await generateText({
  model,
  prompt: 'Inventa un dia festivo nuevo y describe sus tradiciones en 3 frases.',
});

console.log(`[modelo: ${model}]`);
console.log(text);
console.log(`[tokens: ${usage?.totalTokens ?? '?'}]`);
