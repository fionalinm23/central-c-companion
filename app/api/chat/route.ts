import Anthropic from '@anthropic-ai/sdk';
import { getMemoryContext } from '@/lib/memory';
import type { Message } from '@/types';

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { messages }: { messages: Message[] } = await request.json();

  const memory = await getMemoryContext();

  const systemPrompt = [
    'You are a warm, thoughtful AI companion. Be concise and genuine.',
    memory,
  ]
    .filter(Boolean)
    .join('\n\n');

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
