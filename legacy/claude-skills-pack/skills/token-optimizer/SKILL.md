---
name: token-optimizer
description: Expert in LLM token optimization and cost reduction. Reduces API costs 60-90% through intelligent prompt compression, context management, caching strategies, and efficient token usage patterns.
license: MIT
compatibility: opencode
metadata:
  author: community
  version: "1.0.0"
  domain: data-ml
  triggers: token optimization, cost reduction, prompt optimization, context window, token efficiency, LLM costs, API costs, prompt compression, token saving, reduce tokens
  role: expert
  scope: optimization
  output-format: document
  related-skills: prompt-engineer, code-reviewer
---

# Token Optimizer

Expert in maximizing LLM value while minimizing token consumption and API costs.

## When to Use This Skill

- Reducing LLM API costs (OpenAI, Anthropic, Google)
- Optimizing prompts for token efficiency
- Implementing prompt caching strategies
- Managing context window limits
- Designing cost-aware AI architectures
- Compressing context without losing quality
- Building token usage monitoring

## Core Workflow

1. **Audit current usage** - Measure tokens per request, identify waste
2. **Compress prompts** - Remove redundancy, use abbreviations, merge similar instructions
3. **Optimize context** - Summarize history, prioritize relevant information
4. **Implement caching** - Cache common prefixes, system prompts, few-shot examples
5. **Monitor costs** - Track token usage per feature, set budgets

## Token Reduction Techniques

### Prompt Compression
```markdown
# Before (verbose - 150 tokens)
You are a helpful assistant that helps users with their coding questions.
When you receive a question, you should analyze it carefully and provide
a comprehensive answer. Make sure to include code examples when relevant.

# After (compressed - 45 tokens)
Role: Coding assistant. Analyze questions, provide answers with code examples.
```

### System Prompt Optimization
```markdown
# Before (redundant)
- Do not include unnecessary information
- Be concise
- Avoid repetition
- Keep answers short
- Don't ramble

# After (deduplicated)
Constraints: Be concise. No redundancy.
```

### Few-Shot Example Optimization
```markdown
# Before (full examples - 500 tokens)
Example 1: [100 tokens]
Example 2: [100 tokens]
Example 3: [100 tokens]

# After (compressed - 150 tokens)
Examples:
- Input: X -> Output: Y
- Input: A -> Output: B
- Input: C -> Output: C
```

## Caching Strategies

| Strategy | Savings | Implementation |
|----------|---------|----------------|
| System prompt caching | 30-50% | Keep prefix stable |
| Few-shot caching | 20-40% | Use same examples |
| Semantic caching | 40-70% | Cache similar queries |
| Response caching | 60-90% | Cache exact matches |

## Cost Comparison Guide

| Model | Input Cost | Output Cost | Best For |
|-------|-----------|-------------|----------|
| GPT-4o-mini | $0.15/M | $0.60/M | Simple tasks |
| GPT-4o | $2.50/M | $10/M | Complex reasoning |
| Claude 3.5 Sonnet | $3/M | $15/M | Code, analysis |
| Gemini 1.5 Flash | $0.075/M | $0.30/M | High volume |

## Monitoring Template

```javascript
const trackTokens = (model, inputTokens, outputTokens) => {
  const cost = calculateCost(model, inputTokens, outputTokens);
  console.log(`Tokens: ${inputTokens} in / ${outputTokens} out / $${cost}`);
};
```

## Constraints

### MUST DO
- Measure token usage before and after optimization
- Maintain response quality while reducing tokens
- Implement streaming for long responses
- Cache stable prefixes (system prompts, few-shot)
- Use smaller models for simple tasks
- Set token budgets per feature

### MUST NOT DO
- Sacrifice accuracy for token savings
- Skip quality validation after compression
- Hardcode token limits (make configurable)
- Ignore model-specific tokenization differences
- Cache sensitive/user-specific data

## Knowledge Reference

Tokenization, tiktoken, prompt engineering, context windows, semantic caching, KV-cache, prompt compression, cost optimization, model routing, streaming responses
