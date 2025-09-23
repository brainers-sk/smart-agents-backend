import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { PrismaModule } from 'src/utility-modules/prisma/prisma.module'
import { OpenAiModule } from 'src/utility-modules/openai/openai.module'
import { AuthModule } from 'src/utility-modules/auth/auth.module'
import { ThrottlerModule } from 'src/utility-modules/throttler/throttler.module'

@Module({
  imports: [AuthModule, PrismaModule, OpenAiModule, ThrottlerModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
