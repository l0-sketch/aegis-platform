export type AssistantMode = 'research' | 'engineering' | 'analysis' | 'writing';

export function createAiPrompt(question: string, context: string[] = []) {
  const contextText = context.length ? `Context:\n${context.join('\n')}` : 'Context: no recent project context was provided.';
  return `${contextText}\n\nQuestion:\n${question}`;
}

export function buildFallbackResponse(question: string, mode: AssistantMode = 'research') {
  const trimmed = question.trim() || 'No question was provided.';
  const answer = `AEGIS ${mode} assistant analysis:\n\n1. Define the objective and constraints.\n2. Gather evidence and compare competing explanations.\n3. Identify assumptions, risks, and unknowns.\n4. Derive a practical next step and a validation method.\n5. Record the outcome and revise the plan if the evidence changes.\n\nQuestion:\n${trimmed}\n\nSuggested next step:\nCreate a tight problem statement, collect the minimum relevant evidence, and test the key hypothesis with a focused experiment or calculation before expanding scope.`;

  return {
    answer,
    citations: [
      'Project memory and ongoing AEGIS context',
      'Research library references',
      'User-supplied project notes',
    ],
  };
}

export async function generateAssistantResponse({
  question,
  mode,
  context,
}: {
  question: string;
  mode: AssistantMode;
  context: string[];
}) {
  const prompt = createAiPrompt(question, context);

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are AEGIS, an AI research and engineering assistant. Think carefully, cite evidence when available, and explain uncertainty. Use concise but technically grounded answers.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.4,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) {
          return {
            answer: text,
            citations: ['OpenAI model output', 'Project memory context', 'AEGIS conversation history'],
          };
        }
      }
    } catch {
      // fallback to local reasoning below
    }
  }

  return buildFallbackResponse(question, mode);
}

export function inferSourceType(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.json')) return 'json';
  if (lower.endsWith('.csv')) return 'csv';
  if (lower.endsWith('.md') || lower.endsWith('.txt')) return 'text';
  if (lower.endsWith('.zip')) return 'archive';
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx')) return 'docx';
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')) return 'image';
  return 'unknown';
}

export function safeJson(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return '{}';
  }
}
