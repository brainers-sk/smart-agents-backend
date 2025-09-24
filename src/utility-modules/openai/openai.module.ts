import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { OpenAiService } from './openai.service'

@Module({
  imports: [ConfigModule],
  providers: [OpenAiService],
  exports: [OpenAiService], // so other modules can inject it
})
export class OpenAiModule {}
