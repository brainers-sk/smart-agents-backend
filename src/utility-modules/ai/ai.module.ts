import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OpenAiService } from './openai.service'
import { MsCopilotService } from './ms-copilot.service'

@Module({
  imports: [ConfigModule],
  providers: [OpenAiService, MsCopilotService],
  exports: [OpenAiService, MsCopilotService], // so other modules can inject it
})
export class OpenAiModule {}
