import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/utility-modules/prisma/prisma.module'

import { AuthModule } from 'src/utility-modules/auth/auth.module'
import { ThrottlerModule } from 'src/utility-modules/throttler/throttler.module'

import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { OpenAiModule } from 'src/utility-modules/ai/ai.module'

@Module({
  imports: [AuthModule, PrismaModule, OpenAiModule, ThrottlerModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
