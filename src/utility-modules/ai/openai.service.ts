import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class OpenAiService {
  private client: OpenAI

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    })
  }

  async chat(
    model: string,
    systemPrompt: string,
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    temperature = 0.2,
  ) {
    const res = await this.client.chat.completions.create({
      model,
      temperature,
      messages: [
        {
          role: 'system',
          content: `${systemPrompt}
        ---
        📌 IMPORTANT: Všetky odpovede vracaj vo formáte Markdown (odrážky, tučné písmo, nadpisy, linky).`,
        },
        ...messages,
      ],
    })
    return res.choices[0]?.message?.content ?? ''
  }
}
